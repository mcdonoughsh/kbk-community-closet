import { router, publicProcedure } from "../trpc";
import { requestRouter } from "./request";
import { adminRouter } from "./admin";

/**
 * Main tRPC router
 * Combine all sub-routers here
 */
export const appRouter = router({
  health: publicProcedure.query(async ({ ctx }) => {
    await ctx.prisma.$queryRaw`SELECT 1`;
    return { status: "ok", message: "KBK Community Closet API is running" };
  }),

  request: requestRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
