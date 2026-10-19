import type { Prisma } from "@prisma/client";

/** Admins and volunteers: a linked user profile or any volunteer signup. */
export function volunteersWhere(): Prisma.ContactWhereInput {
  return {
    isDeleted: false,
    OR: [
      { userProfile: { is: { isDeleted: false } } },
      { volunteerSignups: { some: { isDeleted: false } } },
    ],
  };
}

/** Anyone who has submitted a request. */
export function requestersWhere(): Prisma.ContactWhereInput {
  return {
    isDeleted: false,
    requests: { some: { isDeleted: false } },
  };
}

/** Anyone who signed up for early access, optionally for one event slug (e.g. "fall-2026"). */
export function eventGoersWhere(eventSlug?: string): Prisma.ContactWhereInput {
  return {
    isDeleted: false,
    earlyAccessSignups: {
      some: { isDeleted: false, ...(eventSlug ? { eventSlug } : {}) },
    },
  };
}
