import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { RequestStatus } from "@prisma/client";
import { scheduleNewRequestSlackNotification } from "@/lib/slack-notify";
import { router, publicProcedure, protectedProcedure } from "../trpc";

/**
 * Zod schema for submitting a request (public)
 * Uses item type names (not UUIDs) so the frontend doesn't need to look up IDs.
 */
const submitRequestSchema = z.object({
  contact: z.object({
    name: z.string().min(1, "Name is required"),
    phone: z.string().min(1, "Phone is required"),
    email: z.string().email().optional().or(z.literal("")),
  }),
  curatedBags: z
    .array(
      z.object({
        size: z.string().min(1),
        quantity: z.number().int().min(1).max(10),
        gender: z.string().nullable().optional(),
      })
    )
    .optional(),
  items: z.array(
    z.object({
      itemTypeName: z.string().min(1, "Item type name is required"),
      size: z.string().nullable().optional(),
      gender: z.string().nullable().optional(),
    })
  ),
  additionalInfo: z.string().optional(),
}).refine(
  (data) =>
    (data.curatedBags != null && data.curatedBags.length > 0) ||
    data.items.length > 0,
  {
    message:
      "At least one curated bag or one clothing/gear item is required",
    path: ["items"],
  }
);

/**
 * Zod schema for updating request status (protected)
 */
const updateStatusSchema = z.object({
  requestId: z.string().uuid(),
  status: z.nativeEnum(RequestStatus),
});

const updateAssigneeSchema = z.object({
  requestId: z.string().uuid(),
  assignee: z
    .union([z.string().max(100), z.literal(""), z.null()])
    .transform((v) => {
      if (v === null || v === "") return null;
      const t = v.trim();
      return t.length === 0 ? null : t;
    }),
});

/**
 * Request router
 * - itemTypes: public (reference data for forms)
 * - submit: public (anonymous users can submit requests)
 * - list: protected (volunteers and admins can view requests)
 * - updateStatus: protected (volunteers and admins can set status per Prisma enum)
 * - updateAssignee: protected (free-text assignee, max 100 chars)
 */
export const requestRouter = router({
  /**
   * List all item types (public — needed by the request form)
   */
  itemTypes: publicProcedure.query(async ({ ctx }) => {
    const itemTypes = await ctx.prisma.itemType.findMany({
      where: { isDeleted: false },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });
    return itemTypes;
  }),

  /**
   * Submit a new request (public, anonymous)
   * Accepts item type names and resolves them to IDs server-side.
   */
  submit: publicProcedure
    .input(submitRequestSchema)
    .mutation(async ({ ctx, input }) => {
      const { contact, items, additionalInfo, curatedBags } = input;

      const allItemTypes = await ctx.prisma.itemType.findMany({
        where: { isDeleted: false },
      });

      const nameToId = new Map(
        allItemTypes.map((t) => [t.name.toLowerCase(), t.id])
      );

      const curatedBagTypeId = nameToId.get("curated bag");
      if (
        curatedBags != null &&
        curatedBags.length > 0 &&
        curatedBagTypeId == null
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            'Curated bag requests require the "Curated bag" item type in the database. Run the database seed (e.g. npm run db:seed).',
        });
      }

      // Validate all names resolve to real item types
      const resolvedItems = items.map((item) => {
        const id = nameToId.get(item.itemTypeName.toLowerCase());
        if (!id) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Unknown item type: "${item.itemTypeName}". Valid types: ${allItemTypes.map((t) => t.name).join(", ")}`,
          });
        }
        return {
          itemTypeId: id,
          size: item.size ?? null,
          gender: item.gender ?? null,
          quantity: 1,
        };
      });

      const curatedBagRows =
        curatedBags != null && curatedBags.length > 0 && curatedBagTypeId != null
          ? curatedBags.map((bag) => ({
              itemTypeId: curatedBagTypeId,
              size: bag.size,
              gender: bag.gender ?? null,
              quantity: bag.quantity,
            }))
          : [];

      const request = await ctx.prisma.request.create({
        data: {
          contact: {
            create: {
              name: contact.name,
              phone: contact.phone,
              email: contact.email || null,
            },
          },
          additionalInfo: additionalInfo || null,
          items: {
            create: [...resolvedItems, ...curatedBagRows],
          },
        },
        include: {
          contact: true,
          items: { include: { itemType: true } },
        },
      });

      scheduleNewRequestSlackNotification(request);

      return request;
    }),

  /**
   * List all requests (protected — volunteers and admins)
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    const requests = await ctx.prisma.request.findMany({
      where: { isDeleted: false },
      include: {
        contact: true,
        items: { include: { itemType: true }, where: { isDeleted: false } },
        assignedTo: {
          include: { contact: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return requests;
  }),

  /**
   * Get a single request by ID (protected)
   */
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const request = await ctx.prisma.request.findUnique({
        where: { id: input.id, isDeleted: false },
        include: {
          contact: true,
          items: { include: { itemType: true }, where: { isDeleted: false } },
          assignedTo: {
            include: { contact: true },
          },
        },
      });

      return request;
    }),

  /**
   * Update request status (protected)
   */
  updateStatus: protectedProcedure
    .input(updateStatusSchema)
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.prisma.request.update({
        where: { id: input.requestId },
        data: { status: input.status },
      });

      return request;
    }),

  /**
   * Update free-text assignee (protected)
   */
  updateAssignee: protectedProcedure
    .input(updateAssigneeSchema)
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.prisma.request.update({
        where: { id: input.requestId },
        data: { assignee: input.assignee },
      });

      return request;
    }),
});
