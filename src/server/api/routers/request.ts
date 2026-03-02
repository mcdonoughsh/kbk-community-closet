import { z } from "zod";
import { TRPCError } from "@trpc/server";
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
  status: z.enum(["NEW", "ASSIGNED", "FULFILLED"]),
});

/**
 * Request router
 * - itemTypes: public (reference data for forms)
 * - submit: public (anonymous users can submit requests)
 * - list: protected (volunteers and admins can view requests)
 * - updateStatus: protected (volunteers can mark fulfilled, admins can do anything)
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
      const { contact, items, additionalInfo, curatedBags: _curatedBags } = input;
      // curatedBags accepted for future persistence; data model TBD

      // Resolve item type names → IDs (case-insensitive)
      const requestedNames = items.map((i) => i.itemTypeName);
      const allItemTypes = await ctx.prisma.itemType.findMany({
        where: { isDeleted: false },
      });

      const nameToId = new Map(
        allItemTypes.map((t) => [t.name.toLowerCase(), t.id])
      );

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
        };
      });

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
            create: resolvedItems,
          },
        },
        include: {
          contact: true,
          items: { include: { itemType: true } },
        },
      });

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
});
