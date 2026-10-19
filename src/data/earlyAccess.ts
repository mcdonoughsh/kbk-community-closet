import { FALL_POPUP_2026, type EventDayHours } from "./events";

export type EarlyAccessEvent = {
  /** URL segment under /early-access and the key stored on each signup. */
  slug: string;
  title: string;
  venue: string;
  address: string;
  /** Signups close after this day, YYYY-MM-DD in Eastern Time. */
  endDateKey: string;
  hours: readonly EventDayHours[];
};

/** Newest first. Adding an entry publishes a new unlisted signup page. */
export const EARLY_ACCESS_EVENTS: readonly EarlyAccessEvent[] = [
  {
    slug: "fall-2026",
    title: FALL_POPUP_2026.title,
    venue: FALL_POPUP_2026.venue,
    address: FALL_POPUP_2026.address,
    endDateKey: FALL_POPUP_2026.endDateKey,
    hours: FALL_POPUP_2026.hours,
  },
];

export function getEarlyAccessEvent(slug: string): EarlyAccessEvent | null {
  return EARLY_ACCESS_EVENTS.find((event) => event.slug === slug) ?? null;
}
