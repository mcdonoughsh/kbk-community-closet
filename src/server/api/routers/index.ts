import { pingDatabase } from "@/lib/prisma";
import { router, publicProcedure } from "../trpc";
import { requestRouter } from "./request";
import { adminRouter } from "./admin";

/**
 * Main tRPC router
 * Combine all sub-routers here
 */
export const appRouter = router({
  health: publicProcedure.query(async ({ ctx }) => {
    await pingDatabase(ctx.prisma);
    return {
      status: "ok",
      database: "ok",
      message: "KBK Community Closet API is running",
    };
  }),

  request: requestRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
