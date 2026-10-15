export interface PriceTimePoint {
  readonly id: string;
  readonly minutes: number;
  readonly priceMinor: number;
}

/**
 * Options that no other option beats on both price and travel time
 * (the Pareto frontier), ordered from fastest to cheapest.
 * Ties on both values keep the first occurrence only.
 */
export const efficientOptions = <T extends PriceTimePoint>(points: readonly T[]): T[] => {
  const sorted = [...points].sort((a, b) => a.minutes - b.minutes || a.priceMinor - b.priceMinor);
  const frontier: T[] = [];
  let bestPrice = Infinity;
  for (const p of sorted) {
    if (p.priceMinor < bestPrice) {
      frontier.push(p);
      bestPrice = p.priceMinor;
    }
  }
  return frontier;
};

/** Evenly spaced, rounded ticks that include both ends of the range. */
export const niceTicks = (min: number, max: number, count: number, step: number): number[] => {
  if (max <= min) return [min];
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const raw = (hi - lo) / Math.max(1, count - 1);
  const interval = Math.max(step, Math.ceil(raw / step) * step);
  const ticks: number[] = [];
  for (let v = lo; v <= hi + 1e-9; v += interval) ticks.push(v);
  if ((ticks.at(-1) ?? lo) < max) ticks.push((ticks.at(-1) ?? lo) + interval);
  return ticks;
};
