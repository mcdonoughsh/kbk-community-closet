import type { Contact, ContactSource, PrismaClient } from "@prisma/client";

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

type FindOrCreateContactInput = {
  name: string;
  email?: string | null;
  phone?: string | null;
  /** Recorded only when a new contact is created. */
  source: ContactSource;
  sourceDetail?: string | null;
};

/**
 * Find an existing non-deleted contact by normalized email, or create one.
 * When email is missing, always creates a new contact (admin manual-add path).
 * Updates name/phone on an existing match when new non-empty values are provided;
 * an existing contact keeps its original source.
 */
export async function findOrCreateContactByEmail(
  prisma: PrismaClient,
  input: FindOrCreateContactInput
): Promise<Contact> {
  const name = input.name.trim();
  const phone = (input.phone ?? "").trim();
  const emailRaw = (input.email ?? "").trim();
  const email = emailRaw ? normalizeEmail(emailRaw) : null;
  const source = {
    source: input.source,
    sourceDetail: input.sourceDetail ?? null,
  };

  if (!email) {
    return prisma.contact.create({
      data: {
        name,
        phone,
        email: null,
        ...source,
      },
    });
  }

  const existing = await prisma.contact.findFirst({
    where: {
      isDeleted: false,
      email: { equals: email, mode: "insensitive" },
    },
    orderBy: { createdAt: "asc" },
  });

  if (!existing) {
    return prisma.contact.create({
      data: {
        name,
        phone,
        email,
        ...source,
      },
    });
  }

  const nextName = name || existing.name;
  const nextPhone = phone || existing.phone;

  if (nextName === existing.name && nextPhone === existing.phone) {
    return existing;
  }

  return prisma.contact.update({
    where: { id: existing.id },
    data: {
      name: nextName,
      phone: nextPhone,
      email,
    },
  });
}
