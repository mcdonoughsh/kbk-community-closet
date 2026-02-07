import path from "node:path";
import { defineConfig } from "prisma/config";

// Load .env file — Prisma skips automatic .env loading when a config file exists
process.loadEnvFile(path.resolve(import.meta.dirname, ".env"));

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
});