import { describe, it, expect, vi } from "vitest";
import { appRouter } from "./index";
import type { Context } from "../trpc";

describe("App Router", () => {
  it("should have health check endpoint", async () => {
    const mockCtx: Context = {
      prisma: {
        $queryRaw: vi.fn().mockResolvedValue([{ "?column?": 1 }]),
      } as unknown as Context["prisma"],
      user: null,
      userProfile: null,
    };
    const caller = appRouter.createCaller(mockCtx);

    const result = await caller.health();

    expect(result).toEqual({
      status: "ok",
      message: "KBK Community Closet API is running",
    });
  });
});
