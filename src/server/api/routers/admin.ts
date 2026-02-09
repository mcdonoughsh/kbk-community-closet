import { z } from "zod";
import { router, adminProcedure, protectedProcedure } from "../trpc";

/**
 * Admin router
 * - me: protected (current user profile for the admin UI header)
 * - assignRequest: admin-only (assign a request to a volunteer)
 * - deleteRequest: admin-only (soft delete a request)
 * - listVolunteers: admin-only (list all volunteer profiles)
 * - itemTypes: protected (list all item types for forms/reference)
 */
export const adminRouter = router({
  /**
   * Get the current user's profile (any authenticated user)
   * Returns display name and role for the admin UI header.
   */
  me: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.prisma.userProfile.findUnique({
      where: { id: ctx.userProfile.id },
      include: { contact: true },
    });

    return {
      role: ctx.userProfile.role,
      displayName: profile?.contact?.name || ctx.user.email || "Admin",
    };
  }),

  /**
   * Assign a request to a volunteer (admin only)
   */
  assignRequest: adminProcedure
    .input(
      z.object({
        requestId: z.string().uuid(),
        assignedToId: z.string().uuid().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.prisma.request.update({
        where: { id: input.requestId },
        data: {
          assignedToId: input.assignedToId,
          status: input.assignedToId ? "ASSIGNED" : "NEW",
        },
      });

      return request;
    }),

  /**
   * Soft-delete a request (admin only)
   */
  deleteRequest: adminProcedure
    .input(z.object({ requestId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.prisma.request.update({
        where: { id: input.requestId },
        data: { isDeleted: true },
      });

      return request;
    }),

  /**
   * List all volunteers (admin only)
   */
  listVolunteers: adminProcedure.query(async ({ ctx }) => {
    const volunteers = await ctx.prisma.userProfile.findMany({
      where: { isDeleted: false },
      include: { contact: true },
      orderBy: { createdAt: "desc" },
    });

    return volunteers;
  }),

  /**
   * List all item types (any authenticated user)
   */
  itemTypes: protectedProcedure.query(async ({ ctx }) => {
    const itemTypes = await ctx.prisma.itemType.findMany({
      where: { isDeleted: false },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });

    return itemTypes;
  }),
});
