import { describe, it, expect } from "vitest";
import {
  formatOrgDayLabel,
  formatOrgSlotRange,
  formatOrgTimeRange,
  parseOrgDateTimeLocal,
  toOrgDateKey,
  toOrgDateTimeLocalValue,
  ORG_TZ,
} from "./timezone";

describe("timezone helpers", () => {
  it("exports America/New_York as org timezone", () => {
    expect(ORG_TZ).toBe("America/New_York");
  });

  it("round-trips datetime-local values in Eastern Time", () => {
    // 2026-07-04 10:30 EDT (UTC-4) → 14:30 UTC
    const utc = new Date("2026-07-04T14:30:00.000Z");
    const local = toOrgDateTimeLocalValue(utc);
    expect(local).toBe("2026-07-04T10:30");
    expect(parseOrgDateTimeLocal(local).toISOString()).toBe(utc.toISOString());
  });

  it("formats same-day ranges without repeating the date", () => {
    const start = new Date("2026-04-04T13:00:00.000Z"); // 9 AM EDT
    const end = new Date("2026-04-04T16:00:00.000Z"); // 12 PM EDT
    const label = formatOrgSlotRange(start, end);
    expect(label).toContain("–");
    expect(label).toMatch(/9:00\sAM/);
    expect(label).toMatch(/12:00\sPM/);
  });

  it("keys dates by the Eastern calendar day, not UTC", () => {
    // 2026-11-02 02:00 UTC is still Nov 1 at 9 PM EST
    expect(toOrgDateKey(new Date("2026-11-02T02:00:00.000Z"))).toBe(
      "2026-11-01"
    );
  });

  it("formats a long day label", () => {
    expect(formatOrgDayLabel(new Date("2026-11-01T14:00:00.000Z"))).toBe(
      "Sunday, November 1"
    );
  });

  it("formats same-day time ranges without the date", () => {
    const label = formatOrgTimeRange(
      new Date("2026-11-01T14:00:00.000Z"), // 9 AM EST
      new Date("2026-11-01T16:00:00.000Z") // 11 AM EST
    );
    expect(label).toMatch(/^9:00\sAM – 11:00\sAM$/);
  });
});
