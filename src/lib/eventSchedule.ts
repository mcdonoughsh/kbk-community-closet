import { ORG_TZ, toOrgDateKey } from "./timezone";

const DAY_MS = 24 * 60 * 60 * 1000;

function dateKeyToUtcMidnight(dateKey: string): number {
  const [year, month, day] = dateKey.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

/**
 * A Date that falls on `dateKey` (YYYY-MM-DD) in the org timezone.
 * Noon UTC is the same calendar day in Eastern Time year-round.
 */
export function orgDateKeyToDate(dateKey: string): Date {
  return new Date(dateKeyToUtcMidnight(dateKey) + DAY_MS / 2);
}

/** Whole calendar days (Eastern Time) from `now` until `dateKey`; negative once it has passed. */
export function orgDaysUntil(dateKey: string, now: Date = new Date()): number {
  const today = dateKeyToUtcMidnight(toOrgDateKey(now));
  return Math.round((dateKeyToUtcMidnight(dateKey) - today) / DAY_MS);
}

/** True through the end of `dateKey` in Eastern Time. */
export function isOrgDateUpcoming(dateKey: string, now: Date = new Date()): boolean {
  return orgDaysUntil(dateKey, now) >= 0;
}

/** "Today", "Tomorrow", "This Saturday", "8 days away", or null once the date has passed. */
export function formatEventCountdown(
  dateKey: string,
  now: Date = new Date()
): string | null {
  const days = orgDaysUntil(dateKey, now);
  if (days < 0) return null;
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days < 7) {
    const weekday = new Intl.DateTimeFormat("en-US", {
      timeZone: ORG_TZ,
      weekday: "long",
    }).format(orgDateKeyToDate(dateKey));
    return `This ${weekday}`;
  }
  return `${days} days away`;
}

/** Short label like "Sat, Oct 17". */
export function formatOrgShortDay(dateKey: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: ORG_TZ,
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(orgDateKeyToDate(dateKey));
}
