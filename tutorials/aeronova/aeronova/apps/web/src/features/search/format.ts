import { wallDayDifference } from '@aeronova/shared';

/*
 * Airport times are stored as wall-clock strings ("2026-12-20T06:20") and are
 * formatted without ever passing through the viewer's timezone: the parts are
 * placed in a UTC Date and formatted with timeZone: 'UTC'.
 */
const wallAsUtcDate = (wall: string) => new Date(`${wall.length === 10 ? `${wall}T00:00` : wall}:00Z`);

const cache = new Map<string, Intl.DateTimeFormat>();
const fmt = (locale: string, opts: Intl.DateTimeFormatOptions) => {
  const key = `${locale}|${JSON.stringify(opts)}`;
  let f = cache.get(key);
  if (!f) {
    f = new Intl.DateTimeFormat(locale, { ...opts, timeZone: 'UTC' });
    cache.set(key, f);
  }
  return f;
};

export const formatWallTime = (wall: string, locale = 'en-GB') =>
  fmt(locale, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(wallAsUtcDate(wall));

export const formatWallDate = (wallOrDate: string, locale = 'en-GB') =>
  fmt(locale, { weekday: 'short', day: 'numeric', month: 'short' }).format(
    wallAsUtcDate(wallOrDate.slice(0, 10)),
  );

const NBSP = '\u00a0';

/** "8h 55m", joined with a no-break space so a duration never wraps in half. */
export const formatDuration = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h${NBSP}${String(m).padStart(2, '0')}m`;
};

/** "+1" style suffix when arrival is on a later local calendar day. */
export const dayOffsetLabel = (departureWall: string, arrivalWall: string) => {
  const d = wallDayDifference(departureWall, arrivalWall);
  return d === 0 ? '' : d > 0 ? `+${d}` : String(d);
};

export const formatSignedDuration = (minutes: number) =>
  `${minutes >= 0 ? '+' : '−'}${formatDuration(Math.abs(minutes))}`;
