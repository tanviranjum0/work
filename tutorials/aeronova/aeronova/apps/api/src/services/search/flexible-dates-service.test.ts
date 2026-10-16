import pino from 'pino';
import { describe, expect, it, vi } from 'vitest';
import { AIRLINES } from '../../data/airlines.js';
import { AIRPORTS } from '../../data/airports.js';
import { MockFlightProvider } from '../../providers/flight/mock/mock-flight-provider.js';
import { AirportDirectory } from '../airport-directory.js';
import { createDemoCurrencyConverter } from '../currency-service.js';
import { FlexibleDatesService } from './flexible-dates-service.js';
import { FlightSearchService } from './flight-search-service.js';
import { InMemorySearchStore } from './search-store.js';

const directory = new AirportDirectory(AIRPORTS, AIRLINES);
const logger = pino({ level: 'silent' });

const setup = (now = () => new Date('2026-09-15T12:00:00Z')) => {
  const provider = new MockFlightProvider({ directory, now });
  const search = new FlightSearchService({
    provider,
    directory,
    store: new InMemorySearchStore(),
    fx: createDemoCurrencyConverter(),
    logger,
    timeoutMs: 2_000,
    now,
  });
  return { provider, search, flex: new FlexibleDatesService({ provider, search, directory, logger, now }) };
};

describe('FlexibleDatesService', () => {
  it('returns seven cells centred on the searched date, with the lowest total per date', async () => {
    const { search, flex } = setup();
    const input = search.parseInput({
      tripType: 'one_way',
      cabin: 'economy',
      passengers: { adults: 1, children: 0, infants: 0 },
      journeys: [{ origin: 'DAC', destination: 'LHR', departureDate: '2026-12-22' }],
    });
    const res = await flex.lowestFares(input, 'r');
    expect(res.supported).toBe(true);
    expect(res.dataOrigin).toBe('demo');
    expect(res.cells.map((c) => c.offsetDays)).toEqual([-3, -2, -1, 0, 1, 2, 3]);
    expect(res.cells.map((c) => c.departureDates[0])).toEqual([
      '2026-12-19',
      '2026-12-20',
      '2026-12-21',
      '2026-12-22',
      '2026-12-23',
      '2026-12-24',
      '2026-12-25',
    ]);
    const centre = res.cells[3]!;
    const direct = await search.search(input, 'r');
    const min = Math.min(...direct.offers.map((o) => o.offer.price.customerTotal.amountMinor));
    expect(centre).toMatchObject({ status: 'ok', lowestTotal: { amountMinor: min, currency: 'USD' } });
    // Different weekdays give different schedules, so prices differ across the strip.
    expect(new Set(res.cells.map((c) => c.lowestTotal?.amountMinor)).size).toBeGreaterThan(1);
  });

  it('moves every journey together and marks past dates out of range', async () => {
    const { search, flex } = setup();
    const input = search.parseInput({
      tripType: 'round_trip',
      cabin: 'economy',
      passengers: { adults: 1, children: 0, infants: 0 },
      journeys: [
        { origin: 'DAC', destination: 'DXB', departureDate: '2026-09-16' },
        { origin: 'DXB', destination: 'DAC', departureDate: '2026-09-20' },
      ],
    });
    const res = await flex.lowestFares(input, 'r');
    expect(res.cells[0]).toMatchObject({
      offsetDays: -3,
      status: 'out_of_range',
      departureDates: ['2026-09-13', '2026-09-17'],
    });
    expect(res.cells[1]?.status).toBe('out_of_range'); // 14 Sep has passed in Dhaka
    expect(res.cells[2]).toMatchObject({ departureDates: ['2026-09-15', '2026-09-19'] });
    expect(res.cells[2]?.status).not.toBe('out_of_range');
    for (const c of res.cells) {
      const [out, back] = c.departureDates;
      expect(Date.parse(back!) - Date.parse(out!)).toBe(4 * 86_400_000);
    }
  });

  it('reuses cached searches and isolates a failing date', async () => {
    const { provider, search, flex } = setup();
    const input = search.parseInput({
      tripType: 'one_way',
      cabin: 'economy',
      passengers: { adults: 1, children: 0, infants: 0 },
      journeys: [{ origin: 'DAC', destination: 'DXB', departureDate: '2026-12-22' }],
    });
    await search.search(input, 'r'); // centre date already cached
    const real = provider.searchFlights.bind(provider);
    const spy = vi.spyOn(provider, 'searchFlights').mockImplementation(async (i, ctx) => {
      if (i.journeys[0].departureDate === '2026-12-20') throw new Error('supplier hiccup');
      return real(i, ctx);
    });
    const res = await flex.lowestFares(input, 'r');
    expect(spy).toHaveBeenCalledTimes(6);
    expect(res.cells[1]).toMatchObject({ status: 'unavailable', lowestTotal: null });
    expect(res.cells.filter((c) => c.status === 'ok')).toHaveLength(6);
  });

  it('declines politely when the supplier should not be asked seven times', async () => {
    const { provider, search } = setup();
    const metered = Object.assign(Object.create(provider), { capabilities: { flexibleDates: false } });
    const spy = vi.spyOn(provider, 'searchFlights');
    const flex = new FlexibleDatesService({ provider: metered, search, directory, logger });
    const input = search.parseInput({
      tripType: 'one_way',
      cabin: 'economy',
      passengers: { adults: 1, children: 0, infants: 0 },
      journeys: [{ origin: 'DAC', destination: 'DXB', departureDate: '2026-12-22' }],
    });
    expect(await flex.lowestFares(input, 'r')).toEqual({
      supported: false,
      currency: 'USD',
      dataOrigin: null,
      cells: [],
    });
    expect(spy).not.toHaveBeenCalled();
  });
});
