import pino from 'pino';
import { describe, expect, it, vi } from 'vitest';
import type { FlightOffer } from '@aeronova/shared';
import { AIRLINES } from '../../data/airlines.js';
import { AIRPORTS } from '../../data/airports.js';
import type { AppError } from '../../errors/app-error.js';
import type { FlightProvider } from '../../providers/flight/flight-provider.js';
import { MockFlightProvider, raisePrice } from '../../providers/flight/mock/mock-flight-provider.js';
import { AirportDirectory } from '../airport-directory.js';
import { createDemoCurrencyConverter } from '../currency-service.js';
import { FlightSearchService } from '../search/flight-search-service.js';
import { InMemorySearchStore } from '../search/search-store.js';
import { OfferPricingService } from './offer-pricing-service.js';
import { InMemoryQuoteStore } from './quote-store.js';

const directory = new AirportDirectory(AIRPORTS, AIRLINES);
const logger = pino({ level: 'silent' });

const setup = (opts: { provider?: FlightProvider; clock?: { t: number } } = {}) => {
  const clock = opts.clock ?? { t: Date.parse('2026-09-15T12:00:00Z') };
  const now = () => new Date(clock.t);
  const provider = opts.provider ?? new MockFlightProvider({ directory, now });
  const searches = new InMemorySearchStore(200, () => clock.t);
  const quotes = new InMemoryQuoteStore(500, () => clock.t);
  const fx = createDemoCurrencyConverter();
  const search = new FlightSearchService({
    provider,
    directory,
    store: searches,
    fx,
    logger,
    timeoutMs: 200,
    now,
  });
  const pricing = new OfferPricingService({ provider, searches, quotes, fx, logger, timeoutMs: 200, now });
  const run = async (currency = 'USD') =>
    search.search(
      search.parseInput({
        tripType: 'one_way',
        cabin: 'economy',
        currency,
        passengers: { adults: 2, children: 1, infants: 0 },
        journeys: [{ origin: 'DAC', destination: 'LHR', departureDate: '2026-12-22' }],
      }),
      'r',
    );
  return { clock, pricing, quotes, run };
};

const breakdownAddsUp = (o: FlightOffer) => {
  const p = o.price;
  const taxes = p.taxes.status === 'provided' ? p.taxes.value.amountMinor : 0;
  const lines = p.perPassenger.status === 'provided' ? p.perPassenger.value : [];
  return (
    p.base.amountMinor + taxes + p.fees.reduce((s, f) => s + f.amount.amountMinor, 0) ===
      p.customerTotal.amountMinor &&
    lines.reduce((s, l) => s + l.unitTotal.amountMinor * l.count, 0) === p.customerTotal.amountMinor
  );
};

describe('OfferPricingService', () => {
  it('confirms most offers and reports changes for the rest, never silently', async () => {
    const { pricing, quotes, run } = setup();
    const res = await run();
    const quotesByStatus = { confirmed: 0, changed: 0 };
    for (const { offer } of res.offers) {
      const q = await pricing.price({ searchId: res.searchId, offerId: offer.id }, 'r');
      quotesByStatus[q.status] += 1;
      expect(q.previousTotal).toEqual(offer.price.customerTotal);
      expect(breakdownAddsUp(q.offer)).toBe(true);
      if (q.status === 'changed') {
        expect(q.offer.price.customerTotal.amountMinor).toBeGreaterThan(
          offer.price.customerTotal.amountMinor,
        );
      } else {
        expect(q.offer.price.customerTotal).toEqual(offer.price.customerTotal);
      }
      expect(q.quoteId).toMatch(/^qt_[a-f0-9]{32}$/);
      expect((await quotes.get(q.quoteId))?.ref.provider).toBe('mock');
      expect(JSON.stringify(q)).not.toContain('providerOfferId');
    }
    expect(quotesByStatus.confirmed).toBeGreaterThan(0);
    expect(quotesByStatus.changed).toBeGreaterThan(0);
  });

  it('is deterministic: the same offer re-checks the same way', async () => {
    const { pricing, run } = setup();
    const res = await run();
    const offerId = res.offers[0]!.offer.id;
    const a = await pricing.price({ searchId: res.searchId, offerId }, 'r');
    const b = await pricing.price({ searchId: res.searchId, offerId }, 'r');
    expect(a.status).toBe(b.status);
    expect(a.offer.price.customerTotal).toEqual(b.offer.price.customerTotal);
    expect(a.quoteId).not.toBe(b.quoteId);
  });

  it('refuses expired offers and quotes stop being retrievable after they expire', async () => {
    const { clock, pricing, quotes, run } = setup();
    const res = await run();
    const offerId = res.offers[0]!.offer.id;
    const q = await pricing.price({ searchId: res.searchId, offerId }, 'r');
    clock.t += 21 * 60_000;
    expect(await quotes.get(q.quoteId)).toBeUndefined();
    clock.t += 10 * 60_000; // offer TTL is 30 minutes
    await expect(pricing.price({ searchId: res.searchId, offerId }, 'r')).rejects.toMatchObject({
      code: 'OFFER_EXPIRED',
      httpStatus: 410,
    });
  });

  it('treats an unknown search as gone and an unknown offer as not found', async () => {
    const { pricing, run } = setup();
    const res = await run();
    await expect(
      pricing.price(
        { searchId: 'srch_ffffffffffffffffffffffffffffffff', offerId: res.offers[0]!.offer.id },
        'r',
      ),
    ).rejects.toMatchObject({ code: 'OFFER_EXPIRED' });
    await expect(pricing.price({ searchId: res.searchId, offerId: 'off_nope' }, 'r')).rejects.toMatchObject({
      code: 'NOT_FOUND',
    });
  });

  it('keeps quotes in the search currency', async () => {
    const { pricing, run } = setup();
    const res = await run('GBP');
    const q = await pricing.price({ searchId: res.searchId, offerId: res.offers[1]!.offer.id }, 'r');
    expect(q.offer.price.currency).toBe('GBP');
    expect(q.previousTotal.currency).toBe('GBP');
    expect(breakdownAddsUp(q.offer)).toBe(true);
  });

  it('maps supplier failures without leaking details', async () => {
    const real = new MockFlightProvider({ directory, now: () => new Date('2026-09-15T12:00:00Z') });
    const broken: FlightProvider = {
      id: 'mock',
      capabilities: { flexibleDates: false },
      searchFlights: (i, c) => real.searchFlights(i, c),
      priceOffer: vi.fn().mockRejectedValue(new Error('socket hang up at 10.0.0.1')),
    };
    const { pricing, run } = setup({ provider: broken });
    const res = await run();
    const err = (await pricing
      .price({ searchId: res.searchId, offerId: res.offers[0]!.offer.id }, 'r')
      .catch((e: unknown) => e)) as AppError;
    expect(err.code).toBe('FLIGHT_PROVIDER_UNAVAILABLE');
    expect(err.publicMessage).not.toContain('10.0.0.1');
  });
});

describe('raisePrice', () => {
  it('rounds to whole units, raises every traveller, and keeps totals consistent', async () => {
    const { run } = setup();
    const { offer } = (await run()).offers[0]!;
    const raised = raisePrice(offer, 300);
    expect(breakdownAddsUp(raised)).toBe(true);
    expect(raised.price.customerTotal.amountMinor % 100).toBe(offer.price.customerTotal.amountMinor % 100);
    expect(raised.price.taxes).toEqual(offer.price.taxes);
  });
});
