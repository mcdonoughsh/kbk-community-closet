import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Contact, PrismaClient } from "@prisma/client";
import { findOrCreateContactByEmail, normalizeEmail } from "./contacts";

function makeContact(overrides: Partial<Contact> = {}): Contact {
  return {
    id: "contact-1",
    name: "Ada",
    phone: "555-0100",
    email: "ada@example.com",
    source: "INTERNAL",
    sourceDetail: null,
    userProfileId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
    ...overrides,
  };
}

describe("contacts", () => {
  it("normalizes email", () => {
    expect(normalizeEmail("  Ada@Example.COM ")).toBe("ada@example.com");
  });

  describe("findOrCreateContactByEmail", () => {
    const findFirst = vi.fn();
    const create = vi.fn();
    const update = vi.fn();
    const prisma = {
      contact: { findFirst, create, update },
    } as unknown as PrismaClient;

    beforeEach(() => {
      findFirst.mockReset();
      create.mockReset();
      update.mockReset();
    });

    it("creates a new contact when email is missing", async () => {
      create.mockResolvedValue(makeContact({ email: null, phone: "" }));
      const result = await findOrCreateContactByEmail(prisma, {
        name: "Bob",
        phone: "",
        source: "INTERNAL",
      });
      expect(create).toHaveBeenCalledWith({
        data: {
          name: "Bob",
          phone: "",
          email: null,
          source: "INTERNAL",
          sourceDetail: null,
        },
      });
      expect(result.email).toBeNull();
      expect(findFirst).not.toHaveBeenCalled();
    });

    it("reuses and updates an existing contact by email", async () => {
      const existing = makeContact();
      findFirst.mockResolvedValue(existing);
      update.mockResolvedValue(
        makeContact({ name: "Ada Lovelace", phone: "555-9999" })
      );

      const result = await findOrCreateContactByEmail(prisma, {
        name: "Ada Lovelace",
        email: "ADA@example.com",
        phone: "555-9999",
        source: "EVENT",
        sourceDetail: "fall-2026",
      });

      expect(update).toHaveBeenCalledWith({
        where: { id: "contact-1" },
        data: { name: "Ada Lovelace", phone: "555-9999", email: "ada@example.com" },
      });
      expect(create).not.toHaveBeenCalled();
      expect(result.name).toBe("Ada Lovelace");
    });

    it("keeps the original source when an existing contact matches", async () => {
      const existing = makeContact({ source: "REQUEST" });
      findFirst.mockResolvedValue(existing);

      const result = await findOrCreateContactByEmail(prisma, {
        name: "Ada",
        email: "ada@example.com",
        phone: "555-0100",
        source: "EVENT",
        sourceDetail: "fall-2026",
      });

      expect(result).toBe(existing);
      expect(update).not.toHaveBeenCalled();
      expect(create).not.toHaveBeenCalled();
    });

    it("records source and detail when no email match exists", async () => {
      findFirst.mockResolvedValue(null);
      create.mockResolvedValue(makeContact());
      await findOrCreateContactByEmail(prisma, {
        name: "Ada",
        email: "ada@example.com",
        phone: "555-0100",
        source: "EVENT",
        sourceDetail: "fall-2026",
      });
      expect(create).toHaveBeenCalledWith({
        data: {
          name: "Ada",
          phone: "555-0100",
          email: "ada@example.com",
          source: "EVENT",
          sourceDetail: "fall-2026",
        },
      });
    });
  });
});
