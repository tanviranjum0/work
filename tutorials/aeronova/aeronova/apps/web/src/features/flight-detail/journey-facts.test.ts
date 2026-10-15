import type { FlightSearchResponse } from '@aeronova/shared';
import { describe, expect, it } from 'vitest';
import fixture from '../../test/fixtures/search-dac-lhr-return.json';
import { airborneMinutes, clockShiftMinutes } from './journey-facts';

const offer = (fixture as unknown as FlightSearchResponse).offers[0]!.offer;

describe('journey facts', () => {
  it('reports London as 6h behind Dhaka in December, and the reverse on return', () => {
    expect(clockShiftMinutes(offer.journeys[0]!)).toBe(-360);
    expect(clockShiftMinutes(offer.journeys[1]!)).toBe(360);
  });

  it('separates time in the air from total travel time', () => {
    const j = offer.journeys[0]!;
    const ground = j.layovers.reduce((n, l) => n + l.durationMinutes, 0);
    expect(airborneMinutes(j) + ground).toBe(j.totalDurationMinutes);
  });
});
