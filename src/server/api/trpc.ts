import { initTRPC, TRPCError } from "@trpc/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import type { PrismaClient, UserProfile } from "@prisma/client";
import type { User } from "@supabase/supabase-js";

/**
 * Context type for tRPC
 * Includes the Prisma client and optional auth info
 */
export type Context = {
  prisma: PrismaClient;
  user: User | null;
  userProfile: UserProfile | null;
};

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().create();

/**
 * Create context for tRPC
 * Resolves auth session and user profile for every request
 */
export const createContext = async (): Promise<Context> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userProfile: UserProfile | null = null;
  if (user) {
    userProfile = await prisma.userProfile.findUnique({
      where: { supabaseUserId: user.id, isDeleted: false },
    });
  }

  return { prisma, user, userProfile };
};

/**
 * Public procedure — no auth required
 */
export const router = t.router;
export const publicProcedure = t.procedure;

/**
 * Protected procedure — requires a valid Supabase session
 */
const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.user || !ctx.userProfile) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to perform this action",
    });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
      userProfile: ctx.userProfile,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthenticated);

/**
 * Admin procedure — requires SUPER_ADMIN role
 */
const isAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.user || !ctx.userProfile) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to perform this action",
    });
  }
  if (ctx.userProfile.role !== "SUPER_ADMIN") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You do not have permission to perform this action",
    });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
      userProfile: ctx.userProfile,
    },
  });
});

export const adminProcedure = t.procedure.use(isAdmin);
