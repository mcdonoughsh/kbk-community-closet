import { describe, it, expect, vi } from "vitest";
import { appRouter } from "./index";
import type { Context } from "../trpc";

vi.mock("@/lib/slack-notify", () => ({
  scheduleNewRequestSlackNotification: vi.fn(),
}));

const existingContact = {
  id: "contact-1",
  name: "Ada",
  phone: "555-0100",
  email: "ada@example.com",
  source: "EVENT",
  sourceDetail: "fall-2026",
};

function createCtx(contactMatch: typeof existingContact | null) {
  const prisma = {
    itemType: {
      findMany: vi.fn().mockResolvedValue([{ id: "type-shirt", name: "Shirt" }]),
    },
    contact: {
      findFirst: vi.fn().mockResolvedValue(contactMatch),
      create: vi.fn().mockResolvedValue({ ...existingContact, id: "contact-new", source: "REQUEST" }),
      update: vi.fn(),
    },
    request: {
      create: vi.fn().mockResolvedValue({ id: "request-1" }),
    },
  };
  const ctx: Context = {
    prisma: prisma as unknown as Context["prisma"],
    user: null,
    userProfile: null,
  };
  return { ctx, prisma };
}

const input = {
  contact: { name: "Ada", phone: "555-0100", email: "ada@example.com" },
  items: [{ itemTypeName: "Shirt", size: "4T", gender: null }],
};

describe("request.submit", () => {
  it("reuses an existing contact with the same email", async () => {
    const { ctx, prisma } = createCtx(existingContact);
    await appRouter.createCaller(ctx).request.submit(input);

    expect(prisma.contact.create).not.toHaveBeenCalled();
    expect(prisma.request.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ contactId: "contact-1" }),
      })
    );
  });

  it("creates a REQUEST contact when no email match exists", async () => {
    const { ctx, prisma } = createCtx(null);
    await appRouter.createCaller(ctx).request.submit(input);

    expect(prisma.contact.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ source: "REQUEST", sourceDetail: null }),
    });
    expect(prisma.request.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ contactId: "contact-new" }),
      })
    );
  });
});
