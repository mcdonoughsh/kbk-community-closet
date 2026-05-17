import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/** Lightweight DB aliveness check — verifies the connection can run a query. */
export async function pingDatabase(
  db: Pick<PrismaClient, "$queryRaw"> = prisma
): Promise<void> {
  await db.$queryRaw`SELECT 1`;
}
