import { initTRPC } from "@trpc/server";
import { prisma } from "@/lib/prisma";

/**
 * Context type for tRPC
 */
type Context = {
  prisma: typeof prisma;
};

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().create();

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;

/**
 * Create context for tRPC
 */
export const createContext = async (): Promise<Context> => {
  return {
    prisma,
  };
};
