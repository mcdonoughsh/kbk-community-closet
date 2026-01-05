import { describe, it, expect } from "vitest";
import { appRouter } from "./index";
import { createContext } from "../trpc";

describe("App Router", () => {
  it("should have health check endpoint", async () => {
    const ctx = await createContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.health();
    
    expect(result).toEqual({
      status: "ok",
      message: "KBK Community Closet API is running",
    });
  });
});
