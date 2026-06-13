import { describe, it, expect } from "vitest";
import { BaseRepository } from "./index";

/** Subclass exposes protected `prisma` for type-safe assertions only in tests */
class TestRepository extends BaseRepository {
  getPrismaForTest() {
    return this.prisma;
  }
}

describe("BaseRepository", () => {
  it("should have prisma client available", () => {
    const repository = new TestRepository();
    expect(repository.getPrismaForTest()).toBeDefined();
  });
});
