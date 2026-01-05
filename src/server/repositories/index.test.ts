import { describe, it, expect, vi, beforeEach } from "vitest";
import { BaseRepository } from "./index";

describe("BaseRepository", () => {
  it("should have prisma client available", () => {
    const repository = new BaseRepository();
    expect(repository.prisma).toBeDefined();
  });
});
