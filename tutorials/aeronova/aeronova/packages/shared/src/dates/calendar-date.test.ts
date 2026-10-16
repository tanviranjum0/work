import { describe, expect, it } from 'vitest';
import { addDays, daysBetween, isCalendarDate, toCalendarDate, todayInTimeZone } from './calendar-date.js';

describe('calendar dates', () => {
  it('accepts only real dates', () => {
    expect(isCalendarDate('2026-12-20')).toBe(true);
    expect(isCalendarDate('2026-02-30')).toBe(false);
    expect(isCalendarDate('2026-12-20T00:00:00Z')).toBe(false);
    expect(isCalendarDate('20-12-2026')).toBe(false);
  });

  it('does day arithmetic across month and year boundaries', () => {
    expect(addDays(toCalendarDate('2026-12-31'), 1)).toBe('2027-01-01');
    expect(addDays(toCalendarDate('2028-03-01'), -1)).toBe('2028-02-29');
    expect(daysBetween(toCalendarDate('2026-12-20'), toCalendarDate('2027-01-05'))).toBe(16);
  });

  it('resolves "today" in the departure timezone, not the server timezone', () => {
    // 20:30 UTC on Dec 19 is already Dec 20 in Dhaka (UTC+6) but still Dec 19 in New York.
    const instant = new Date('2026-12-19T20:30:00Z');
    expect(todayInTimeZone('Asia/Dhaka', instant)).toBe('2026-12-20');
    expect(todayInTimeZone('America/New_York', instant)).toBe('2026-12-19');
  });
});
