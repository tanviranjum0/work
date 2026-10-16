/**
 * A calendar date ("2026-12-20") with no time and no timezone.
 *
 * Flight search dates are wall-calendar days at the departure airport. Parsing
 * them with `new Date("2026-12-20")` yields UTC midnight, which renders as
 * Dec 19 west of Greenwich. Arithmetic here is done in UTC on purpose and the
 * value never round-trips through the viewer's local timezone.
 */
declare const calendarDateBrand: unique symbol;
export type CalendarDate = string & { readonly [calendarDateBrand]: true };

const PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export const isCalendarDate = (value: string): value is CalendarDate => {
  const m = PATTERN.exec(value);
  if (!m) return false;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const probe = new Date(Date.UTC(y, mo - 1, d));
  return probe.getUTCFullYear() === y && probe.getUTCMonth() === mo - 1 && probe.getUTCDate() === d;
};

export const toCalendarDate = (value: string): CalendarDate => {
  if (!isCalendarDate(value)) throw new RangeError(`Invalid calendar date: "${value}"`);
  return value;
};

const toUtcMs = (d: CalendarDate): number => {
  const [y = 0, m = 1, day = 1] = d.split('-').map(Number);
  return Date.UTC(y, m - 1, day);
};

const fromUtcMs = (ms: number): CalendarDate => new Date(ms).toISOString().slice(0, 10) as CalendarDate;

export const addDays = (d: CalendarDate, days: number): CalendarDate =>
  fromUtcMs(toUtcMs(d) + days * 86_400_000);

/** Negative if a < b, zero if equal, positive if a > b. ISO dates sort lexically. */
export const compareCalendarDates = (a: CalendarDate, b: CalendarDate): number =>
  a < b ? -1 : a > b ? 1 : 0;

export const daysBetween = (from: CalendarDate, to: CalendarDate): number =>
  Math.round((toUtcMs(to) - toUtcMs(from)) / 86_400_000);

/**
 * "Today" in a specific IANA timezone. The earliest valid departure date
 * depends on where the traveller departs, not on the server's clock.
 */
export const todayInTimeZone = (timeZone: string, now: Date = new Date()): CalendarDate => {
  const parts: Record<string, string> = {};
  for (const p of new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now)) {
    parts[p.type] = p.value;
  }
  return toCalendarDate(`${parts.year}-${parts.month}-${parts.day}`);
};
