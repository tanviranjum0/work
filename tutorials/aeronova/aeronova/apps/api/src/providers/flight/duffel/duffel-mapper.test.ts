import { describe, expect, it } from 'vitest';
import { computeOfferMetrics } from '@aeronova/shared';
import { connectingOffer, directOffer, technicalStopOffer } from './__fixtures__/offer-request.js';
import { isoDurationMinutes, mapDuffelOffer } from './duffel-mapper.js';
import { duffelOfferSchema } from './duffel-schemas.js';

const map = (raw: unknown) => {
  const r = mapDuffelOffer(duffelOfferSchema.parse(raw), 'economy');
  if (!r.ok) throw new Error(r.reason);
  return r.offer;
};

describe('isoDurationMinutes', () => {
  it('parses the forms Duffel uses', () => {
    expect(isoDurationMinutes('PT02H26M')).toBe(146);
    expect(isoDurationMinutes('P1DT2H30M')).toBe(1590);
    expect(isoDurationMinutes('P0DT10H05M')).toBe(605);
    expect(isoDurationMinutes('PT45M')).toBe(45);
    expect(isoDurationMinutes('PT30S')).toBe(1);
    expect(isoDurationMinutes('10h')).toBeUndefined();
    expect(isoDurationMinutes(null)).toBeUndefined();
  });
});

describe('mapDuffelOffer', () => {
  it('converts airport-local times to UTC with each airport zone', () => {
    const seg = map(directOffer).journeys[0]!.segments[0]!;
    expect(seg.departure).toEqual({
      local: '2026-12-20T08:30',
      timeZone: 'Europe/London',
      utc: '2026-12-20T08:30:00.000Z',
    });
    // 11:30 in New York in December is 16:30 UTC.
    expect(seg.arrival).toEqual({
      local: '2026-12-20T11:30',
      timeZone: 'America/New_York',
      utc: '2026-12-20T16:30:00.000Z',
    });
    expect(seg.durationMinutes).toBe(480);
  });

  it('splits the price only when the parts add up, and labels the remainder', () => {
    const p = map(directOffer).price;
    expect(p.customerTotal).toEqual({ amountMinor: 25000, currency: 'GBP' });
    expect(p.base.amountMinor).toBe(20000);
    expect(p.taxes).toEqual({ status: 'provided', value: { amountMinor: 4000, currency: 'GBP' } });
    expect(p.fees).toEqual([
      { category: 'other', label: 'Other supplier charges', amount: { amountMinor: 1000, currency: 'GBP' } },
    ]);
    expect(p.perPassenger.status).toBe('not_provided');

    const noSplit = map(technicalStopOffer).price;
    expect(noSplit.base.amountMinor).toBe(31050);
    expect(noSplit.taxes.status).toBe('not_provided');
    expect(noSplit.fees).toEqual([]);

    const inconsistent = map({ ...directOffer, base_amount: '260.00' }).price;
    expect(inconsistent.base).toEqual(inconsistent.customerTotal);
    expect(inconsistent.taxes.status).toBe('not_provided');
  });

  it('maps conditions without inventing fees', () => {
    const direct = map(directOffer).conditions;
    expect(direct.refund).toEqual({
      status: 'provided',
      value: { value: 'not_allowed', penalty: { status: 'not_provided' } },
    });
    expect(direct.change).toEqual({
      status: 'provided',
      value: {
        value: 'allowed_with_fee',
        penalty: { status: 'provided', value: { amountMinor: 5000, currency: 'GBP' } },
      },
    });
    const conn = map(connectingOffer).conditions;
    expect(conn.refund.status === 'provided' && conn.refund.value.value).toBe('allowed_fee_unknown');
    expect(conn.change.status === 'provided' && conn.change.value.value).toBe('allowed');
    expect(map(technicalStopOffer).conditions).toEqual({
      refund: { status: 'not_provided' },
      change: { status: 'not_provided' },
    });
  });

  it('builds layovers, detects airport changes and keeps codeshare operators', () => {
    const j = map(connectingOffer).journeys[0]!;
    expect(j.segments).toHaveLength(2);
    expect(j.layovers).toEqual([
      expect.objectContaining({
        airport: { iataCode: 'BOS', terminal: { status: 'provided', value: 'E' } },
        durationMinutes: 135,
        requiresAirportChange: true,
        requiresTerminalChange: { status: 'not_provided' },
        selfTransfer: { status: 'provided', value: false },
      }),
    ]);
    expect(j.segments[0]!.operatingCarrier).toEqual({
      status: 'provided',
      value: { code: 'AA', name: 'American Airlines' },
    });
    expect(j.segments[1]!.operatingCarrier.status).toBe('not_provided');
    // Missing segment duration falls back to the clock: 13:55 to 15:05, same zone.
    expect(j.segments[1]!.durationMinutes).toBe(70);
    expect(j.segments[1]!.aircraft).toEqual({
      status: 'provided',
      value: { code: '', name: { status: 'provided', value: 'Embraer 175' } },
    });
    // 09:00 London (UTC) to 15:05 New York (UTC-5) is 11h05m.
    expect(j.totalDurationMinutes).toBe(665);
    expect(computeOfferMetrics(map(connectingOffer)).hasAirportChange).toBe(true);
  });

  it('keeps baggage conservative across segments', () => {
    // 1 checked bag on the first flight, 2 on the second: only 1 is guaranteed.
    expect(map(connectingOffer).baggage.checked).toEqual({
      kind: 'pieces',
      quantity: 1,
      maxWeightKg: { status: 'not_provided' },
    });
    // Carry-on not listed on those segments means none is stated as included.
    expect(map(connectingOffer).baggage.cabin).toEqual({ kind: 'none' });
    expect(map(directOffer).baggage).toEqual({
      cabin: { kind: 'pieces', quantity: 1, maxWeightKg: { status: 'not_provided' } },
      checked: { kind: 'none' },
    });
    expect(map(technicalStopOffer).baggage).toEqual({
      cabin: { kind: 'unknown' },
      checked: { kind: 'unknown' },
    });
  });

  it('keeps technical stops on the segment and marks provenance', () => {
    const o = map(technicalStopOffer);
    expect(o.journeys[0]!.segments[0]!.technicalStops).toEqual([
      {
        airport: { iataCode: 'KEF', terminal: { status: 'not_provided' } },
        durationMinutes: { status: 'provided', value: 75 },
      },
    ]);
    expect(computeOfferMetrics(o).stops).toBe(1);
    expect(o.dataOrigin).toBe('sandbox');
    expect(map({ ...directOffer, live_mode: true }).dataOrigin).toBe('live');
    expect(o.fareFamily).toEqual({ status: 'provided', value: 'Comfort' });
    expect(map(connectingOffer).fareFamily.status).toBe('not_provided');
  });

  it('produces stable opaque ids that never expose the Duffel id', () => {
    const a = map(directOffer);
    expect(a.id).toBe(map(directOffer).id);
    expect(a.id).not.toContain('off_direct');
    expect(a.id).toMatch(/^off_[0-9a-z]+$/);
    // Same flights, different fare: same itinerary key.
    expect(map({ ...directOffer, id: 'off_other_brand', total_amount: '300.00' }).itineraryKey).toBe(
      a.itineraryKey,
    );
  });

  it('refuses unsupported currencies and bad zones instead of throwing', () => {
    expect(
      mapDuffelOffer(duffelOfferSchema.parse({ ...directOffer, total_currency: 'CHF' }), 'economy'),
    ).toEqual({
      ok: false,
      reason: 'unsupported_currency',
    });
    const badZone = structuredClone(directOffer);
    badZone.slices[0]!.segments[0]!.origin = {
      ...badZone.slices[0]!.segments[0]!.origin,
      time_zone: 'Mars/Olympus',
    };
    expect(mapDuffelOffer(duffelOfferSchema.parse(badZone), 'economy')).toEqual({
      ok: false,
      reason: 'invalid_data',
    });
  });
});
