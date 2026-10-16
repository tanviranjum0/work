import { describe, expect, it } from 'vitest';
import { toCalendarDate } from '../dates/calendar-date.js';
import { createFlightSearchInputSchema } from './flight-search.js';

const schema = createFlightSearchInputSchema({ today: toCalendarDate('2026-09-15') });
const pax = { adults: 1, children: 0, infants: 0 };

const roundTrip = (overrides: Record<string, unknown> = {}) => ({
  tripType: 'round_trip',
  cabin: 'economy',
  passengers: pax,
  journeys: [
    { origin: 'DAC', destination: 'LHR', departureDate: '2026-12-20' },
    { origin: 'LHR', destination: 'DAC', departureDate: '2027-01-05' },
  ],
  ...overrides,
});

const messages = (input: unknown): string[] => {
  const r = schema.safeParse(input);
  return r.success ? [] : r.error.issues.map((i) => i.message);
};

describe('flight search input', () => {
  it('accepts a valid round trip and applies defaults', () => {
    const r = schema.parse(roundTrip());
    expect(r.currency).toBe('USD');
    expect(r.directOnly).toBe(false);
  });

  it('normalises lower-case airport codes', () => {
    const r = schema.parse({
      tripType: 'one_way',
      cabin: 'business',
      passengers: pax,
      journeys: [{ origin: 'dac', destination: 'dxb', departureDate: '2026-10-01' }],
    });
    expect(r.journeys[0].origin).toBe('DAC');
  });

  it('rejects same origin and destination', () => {
    expect(
      messages({
        tripType: 'one_way',
        cabin: 'economy',
        passengers: pax,
        journeys: [{ origin: 'DAC', destination: 'DAC', departureDate: '2026-10-01' }],
      }),
    ).toContain('Choose a destination different from the origin.');
  });

  it('rejects past dates and return-before-departure', () => {
    const past = messages(
      roundTrip({
        journeys: [
          { origin: 'DAC', destination: 'LHR', departureDate: '2026-09-14' },
          { origin: 'LHR', destination: 'DAC', departureDate: '2026-09-13' },
        ],
      }),
    );
    expect(past).toContain('This date has passed.');
    expect(past).toContain('Return must be on or after the departure date.');
  });

  it('rejects dates beyond the publishing horizon', () => {
    expect(
      messages({
        tripType: 'one_way',
        cabin: 'economy',
        passengers: pax,
        journeys: [{ origin: 'DAC', destination: 'LHR', departureDate: '2027-12-01' }],
      }).join(),
    ).toMatch(/about a year ahead/);
  });

  it('enforces infant-to-adult ratio and party size', () => {
    expect(messages(roundTrip({ passengers: { adults: 1, children: 0, infants: 2 } }))).toContain(
      'Each infant must travel with an adult.',
    );
    expect(messages(roundTrip({ passengers: { adults: 5, children: 5, infants: 0 } })).join()).toMatch(
      /up to 9/,
    );
    expect(messages(roundTrip({ passengers: { adults: 0, children: 1, infants: 0 } }))).toContain(
      'At least one adult is required.',
    );
  });

  it('rejects open-jaw round trips and chronologically invalid multi-city', () => {
    expect(
      messages(
        roundTrip({
          journeys: [
            { origin: 'DAC', destination: 'LHR', departureDate: '2026-12-20' },
            { origin: 'CDG', destination: 'DAC', departureDate: '2027-01-05' },
          ],
        }),
      ).join(),
    ).toMatch(/multi-city/);

    expect(
      messages({
        tripType: 'multi_city',
        cabin: 'economy',
        passengers: pax,
        journeys: [
          { origin: 'DAC', destination: 'DXB', departureDate: '2026-12-20' },
          { origin: 'DXB', destination: 'LHR', departureDate: '2026-12-18' },
        ],
      }),
    ).toContain('Each flight must depart on or after the previous one.');
  });

  it('rejects unexpected properties and a single-journey multi-city', () => {
    expect(schema.safeParse(roundTrip({ injected: { $gt: '' } })).success).toBe(false);
    expect(
      schema.safeParse({
        tripType: 'multi_city',
        cabin: 'economy',
        passengers: pax,
        journeys: [{ origin: 'DAC', destination: 'DXB', departureDate: '2026-12-20' }],
      }).success,
    ).toBe(false);
  });
});
