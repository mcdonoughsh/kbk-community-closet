import { toOrgDateKey } from "./timezone";

type GroupableSlot = {
  title: string;
  startsAt: Date | string;
};

export type VolunteerSlotDayGroup<T extends GroupableSlot> = {
  dateKey: string;
  slots: T[];
};

export type VolunteerSlotTitleGroup<T extends GroupableSlot> = {
  title: string;
  days: VolunteerSlotDayGroup<T>[];
};

/**
 * Group slots by title, then by calendar day (org timezone).
 * Expects slots sorted by start time; groups keep first-seen order, so titles
 * appear in order of their earliest slot.
 */
export function groupVolunteerSlots<T extends GroupableSlot>(
  slots: T[]
): VolunteerSlotTitleGroup<T>[] {
  const byTitle = new Map<string, Map<string, T[]>>();

  for (const slot of slots) {
    let days = byTitle.get(slot.title);
    if (!days) {
      days = new Map();
      byTitle.set(slot.title, days);
    }
    const dateKey = toOrgDateKey(slot.startsAt);
    const daySlots = days.get(dateKey);
    if (daySlots) {
      daySlots.push(slot);
    } else {
      days.set(dateKey, [slot]);
    }
  }

  return Array.from(byTitle, ([title, days]) => ({
    title,
    days: Array.from(days, ([dateKey, daySlots]) => ({
      dateKey,
      slots: daySlots,
    })),
  }));
}
