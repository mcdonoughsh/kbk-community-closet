import { router } from "../trpc";
import { publicProcedure } from "../trpc";
import { z } from "zod";

/**
 * Main tRPC router
 * Combine all sub-routers here
 */
export const appRouter = router({
  // Example procedure - replace with your actual routes
  health: publicProcedure.query(() => {
    return { status: "ok", message: "KBK Community Closet API is running" };
  }),
});

export type AppRouter = typeof appRouter;
