import { describe, expect, it } from 'vitest';
import { utcToWallTime, wallDayDifference, wallTimeToUtc, zoneOffsetMinutes } from './zoned-time.js';

describe('zoned time', () => {
  it('converts airport wall time to UTC and back', () => {
    const utc = wallTimeToUtc('2026-12-20T06:20', 'Asia/Dhaka');
    expect(utc.toISOString()).toBe('2026-12-20T00:20:00.000Z');
    expect(utcToWallTime(utc, 'Europe/London')).toBe('2026-12-20T00:20');
    expect(utcToWallTime(utc, 'Asia/Dubai')).toBe('2026-12-20T04:20');
  });

  it('handles half-hour zones and date rollover', () => {
    expect(zoneOffsetMinutes(Date.UTC(2026, 11, 20), 'Asia/Kolkata')).toBe(330);
    expect(utcToWallTime(wallTimeToUtc('2026-12-20T23:30', 'Asia/Kolkata'), 'Asia/Dhaka')).toBe(
      '2026-12-21T00:00',
    );
  });

  it('respects daylight saving on both sides of the change', () => {
    // UK clocks go forward on 29 March 2026.
    expect(wallTimeToUtc('2026-03-28T12:00', 'Europe/London').toISOString()).toBe('2026-03-28T12:00:00.000Z');
    expect(wallTimeToUtc('2026-03-30T12:00', 'Europe/London').toISOString()).toBe('2026-03-30T11:00:00.000Z');
    // Southern hemisphere: Sydney is on daylight time in December.
    expect(zoneOffsetMinutes(Date.UTC(2026, 11, 1), 'Australia/Sydney')).toBe(660);
    expect(zoneOffsetMinutes(Date.UTC(2026, 6, 1), 'Australia/Sydney')).toBe(600);
  });

  it('lands wall times inside a DST gap just after the gap', () => {
    // 01:30 does not exist in London on 29 March 2026.
    expect(utcToWallTime(wallTimeToUtc('2026-03-29T01:30', 'Europe/London'), 'Europe/London')).toBe(
      '2026-03-29T02:30',
    );
  });

  it('counts arrival day offsets on the wall calendar', () => {
    expect(wallDayDifference('2026-12-20T22:10', '2026-12-21T06:05')).toBe(1);
    expect(wallDayDifference('2026-12-31T23:00', '2027-01-01T01:00')).toBe(1);
    expect(wallDayDifference('2026-12-20T10:00', '2026-12-20T18:00')).toBe(0);
  });
});
