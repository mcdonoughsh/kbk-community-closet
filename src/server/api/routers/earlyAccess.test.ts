import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import { appRouter } from "./index";
import type { Context } from "../trpc";

vi.mock("@/lib/turnstile", () => ({
  verifyTurnstileToken: vi.fn().mockResolvedValue({ success: true }),
}));

const contact = { id: "contact-1", name: "Ada", phone: "", email: "ada@example.com" };

function createCtx(
  existingSignup: { id: string; isDeleted: boolean } | null = null,
  existingContact: typeof contact | null = contact
) {
  const prisma = {
    contact: {
      findFirst: vi.fn().mockResolvedValue(existingContact),
      create: vi.fn().mockResolvedValue(contact),
      update: vi.fn(),
    },
    earlyAccessSignup: {
      findUnique: vi.fn().mockResolvedValue(existingSignup),
      create: vi.fn().mockResolvedValue({}),
      update: vi.fn().mockResolvedValue({}),
    },
  };
  const ctx: Context = {
    prisma: prisma as unknown as Context["prisma"],
    user: null,
    userProfile: null,
  };
  return { ctx, prisma };
}

const validInput = {
  eventSlug: "fall-2026",
  name: "Ada",
  email: "ada@example.com",
  preferredDayKey: "2026-11-13",
  donationConfirmed: true as const,
  turnstileToken: "token",
};

describe("earlyAccess.signUp", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-20T16:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("creates a signup for an event day", async () => {
    const { ctx, prisma } = createCtx();
    const result = await appRouter.createCaller(ctx).earlyAccess.signUp(validInput);

    expect(result).toEqual({ success: true, alreadySignedUp: false });
    expect(prisma.earlyAccessSignup.create).toHaveBeenCalledWith({
      data: { eventSlug: "fall-2026", contactId: "contact-1", preferredDayKey: "2026-11-13" },
    });
  });

  it("records new contacts as coming from this event", async () => {
    const { ctx, prisma } = createCtx(null, null);
    await appRouter.createCaller(ctx).earlyAccess.signUp(validInput);

    expect(prisma.contact.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ source: "EVENT", sourceDetail: "fall-2026" }),
    });
  });

  it("accepts either day as null", async () => {
    const { ctx, prisma } = createCtx();
    await appRouter.createCaller(ctx).earlyAccess.signUp({ ...validInput, preferredDayKey: null });

    expect(prisma.earlyAccessSignup.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ preferredDayKey: null }),
    });
  });

  it("updates an existing signup instead of duplicating it", async () => {
    const { ctx, prisma } = createCtx({ id: "signup-1", isDeleted: false });
    const result = await appRouter
      .createCaller(ctx)
      .earlyAccess.signUp({ ...validInput, preferredDayKey: "2026-11-14" });

    expect(result).toEqual({ success: true, alreadySignedUp: true });
    expect(prisma.earlyAccessSignup.create).not.toHaveBeenCalled();
    expect(prisma.earlyAccessSignup.update).toHaveBeenCalledWith({
      where: { id: "signup-1" },
      data: { preferredDayKey: "2026-11-14", isDeleted: false },
    });
  });

  it("rejects a day that isn't part of the event", async () => {
    const { ctx } = createCtx();
    await expect(
      appRouter.createCaller(ctx).earlyAccess.signUp({ ...validInput, preferredDayKey: "2026-11-15" })
    ).rejects.toThrow("Please pick one of the event days");
  });

  it("rejects unknown events", async () => {
    const { ctx } = createCtx();
    await expect(
      appRouter.createCaller(ctx).earlyAccess.signUp({ ...validInput, eventSlug: "spring-1999" })
    ).rejects.toThrow("Event not found");
  });

  it("closes after the last event day in Eastern Time", async () => {
    // Nov 15 05:30 UTC is Nov 15 at 12:30 AM EST
    vi.setSystemTime(new Date("2026-11-15T05:30:00.000Z"));
    const { ctx } = createCtx();
    await expect(appRouter.createCaller(ctx).earlyAccess.signUp(validInput)).rejects.toThrow(
      "Early access signups for this event have closed"
    );
  });
});

describe("earlyAccess.listSignups", () => {
  it("requires a signed-in volunteer", async () => {
    const { ctx } = createCtx();
    await expect(
      appRouter.createCaller(ctx).earlyAccess.listSignups({ eventSlug: "fall-2026" })
    ).rejects.toThrow("You must be logged in");
  });
});
