import { describe, it, expect } from "vitest";
import { groupVolunteerSlots } from "./volunteerSlots";

describe("groupVolunteerSlots", () => {
  it("groups by title, then by Eastern calendar day, preserving order", () => {
    const slots = [
      { id: "a", title: "Harvestfest - Clean Up", startsAt: "2026-11-01T13:00:00.000Z" },
      { id: "b", title: "Volunteer Day - Sorting", startsAt: "2026-11-01T14:00:00.000Z" },
      { id: "c", title: "Harvestfest - Clean Up", startsAt: "2026-11-01T15:00:00.000Z" },
      { id: "d", title: "Harvestfest - Clean Up", startsAt: "2026-11-01T17:00:00.000Z" },
      { id: "e", title: "Harvestfest - Clean Up", startsAt: "2026-11-08T14:00:00.000Z" },
    ];

    const groups = groupVolunteerSlots(slots);

    expect(groups.map((g) => g.title)).toEqual([
      "Harvestfest - Clean Up",
      "Volunteer Day - Sorting",
    ]);
    expect(groups[0].days).toEqual([
      { dateKey: "2026-11-01", slots: [slots[0], slots[2], slots[3]] },
      { dateKey: "2026-11-08", slots: [slots[4]] },
    ]);
    expect(groups[1].days).toEqual([
      { dateKey: "2026-11-01", slots: [slots[1]] },
    ]);
  });
});
