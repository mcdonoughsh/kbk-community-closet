import { initTRPC } from "@trpc/server";
import { prisma } from "@/lib/prisma";
import type { PrismaClient } from "@prisma/client";

/**
 * Context type for tRPC
 * Includes the Prisma client for database access
 */
export type Context = {
  prisma: PrismaClient;
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
 * Provides database client to all procedures
 */
export const createContext = async (): Promise<Context> => {
  return { prisma };
};
