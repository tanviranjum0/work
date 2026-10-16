import { describe, expect, it, vi } from 'vitest';
import pino from 'pino';
import { AIRLINES } from '../../data/airlines.js';
import { AIRPORTS } from '../../data/airports.js';
import type { AppError } from '../../errors/app-error.js';
import type { FlightProvider } from '../../providers/flight/flight-provider.js';
import { MockFlightProvider } from '../../providers/flight/mock/mock-flight-provider.js';
import { AirportDirectory } from '../airport-directory.js';
import { createDemoCurrencyConverter } from '../currency-service.js';
import { FlightSearchService } from './flight-search-service.js';
import { InMemorySearchStore } from './search-store.js';

const directory = new AirportDirectory(AIRPORTS, AIRLINES);
const now = () => new Date('2026-09-15T12:00:00Z');

const build = (provider: FlightProvider = new MockFlightProvider({ directory, now }), extra = {}) =>
  new FlightSearchService({
    provider,
    directory,
    store: new InMemorySearchStore(),
    fx: createDemoCurrencyConverter(),
    logger: pino({ level: 'silent' }),
    timeoutMs: 200,
    now,
    ...extra,
  });

const raw = (overrides: Record<string, unknown> = {}) => ({
  tripType: 'one_way',
  cabin: 'economy',
  passengers: { adults: 1, children: 0, infants: 0 },
  journeys: [{ origin: 'DAC', destination: 'LHR', departureDate: '2026-12-22' }],
  ...overrides,
});

const codeOf = (fn: () => unknown) => {
  try {
    fn();
  } catch (e) {
    return (e as AppError).code;
  }
  return undefined;
};

describe('FlightSearchService', () => {
  it('validates dates against the departure airport clock', () => {
    const svc = build(
      { id: 'mock', capabilities: { flexibleDates: false }, priceOffer: vi.fn(), searchFlights: vi.fn() },
      { now: () => new Date('2026-09-15T20:30:00Z') },
    );
    // 02:30 on 16 Sep in Dhaka: the 15th has already passed there…
    const dhaka = raw({ journeys: [{ origin: 'DAC', destination: 'DXB', departureDate: '2026-09-15' }] });
    expect(codeOf(() => svc.parseInput(dhaka))).toBe('VALIDATION_ERROR');
    // …but it is still the 15th in New York.
    const ny = raw({ journeys: [{ origin: 'JFK', destination: 'LHR', departureDate: '2026-09-15' }] });
    expect(() => svc.parseInput(ny)).not.toThrow();
  });

  it('rejects unknown airports with a specific code', () => {
    const svc = build();
    const err = (() => {
      try {
        svc.parseInput(
          raw({ journeys: [{ origin: 'QQQ', destination: 'LHR', departureDate: '2026-12-22' }] }),
        );
      } catch (e) {
        return e as AppError;
      }
    })();
    expect(err?.code).toBe('INVALID_AIRPORT');
    expect(err?.issues?.[0]?.path).toBe('journeys.0.origin');
  });

  it('returns ranked offers, hides supplier bindings, and reopens by id', async () => {
    const svc = build();
    const res = await svc.search(svc.parseInput(raw()), 'r1');
    expect(res.offers.length).toBeGreaterThan(0);
    expect(res).toMatchObject({ dataOrigin: 'demo', conversion: 'none', truncated: false });
    expect(res.places.DAC).toMatchObject({ kind: 'airport', cityName: 'Dhaka', timeZone: 'Asia/Dhaka' });
    expect(res.places.LHR?.cityName).toBe('London');
    // Every airport that appears in an offer has a display name.
    const codes = res.offers.flatMap((r) =>
      r.offer.journeys.flatMap((j) => j.segments.map((s) => s.destination.iataCode)),
    );
    for (const c of codes) expect(res.places[c]).toBeDefined();
    expect(JSON.stringify(res)).not.toContain('providerOfferId');
    const first = res.offers[0]!;
    expect(await svc.resolveOffer(res.searchId, first.offer.id)).toMatchObject({ provider: 'mock' });
    expect((await svc.getById(res.searchId)).searchId).toBe(res.searchId);
    await expect(svc.getById('srch_missing')).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('caches identical queries and collapses concurrent duplicates into one supplier call', async () => {
    const mock = new MockFlightProvider({ directory, now });
    const spy = vi.spyOn(mock, 'searchFlights');
    const svc = build(mock);
    const input = svc.parseInput(raw());
    const [a, b] = await Promise.all([svc.search(input, 'r1'), svc.search(input, 'r2')]);
    const c = await svc.search(
      svc.parseInput(raw({ journeys: [{ origin: 'dac', destination: 'lhr', departureDate: '2026-12-22' }] })),
      'r3',
    );
    expect(spy).toHaveBeenCalledTimes(1);
    expect(a.searchId).toBe(b.searchId);
    expect(c.searchId).toBe(a.searchId);
    await svc.search(svc.parseInput(raw({ cabin: 'business' })), 'r4');
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('converts to the requested currency and discloses demo rates', async () => {
    const svc = build();
    const res = await svc.search(svc.parseInput(raw({ currency: 'BDT' })), 'r1');
    expect(res.currency).toBe('BDT');
    expect(res.conversion).toBe('demo_rates');
    for (const { offer } of res.offers) {
      const p = offer.price;
      expect(p.customerTotal.currency).toBe('BDT');
      const taxes = p.taxes.status === 'provided' ? p.taxes.value.amountMinor : 0;
      expect(p.base.amountMinor + taxes + p.fees.reduce((s, f) => s + f.amount.amountMinor, 0)).toBe(
        p.customerTotal.amountMinor,
      );
    }
  });

  it('maps a slow supplier to a timeout and a failing one to unavailable', async () => {
    const hang: FlightProvider = {
      id: 'mock',
      capabilities: { flexibleDates: false },
      priceOffer: vi.fn(),
      searchFlights: (_i, ctx) =>
        new Promise((_r, reject) => ctx.signal.addEventListener('abort', () => reject(ctx.signal.reason))),
    };
    const slow = build(hang);
    await expect(slow.search(slow.parseInput(raw()), 'r')).rejects.toMatchObject({
      code: 'FLIGHT_PROVIDER_TIMEOUT',
      httpStatus: 502,
    });

    const broken = build({
      id: 'mock',
      capabilities: { flexibleDates: false },
      priceOffer: vi.fn(),
      searchFlights: () => Promise.reject(new Error('ECONNRESET')),
    });
    const err = (await broken.search(broken.parseInput(raw()), 'r').catch((e: unknown) => e)) as AppError;
    expect(err).toMatchObject({ code: 'FLIGHT_PROVIDER_UNAVAILABLE' });
    expect(err.publicMessage).not.toContain('ECONNRESET');
  });

  it('caps oversized result sets and says so', async () => {
    const svc = build(undefined, { maxOffers: 3 });
    const res = await svc.search(svc.parseInput(raw()), 'r');
    expect(res.offers).toHaveLength(3);
    expect(res.truncated).toBe(true);
    expect(res.totalOffers).toBeGreaterThan(3);
  });
});
