import { router, publicProcedure } from "../trpc";

/**
 * Main tRPC router
 * Combine all sub-routers here
 */
export const appRouter = router({
  health: publicProcedure.query(async ({ ctx }) => {
    // Quick DB connectivity check
    await ctx.prisma.$queryRaw`SELECT 1`;
    return { status: "ok", message: "KBK Community Closet API is running" };
  }),
});

export type AppRouter = typeof appRouter;
