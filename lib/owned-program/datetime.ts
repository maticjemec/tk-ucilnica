/**
 * Unlock timestamps are stored and compared in UTC.
 *
 * Display uses Europe/Ljubljana because the app has no per-user timezone yet
 * (settings copy lists Ljubljana as the default). Do not convert DB values
 * to local-time strings before comparison.
 */
export const ACCESS_DISPLAY_TIMEZONE = "Europe/Ljubljana";

const MONTHS_GENITIVE = [
  "januarja",
  "februarja",
  "marca",
  "aprila",
  "maja",
  "junija",
  "julija",
  "avgusta",
  "septembra",
  "oktobra",
  "novembra",
  "decembra",
] as const;

export function parseTimestamp(value: string | null | undefined): Date | null {
  if (value == null || value === "") {
    return null;
  }

  const ms = Date.parse(value);

  if (Number.isNaN(ms)) {
    return null;
  }

  return new Date(ms);
}

export function addUtcDays(date: Date, days: number) {
  const result = new Date(date.getTime());
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function zonedDateParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).formatToParts(date);

  const read = (type: Intl.DateTimeFormatPartTypes) => {
    const value = parts.find((part) => part.type === type)?.value;
    return value ? Number(value) : NaN;
  };

  return {
    day: read("day"),
    month: read("month"),
    year: read("year"),
  };
}

/**
 * Absolute calendar date in Europe/Ljubljana, e.g. "23. avgusta".
 * Includes the year when it differs from the current Ljubljana year.
 */
export function formatUnlockDate(
  date: Date,
  now: Date = new Date(),
  timeZone = ACCESS_DISPLAY_TIMEZONE,
) {
  const parts = zonedDateParts(date, timeZone);
  const current = zonedDateParts(now, timeZone);
  const monthName = MONTHS_GENITIVE[parts.month - 1];

  if (
    !Number.isFinite(parts.day) ||
    !Number.isFinite(parts.month) ||
    !Number.isFinite(parts.year) ||
    !monthName
  ) {
    return "";
  }

  const base = `${parts.day}. ${monthName}`;
  return parts.year === current.year ? base : `${base} ${parts.year}`;
}

export function formatDripAvailabilityLabel(date: Date, now?: Date) {
  const formatted = formatUnlockDate(date, now);
  return formatted ? `Na voljo ${formatted}` : "Na voljo kmalu";
}

export function formatNextLessonUnlockMessage(date: Date, now?: Date) {
  const formatted = formatUnlockDate(date, now);
  return formatted
    ? `Naslednja lekcija bo na voljo ${formatted}.`
    : "Naslednja lekcija še ni na voljo.";
}
