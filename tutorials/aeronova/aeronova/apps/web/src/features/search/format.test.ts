import { describe, expect, it } from 'vitest';
import { dayOffsetLabel, formatDuration, formatWallDate, formatWallTime } from './format';

describe('flight formatting', () => {
  it('formats airport wall times without shifting them into the viewer timezone', () => {
    process.env.TZ = 'America/Los_Angeles';
    expect(formatWallTime('2026-12-20T06:20')).toBe('06:20');
    expect(formatWallTime('2026-12-20T00:05')).toBe('00:05');
    expect(formatWallDate('2026-12-20T00:05')).toBe('Sun 20 Dec');
    expect(formatWallDate('2026-12-20')).toBe('Sun 20 Dec');
  });

  it('formats durations and day offsets', () => {
    expect(formatDuration(535)).toBe('8h\u00a055m');
    expect(formatDuration(480)).toBe('8h');
    expect(formatDuration(45)).toBe('45m');
    expect(formatDuration(605)).toBe('10h\u00a005m');
    expect(dayOffsetLabel('2026-12-20T22:10', '2026-12-21T06:05')).toBe('+1');
    expect(dayOffsetLabel('2026-12-20T10:00', '2026-12-20T18:00')).toBe('');
  });
});
