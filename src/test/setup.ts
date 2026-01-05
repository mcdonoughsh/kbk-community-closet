import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock Prisma client for tests
vi.mock("@/lib/prisma", () => ({
  prisma: {
    // Add mocked Prisma methods as needed for tests
  },
}));
