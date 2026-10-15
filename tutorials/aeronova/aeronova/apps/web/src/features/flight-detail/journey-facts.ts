import type { FlightJourney } from '@aeronova/shared';

/**
 * Local-clock shift across a journey in minutes: how far the destination's
 * clock is ahead (+) or behind (−) the origin's at those moments.
 */
export const clockShiftMinutes = (j: FlightJourney): number => {
  const first = j.segments[0];
  const last = j.segments[j.segments.length - 1];
  if (!first || !last) return 0;
  const localSpan = (Date.parse(`${last.arrival.local}Z`) - Date.parse(`${first.departure.local}Z`)) / 60_000;
  return Math.round(localSpan - j.totalDurationMinutes);
};

export const airborneMinutes = (j: FlightJourney): number =>
  j.segments.reduce((n, s) => n + s.durationMinutes, 0);
