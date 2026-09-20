import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Contact, PrismaClient } from "@prisma/client";
import { findOrCreateContactByEmail, normalizeEmail } from "./contacts";

function makeContact(overrides: Partial<Contact> = {}): Contact {
  return {
    id: "contact-1",
    name: "Ada",
    phone: "555-0100",
    email: "ada@example.com",
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
      });
      expect(create).toHaveBeenCalledWith({
        data: { name: "Bob", phone: "", email: null },
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
      });

      expect(update).toHaveBeenCalled();
      expect(result.name).toBe("Ada Lovelace");
    });

    it("creates when no email match exists", async () => {
      findFirst.mockResolvedValue(null);
      create.mockResolvedValue(makeContact());
      await findOrCreateContactByEmail(prisma, {
        name: "Ada",
        email: "ada@example.com",
        phone: "555-0100",
      });
      expect(create).toHaveBeenCalled();
    });
  });
});
