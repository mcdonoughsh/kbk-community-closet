/** Kennebunk, Maine observes Eastern Time. */
export const ORG_TZ = "America/New_York";

/**
 * Format a UTC instant as a local date+time in the org timezone.
 * Example: "Sat, Apr 4, 2026, 9:00 AM"
 */
export function formatOrgDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    timeZone: ORG_TZ,
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

/**
 * Format a slot range for display in the org timezone.
 * Same calendar day: "Sat, Apr 4 · 9:00 AM – 12:00 PM"
 * Different days: full start and end datetimes joined with an en dash.
 */
export function formatOrgSlotRange(
  startsAt: Date | string,
  endsAt: Date | string
): string {
  const start = typeof startsAt === "string" ? new Date(startsAt) : startsAt;
  const end = typeof endsAt === "string" ? new Date(endsAt) : endsAt;

  const dayFmt = new Intl.DateTimeFormat("en-US", {
    timeZone: ORG_TZ,
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const timeFmt = new Intl.DateTimeFormat("en-US", {
    timeZone: ORG_TZ,
    hour: "numeric",
    minute: "2-digit",
  });
  const dateKeyFmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: ORG_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const startDay = dateKeyFmt.format(start);
  const endDay = dateKeyFmt.format(end);

  if (startDay === endDay) {
    return `${dayFmt.format(start)} · ${timeFmt.format(start)} – ${timeFmt.format(end)}`;
  }

  return `${formatOrgDateTime(start)} – ${formatOrgDateTime(end)}`;
}

/**
 * Values for `<input type="datetime-local">` representing the given UTC
 * instant as wall-clock time in the org timezone (YYYY-MM-DDTHH:mm).
 */
export function toOrgDateTimeLocalValue(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: ORG_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(d);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";

  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

/**
 * Parse a datetime-local string (YYYY-MM-DDTHH:mm) as wall-clock time in
 * America/New_York and return the corresponding UTC Date.
 */
export function parseOrgDateTimeLocal(value: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value.trim());
  if (!match) {
    throw new Error(`Invalid datetime-local value: ${value}`);
  }

  const [, year, month, day, hour, minute] = match.map(Number) as [
    string,
    number,
    number,
    number,
    number,
    number,
  ];

  // Guess UTC, then correct by the offset America/New_York has at that instant.
  let utcGuess = Date.UTC(year, month - 1, day, hour, minute, 0);
  for (let i = 0; i < 2; i++) {
    const offsetMs = getTimeZoneOffsetMs(ORG_TZ, new Date(utcGuess));
    utcGuess = Date.UTC(year, month - 1, day, hour, minute, 0) - offsetMs;
  }

  return new Date(utcGuess);
}

/** Offset of `timeZone` from UTC at `date`, in milliseconds (east of UTC is positive). */
function getTimeZoneOffsetMs(timeZone: string, date: Date): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  const parts = dtf.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value ?? "0");

  const asUTC = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour"),
    get("minute"),
    get("second")
  );
  return asUTC - date.getTime();
}
