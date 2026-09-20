import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { VolunteerSignupSource } from "@prisma/client";
import { findOrCreateContactByEmail } from "@/lib/contacts";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { router, publicProcedure, adminProcedure } from "../trpc";

const slotTimesSchema = z
  .object({
    startsAt: z.coerce.date(),
    endsAt: z.coerce.date(),
    capacity: z.number().int().min(1).max(500),
  })
  .refine((data) => data.endsAt > data.startsAt, {
    message: "End time must be after start time",
    path: ["endsAt"],
  });

const createSlotSchema = slotTimesSchema;

const updateSlotSchema = z
  .object({
    id: z.string().uuid(),
    startsAt: z.coerce.date(),
    endsAt: z.coerce.date(),
    capacity: z.number().int().min(1).max(500),
  })
  .refine((data) => data.endsAt > data.startsAt, {
    message: "End time must be after start time",
    path: ["endsAt"],
  });

const signUpSchema = z.object({
  slotId: z.string().uuid(),
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone is required").max(40),
  turnstileToken: z.string().min(1, "Captcha is required"),
});

const addSignupSchema = z.object({
  slotId: z.string().uuid(),
  name: z.string().min(1, "Name is required").max(200),
  email: z
    .string()
    .email()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v && v.length > 0 ? v : undefined)),
  phone: z
    .string()
    .max(40)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v && v.length > 0 ? v : undefined)),
});

/**
 * Volunteer slot router
 * - listOpenSlots / signUp: public
 * - listSlots / createSlot / updateSlot / softDeleteSlot / addSignup / removeSignup: admin
 */
export const volunteerRouter = router({
  listOpenSlots: publicProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const slots = await ctx.prisma.volunteerSlot.findMany({
      where: {
        isDeleted: false,
        startsAt: { gt: now },
      },
      orderBy: { startsAt: "asc" },
      include: {
        _count: {
          select: {
            signups: { where: { isDeleted: false } },
          },
        },
      },
    });

    return slots
      .filter((slot) => slot._count.signups < slot.capacity)
      .map((slot) => ({
        id: slot.id,
        startsAt: slot.startsAt,
        endsAt: slot.endsAt,
      }));
  }),

  signUp: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ ctx, input }) => {
      const captcha = await verifyTurnstileToken(input.turnstileToken);
      if (!captcha.success) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: captcha.error || "Captcha verification failed",
        });
      }

      const slot = await ctx.prisma.volunteerSlot.findFirst({
        where: { id: input.slotId, isDeleted: false },
        include: {
          _count: {
            select: {
              signups: { where: { isDeleted: false } },
            },
          },
        },
      });

      if (!slot) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "That volunteer slot was not found",
        });
      }

      if (slot.startsAt <= new Date()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "That volunteer slot is no longer open",
        });
      }

      if (slot._count.signups >= slot.capacity) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "That volunteer slot is full",
        });
      }

      const contact = await findOrCreateContactByEmail(ctx.prisma, {
        name: input.name,
        email: input.email,
        phone: input.phone,
      });

      const existingSignup = await ctx.prisma.volunteerSignup.findUnique({
        where: {
          slotId_contactId: {
            slotId: slot.id,
            contactId: contact.id,
          },
        },
      });

      if (existingSignup && !existingSignup.isDeleted) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You are already signed up for this slot",
        });
      }

      if (existingSignup?.isDeleted) {
        await ctx.prisma.volunteerSignup.update({
          where: { id: existingSignup.id },
          data: {
            isDeleted: false,
            source: VolunteerSignupSource.PUBLIC,
          },
        });
      } else {
        await ctx.prisma.volunteerSignup.create({
          data: {
            slotId: slot.id,
            contactId: contact.id,
            source: VolunteerSignupSource.PUBLIC,
          },
        });
      }

      // TODO(v1+): Slack notification on new volunteer signup
      return { success: true as const };
    }),

  listSlots: adminProcedure
    .input(
      z
        .object({
          includePast: z.boolean().optional().default(false),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const includePast = input?.includePast ?? false;
      const now = new Date();

      const slots = await ctx.prisma.volunteerSlot.findMany({
        where: {
          isDeleted: false,
          ...(includePast ? {} : { endsAt: { gte: now } }),
        },
        orderBy: { startsAt: "asc" },
        include: {
          signups: {
            where: { isDeleted: false },
            orderBy: { createdAt: "asc" },
            include: {
              contact: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true,
                },
              },
            },
          },
        },
      });

      return slots.map((slot) => ({
        id: slot.id,
        startsAt: slot.startsAt,
        endsAt: slot.endsAt,
        capacity: slot.capacity,
        signupCount: slot.signups.length,
        signups: slot.signups.map((s) => ({
          id: s.id,
          source: s.source,
          createdAt: s.createdAt,
          contact: s.contact,
        })),
      }));
    }),

  createSlot: adminProcedure
    .input(createSlotSchema)
    .mutation(async ({ ctx, input }) => {
      const slot = await ctx.prisma.volunteerSlot.create({
        data: {
          startsAt: input.startsAt,
          endsAt: input.endsAt,
          capacity: input.capacity,
        },
      });
      return slot;
    }),

  updateSlot: adminProcedure
    .input(updateSlotSchema)
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.volunteerSlot.findFirst({
        where: { id: input.id, isDeleted: false },
        include: {
          _count: {
            select: {
              signups: { where: { isDeleted: false } },
            },
          },
        },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Slot not found",
        });
      }

      if (input.capacity < existing._count.signups) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Capacity cannot be less than current signups (${existing._count.signups})`,
        });
      }

      return ctx.prisma.volunteerSlot.update({
        where: { id: input.id },
        data: {
          startsAt: input.startsAt,
          endsAt: input.endsAt,
          capacity: input.capacity,
        },
      });
    }),

  softDeleteSlot: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.volunteerSlot.findFirst({
        where: { id: input.id, isDeleted: false },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Slot not found",
        });
      }

      await ctx.prisma.volunteerSlot.update({
        where: { id: input.id },
        data: { isDeleted: true },
      });

      return { success: true as const };
    }),

  addSignup: adminProcedure
    .input(addSignupSchema)
    .mutation(async ({ ctx, input }) => {
      const slot = await ctx.prisma.volunteerSlot.findFirst({
        where: { id: input.slotId, isDeleted: false },
        include: {
          _count: {
            select: {
              signups: { where: { isDeleted: false } },
            },
          },
        },
      });

      if (!slot) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Slot not found",
        });
      }

      if (slot._count.signups >= slot.capacity) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "That volunteer slot is full",
        });
      }

      const contact = await findOrCreateContactByEmail(ctx.prisma, {
        name: input.name,
        email: input.email,
        phone: input.phone,
      });

      const existingSignup = await ctx.prisma.volunteerSignup.findUnique({
        where: {
          slotId_contactId: {
            slotId: slot.id,
            contactId: contact.id,
          },
        },
      });

      if (existingSignup && !existingSignup.isDeleted) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "That person is already signed up for this slot",
        });
      }

      if (existingSignup?.isDeleted) {
        return ctx.prisma.volunteerSignup.update({
          where: { id: existingSignup.id },
          data: {
            isDeleted: false,
            source: VolunteerSignupSource.ADMIN,
          },
          include: {
            contact: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        });
      }

      return ctx.prisma.volunteerSignup.create({
        data: {
          slotId: slot.id,
          contactId: contact.id,
          source: VolunteerSignupSource.ADMIN,
        },
        include: {
          contact: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      });
    }),

  removeSignup: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.volunteerSignup.findFirst({
        where: { id: input.id, isDeleted: false },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Signup not found",
        });
      }

      await ctx.prisma.volunteerSignup.update({
        where: { id: input.id },
        data: { isDeleted: true },
      });

      return { success: true as const };
    }),
});
