import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { ContactSource } from "@prisma/client";
import { findOrCreateContactByEmail } from "@/lib/contacts";
import { isOrgDateUpcoming } from "@/lib/eventSchedule";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { getEarlyAccessEvent } from "@/data/earlyAccess";
import { router, publicProcedure, protectedProcedure, adminProcedure } from "../trpc";

const signUpSchema = z.object({
  eventSlug: z.string().min(1).max(60),
  name: z.string().trim().min(1, "Name is required").max(200),
  email: z.string().trim().email("Valid email is required"),
  /** null means either day works. */
  preferredDayKey: z.string().nullable(),
  donationConfirmed: z.literal(true, {
    error: "Please confirm your clothing donation",
  }),
  turnstileToken: z.string().min(1, "Captcha is required"),
});

/**
 * Early access signups for pop-up events
 * - signUp: public
 * - listSignups: any signed-in volunteer (door check-in)
 * - removeSignup: admin
 */
export const earlyAccessRouter = router({
  signUp: publicProcedure.input(signUpSchema).mutation(async ({ ctx, input }) => {
    const captcha = await verifyTurnstileToken(input.turnstileToken);
    if (!captcha.success) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: captcha.error || "Captcha verification failed",
      });
    }

    const event = getEarlyAccessEvent(input.eventSlug);
    if (!event) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
    }

    if (!isOrgDateUpcoming(event.endDateKey)) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Early access signups for this event have closed",
      });
    }

    if (
      input.preferredDayKey !== null &&
      !event.hours.some((day) => day.dateKey === input.preferredDayKey)
    ) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Please pick one of the event days",
      });
    }

    const contact = await findOrCreateContactByEmail(ctx.prisma, {
      name: input.name,
      email: input.email,
      source: ContactSource.EVENT,
      sourceDetail: event.slug,
    });

    const existing = await ctx.prisma.earlyAccessSignup.findUnique({
      where: {
        eventSlug_contactId: { eventSlug: event.slug, contactId: contact.id },
      },
    });

    if (existing) {
      await ctx.prisma.earlyAccessSignup.update({
        where: { id: existing.id },
        data: { preferredDayKey: input.preferredDayKey, isDeleted: false },
      });
    } else {
      await ctx.prisma.earlyAccessSignup.create({
        data: {
          eventSlug: event.slug,
          contactId: contact.id,
          preferredDayKey: input.preferredDayKey,
        },
      });
    }

    return {
      success: true as const,
      alreadySignedUp: Boolean(existing && !existing.isDeleted),
    };
  }),

  listSignups: protectedProcedure
    .input(z.object({ eventSlug: z.string().min(1).max(60) }))
    .query(async ({ ctx, input }) => {
      const signups = await ctx.prisma.earlyAccessSignup.findMany({
        where: { eventSlug: input.eventSlug, isDeleted: false },
        orderBy: { createdAt: "asc" },
        include: {
          contact: { select: { name: true, email: true } },
        },
      });

      return signups.map((signup) => ({
        id: signup.id,
        name: signup.contact.name,
        email: signup.contact.email,
        preferredDayKey: signup.preferredDayKey,
        createdAt: signup.createdAt,
      }));
    }),

  removeSignup: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.earlyAccessSignup.findFirst({
        where: { id: input.id, isDeleted: false },
      });

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Signup not found" });
      }

      await ctx.prisma.earlyAccessSignup.update({
        where: { id: input.id },
        data: { isDeleted: true },
      });

      return { success: true as const };
    }),
});
