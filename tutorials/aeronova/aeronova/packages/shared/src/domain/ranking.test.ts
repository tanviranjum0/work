import { describe, expect, it } from 'vitest';
import { money } from '../money/money.js';
import type { FlightOffer, FlightSegment } from './flight.js';
import { notProvided, provided } from './provided.js';
import { computeOfferMetrics, normalizeWeights, rankOffers } from './ranking.js';

const segment = (
  id: string,
  from: string,
  to: string,
  depLocal: string,
  depUtc: string,
  minutes: number,
): FlightSegment => ({
  id,
  marketingCarrier: { code: 'XX', name: 'Test Air' },
  marketingFlightNumber: '1',
  operatingCarrier: notProvided,
  origin: { iataCode: from, terminal: notProvided },
  destination: { iataCode: to, terminal: notProvided },
  departure: { local: depLocal, timeZone: 'UTC', utc: depUtc },
  arrival: {
    local: depLocal,
    timeZone: 'UTC',
    utc: new Date(Date.parse(depUtc) + minutes * 60_000).toISOString(),
  },
  durationMinutes: minutes,
  aircraft: notProvided,
  cabin: 'economy',
  technicalStops: [],
});

const offer = (
  id: string,
  priceUsd: number,
  opts: { minutes: number; connections?: number[]; checked?: 'none' | 'pieces'; depHour?: string } = {
    minutes: 480,
  },
): FlightOffer => {
  const connections = opts.connections ?? [];
  const legMinutes = Math.round(
    (opts.minutes - connections.reduce((a, b) => a + b, 0)) / (connections.length + 1),
  );
  const segments: FlightSegment[] = [];
  let t = Date.parse('2026-12-20T10:00:00Z');
  const firstLocal = `2026-12-20T${opts.depHour ?? '10:00'}`;
  for (let i = 0; i <= connections.length; i++) {
    segments.push(
      segment(
        `s${i}`,
        `A${i}`,
        `A${i + 1}`,
        i === 0 ? firstLocal : '2026-12-20T15:00',
        new Date(t).toISOString(),
        legMinutes,
      ),
    );
    t += (legMinutes + (connections[i] ?? 0)) * 60_000;
  }
  const total = money(priceUsd * 100, 'USD');
  return {
    id,
    itineraryKey: id,
    dataOrigin: 'demo',
    journeys: [
      {
        id: 'j0',
        origin: segments[0]!.origin,
        destination: segments.at(-1)!.destination,
        segments,
        layovers: connections.map((m, i) => ({
          afterSegmentId: `s${i}`,
          beforeSegmentId: `s${i + 1}`,
          airport: segments[i]!.destination,
          durationMinutes: m,
          requiresAirportChange: false,
          requiresTerminalChange: notProvided,
          selfTransfer: provided(false),
        })),
        totalDurationMinutes: opts.minutes,
      },
    ],
    validatingCarrier: notProvided,
    cabin: 'economy',
    fareFamily: notProvided,
    baggage: {
      cabin: { kind: 'unknown' },
      checked:
        opts.checked === 'pieces'
          ? { kind: 'pieces', quantity: 1, maxWeightKg: notProvided }
          : { kind: opts.checked ?? 'none' },
    },
    conditions: { refund: notProvided, change: notProvided },
    price: {
      currency: 'USD',
      base: total,
      taxes: notProvided,
      fees: [],
      supplierTotal: total,
      markup: money(0, 'USD'),
      serviceFee: money(0, 'USD'),
      discount: money(0, 'USD'),
      customerTotal: total,
      perPassenger: notProvided,
    },
    seatsRemaining: notProvided,
    expiresAt: notProvided,
  };
};

describe('ranking', () => {
  it('computes itinerary metrics and flags from the data it has', () => {
    const m = computeOfferMetrics(offer('a', 700, { minutes: 700, connections: [60], depHour: '23:30' }));
    expect(m).toMatchObject({
      stops: 1,
      layoverMinutes: 60,
      airborneMinutes: 640,
      hasTightConnection: true,
      hasRedEye: true,
      checkedBagIncluded: 'no',
      refundable: 'unknown',
      hasSelfTransfer: 'no',
    });
    expect(m.pricePerTravelHour.amountMinor).toBe(6000); // $700 over 11h40m
  });

  it('assigns badges from the returned set only, never arbitrarily', () => {
    const ranked = rankOffers([
      offer('cheap-slow', 500, { minutes: 900, connections: [200] }),
      offer('fast-pricey', 900, { minutes: 480 }),
      offer('balanced', 620, { minutes: 520, checked: 'pieces' }),
    ]);
    const badges = Object.fromEntries(ranked.map((r) => [r.offer.id, r.badges]));
    expect(badges['cheap-slow']).toContain('cheapest');
    expect(badges['fast-pricey']).toContain('fastest');
    expect(ranked[0]?.offer.id).toBe('balanced');
    expect(badges.balanced).toContain('best_overall');
    expect(ranked.flatMap((r) => r.badges).filter((b) => b === 'cheapest')).toHaveLength(1);
  });

  it('re-ranks when the traveller changes priorities', () => {
    const set = [
      offer('cheap', 400, { minutes: 1000, connections: [300] }),
      offer('fast', 950, { minutes: 450 }),
    ];
    expect(
      rankOffers(set, { price: 1, duration: 0, stops: 0, baggage: 0, convenience: 0 })[0]?.offer.id,
    ).toBe('cheap');
    expect(
      rankOffers(set, { price: 0, duration: 1, stops: 0, baggage: 0, convenience: 0 })[0]?.offer.id,
    ).toBe('fast');
  });

  it('reports deltas against the cheapest and fastest, and handles ties and edge cases', () => {
    const ranked = rankOffers([offer('a', 500, { minutes: 600 }), offer('b', 550, { minutes: 480 })]);
    const a = ranked.find((r) => r.offer.id === 'a')!;
    const b = ranked.find((r) => r.offer.id === 'b')!;
    expect(b.comparison.priceDeltaVsCheapest.amountMinor).toBe(5000);
    expect(b.comparison.priceDeltaPercentVsCheapest).toBe(10);
    expect(a.comparison.durationDeltaVsFastestMinutes).toBe(120);

    expect(rankOffers([])).toEqual([]);
    expect(rankOffers([offer('solo', 500)])[0]?.score).toBeGreaterThan(0);
    expect(
      normalizeWeights({ price: 0, duration: 0, stops: 0, baggage: 0, convenience: 0 }).price,
    ).toBeGreaterThan(0);
    const mixed = offer('eur', 1);
    expect(() =>
      rankOffers([offer('usd', 1), { ...mixed, price: { ...mixed.price, currency: 'EUR' } }]),
    ).toThrow(RangeError);
  });

  it('produces a stable order for identical inputs', () => {
    const set = [offer('b', 500), offer('a', 500), offer('c', 500)];
    expect(rankOffers(set).map((r) => r.offer.id)).toEqual(['a', 'b', 'c']);
  });
});
