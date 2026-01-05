import { prisma } from "@/lib/prisma";

/**
 * Base repository pattern for data access layer
 * Repositories handle all database operations and should contain no business logic
 */

// Example repository structure - replace with your actual repositories
export class BaseRepository {
  protected prisma = prisma;
}

// Export individual repositories as you create them
// Example:
// export { UserRepository } from "./user.repository";
