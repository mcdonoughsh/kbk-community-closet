const NEEDS_QUOTES = /[",\r\n]/;
/** Leading characters spreadsheets treat as a formula. */
const FORMULA_PREFIX = /^[=+\-@\t\r]/;

function escapeCsvCell(value: string): string {
  const safe = FORMULA_PREFIX.test(value) ? `'${value}` : value;
  return NEEDS_QUOTES.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

/** RFC 4180 CSV with CRLF line endings. */
export function toCsv(rows: readonly (readonly string[])[]): string {
  return rows.map((row) => row.map(escapeCsvCell).join(",")).join("\r\n");
}
