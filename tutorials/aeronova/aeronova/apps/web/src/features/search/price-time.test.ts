import { describe, expect, it } from 'vitest';
import { efficientOptions, niceTicks } from './price-time';

describe('price vs time helpers', () => {
  it('keeps only options not beaten on both price and time', () => {
    const pts = [
      { id: 'fast-pricey', minutes: 480, priceMinor: 90000 },
      { id: 'balanced', minutes: 600, priceMinor: 70000 },
      { id: 'dominated', minutes: 700, priceMinor: 80000 },
      { id: 'cheap-slow', minutes: 1100, priceMinor: 50000 },
      { id: 'tie-later', minutes: 480, priceMinor: 90000 },
    ];
    expect(efficientOptions(pts).map((p) => p.id)).toEqual(['fast-pricey', 'balanced', 'cheap-slow']);
    expect(efficientOptions([])).toEqual([]);
  });

  it('produces rounded ticks covering the range', () => {
    const t = niceTicks(415, 1130, 4, 60);
    expect(t[0]).toBeLessThanOrEqual(415);
    expect(t.at(-1)).toBeGreaterThanOrEqual(1130);
    expect(t.every((v) => v % 60 === 0)).toBe(true);
    expect(niceTicks(5, 5, 4, 1)).toEqual([5]);
  });
});
