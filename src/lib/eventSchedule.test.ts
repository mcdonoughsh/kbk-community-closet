import { describe, it, expect } from "vitest";
import {
  formatEventCountdown,
  formatOrgShortDay,
  isOrgDateUpcoming,
  orgDaysUntil,
} from "./eventSchedule";

const SWAP_DAY = "2026-10-17";

describe("event schedule helpers", () => {
  it("counts days using the Eastern calendar day, not UTC", () => {
    // Oct 10 01:00 UTC is still Fri, Oct 9 at 9 PM EDT
    expect(orgDaysUntil(SWAP_DAY, new Date("2026-10-10T01:00:00.000Z"))).toBe(8);
  });

  it("stays upcoming through the end of the event day in Eastern Time", () => {
    // Oct 18 03:30 UTC is Oct 17 at 11:30 PM EDT
    expect(isOrgDateUpcoming(SWAP_DAY, new Date("2026-10-18T03:30:00.000Z"))).toBe(true);
    // Oct 18 04:30 UTC is Oct 18 at 12:30 AM EDT
    expect(isOrgDateUpcoming(SWAP_DAY, new Date("2026-10-18T04:30:00.000Z"))).toBe(false);
  });

  it("formats countdown labels as the event approaches", () => {
    const at = (iso: string) => formatEventCountdown(SWAP_DAY, new Date(iso));
    expect(at("2026-10-09T16:00:00.000Z")).toBe("8 days away");
    expect(at("2026-10-10T16:00:00.000Z")).toBe("7 days away");
    expect(at("2026-10-11T16:00:00.000Z")).toBe("This Saturday");
    expect(at("2026-10-16T16:00:00.000Z")).toBe("Tomorrow");
    expect(at("2026-10-17T16:00:00.000Z")).toBe("Today");
    expect(at("2026-10-18T16:00:00.000Z")).toBeNull();
  });

  it("formats a short day label", () => {
    expect(formatOrgShortDay(SWAP_DAY)).toBe("Sat, Oct 17");
  });
});
