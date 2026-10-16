/**
 * Conversions between airport-local wall time and UTC using only Intl, so no
 * timezone library ships to the browser. Wall times are "YYYY-MM-DDTHH:mm".
 */
const formatters = new Map<string, Intl.DateTimeFormat>();

const formatterFor = (timeZone: string): Intl.DateTimeFormat => {
  let f = formatters.get(timeZone);
  if (!f) {
    f = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
    formatters.set(timeZone, f);
  }
  return f;
};

const wallParts = (utcMs: number, timeZone: string) => {
  const p: Record<string, string> = {};
  for (const part of formatterFor(timeZone).formatToParts(utcMs)) p[part.type] = part.value;
  return {
    y: Number(p.year),
    mo: Number(p.month),
    d: Number(p.day),
    h: Number(p.hour),
    mi: Number(p.minute),
  };
};

const pad = (n: number) => String(n).padStart(2, '0');

/** Minutes the zone is ahead of UTC at the given instant (Dhaka → 360). */
export const zoneOffsetMinutes = (utcMs: number, timeZone: string): number => {
  const w = wallParts(utcMs, timeZone);
  const asUtc = Date.UTC(w.y, w.mo - 1, w.d, w.h, w.mi);
  return Math.round((asUtc - Math.floor(utcMs / 60_000) * 60_000) / 60_000);
};

const WALL = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;

export const isWallTime = (value: string): boolean => WALL.test(value);

/**
 * Local wall time → UTC instant. For wall times skipped by a DST jump the
 * result lands just after the gap, which matches how airlines publish them.
 */
export const wallTimeToUtc = (wall: string, timeZone: string): Date => {
  const m = WALL.exec(wall);
  if (!m) throw new RangeError(`Invalid wall time: "${wall}"`);
  const naive = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]), Number(m[4]), Number(m[5]));
  const first = naive - zoneOffsetMinutes(naive, timeZone) * 60_000;
  const second = naive - zoneOffsetMinutes(first, timeZone) * 60_000;
  return new Date(second);
};

export const utcToWallTime = (instant: Date | number, timeZone: string): string => {
  const w = wallParts(typeof instant === 'number' ? instant : instant.getTime(), timeZone);
  return `${w.y}-${pad(w.mo)}-${pad(w.d)}T${pad(w.h)}:${pad(w.mi)}`;
};

export const minutesBetween = (fromUtcIso: string, toUtcIso: string): number =>
  Math.round((Date.parse(toUtcIso) - Date.parse(fromUtcIso)) / 60_000);

/** Hour-of-day (0–23) of a wall time string. */
export const wallHour = (wall: string): number => Number(wall.slice(11, 13));

/** Calendar-day difference between two wall times (arrival "+1"). */
export const wallDayDifference = (fromWall: string, toWall: string): number =>
  Math.round(
    (Date.parse(`${toWall.slice(0, 10)}T00:00Z`) - Date.parse(`${fromWall.slice(0, 10)}T00:00Z`)) /
      86_400_000,
  );
