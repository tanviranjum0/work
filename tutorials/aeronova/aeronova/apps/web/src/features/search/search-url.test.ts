import { describe, expect, it } from 'vitest';
import { draftFromParams, emptyDraft, paramsFromDraft, toApiInput } from './search-url';
import { validateDraft } from './search-validation';

const now = new Date('2026-09-15T12:00:00Z');

describe('search URL state', () => {
  it('round-trips a round trip through the URL', () => {
    const draft = {
      ...emptyDraft(),
      journeys: [{ origin: 'DAC', destination: 'LHR', departureDate: '2026-12-20' }],
      returnDate: '2027-01-05',
      adults: 2,
      infants: 1,
      cabin: 'business' as const,
      currency: 'BDT' as const,
      directOnly: true,
    };
    const params = paramsFromDraft(draft);
    expect(params.toString()).toBe(
      'trip=round&from=DAC&to=LHR&depart=2026-12-20&return=2027-01-05&adults=2&infants=1&cabin=business&currency=BDT&direct=1',
    );
    expect(draftFromParams(params)).toEqual(draft);
  });

  it('encodes multi-city journeys compactly', () => {
    const draft = {
      ...emptyDraft(),
      tripType: 'multi_city' as const,
      journeys: [
        { origin: 'DAC', destination: 'DXB', departureDate: '2026-12-20' },
        { origin: 'DXB', destination: 'LHR', departureDate: '2026-12-24' },
      ],
    };
    const params = paramsFromDraft(draft);
    expect(params.get('legs')).toBe('DAC.DXB.2026-12-20~DXB.LHR.2026-12-24');
    expect(draftFromParams(params).journeys).toEqual(draft.journeys);
  });

  it('falls back safely on garbage input', () => {
    const d = draftFromParams(
      new URLSearchParams('trip=space&cabin=cockpit&currency=XXX&adults=abc&legs=<script>'),
    );
    expect(d.tripType).toBe('round_trip');
    expect(d.cabin).toBe('economy');
    expect(d.currency).toBe('USD');
    expect(d.adults).toBe(1);
    expect(validateDraft(d, now).ok).toBe(false);
  });

  it('builds the return journey and maps its errors onto the return field', () => {
    const d = {
      ...emptyDraft(),
      journeys: [{ origin: 'DAC', destination: 'LHR', departureDate: '2026-12-20' }],
      returnDate: '2026-12-10',
    };
    expect(toApiInput(d).journeys[1]).toEqual({
      origin: 'LHR',
      destination: 'DAC',
      departureDate: '2026-12-10',
    });
    const v = validateDraft(d, now);
    expect(v.ok).toBe(false);
    expect(v.errors.returnDate).toBe('Return must be on or after the departure date.');
  });

  it('reports each missing field with a plain message, once', () => {
    const v = validateDraft(emptyDraft(), now);
    expect(v.errors).toEqual({
      'journeys.0.origin': 'Choose where you are flying from.',
      'journeys.0.destination': 'Choose where you are flying to.',
      'journeys.0.departureDate': 'Choose a departure date.',
      returnDate: 'Choose a return date.',
    });
  });

  it('keeps format errors for values that are present but wrong', () => {
    const v = validateDraft(
      {
        ...emptyDraft(),
        tripType: 'one_way',
        journeys: [{ origin: 'DAC', destination: 'DAC', departureDate: '2026-12-20' }],
      },
      now,
    );
    expect(v.errors).toEqual({ 'journeys.0.destination': 'Choose a destination different from the origin.' });
  });
});

describe('shiftSearchParams', () => {
  it('moves every date and keeps filters and sort', async () => {
    const { shiftSearchParams } = await import('./search-url');
    const plusOne = (d: string) =>
      d === '2026-12-20' ? '2026-12-21' : d === '2027-01-05' ? '2027-01-06' : `${d}+1`;
    const rt = shiftSearchParams(
      new URLSearchParams(
        'trip=round&from=DAC&to=LHR&depart=2026-12-20&return=2027-01-05&stops=0&sort=cheapest',
      ),
      plusOne,
    );
    expect(rt.toString()).toBe(
      'trip=round&from=DAC&to=LHR&depart=2026-12-21&return=2027-01-06&stops=0&sort=cheapest',
    );
    const multi = shiftSearchParams(
      new URLSearchParams('trip=multi&legs=DAC.DXB.a~DXB.LHR.b'),
      (d) => `${d}!`,
    );
    expect(multi.get('legs')).toBe('DAC.DXB.a!~DXB.LHR.b!');
  });
});
