import { toCalendarDate, createFlightSearchInputSchema, type FlightSearchInputDraft } from '@aeronova/shared';
import { describe, expect, it } from 'vitest';
import { AIRLINES } from '../../../data/airlines.js';
import { AIRPORTS } from '../../../data/airports.js';
import { AirportDirectory } from '../../../services/airport-directory.js';
import { MockFlightProvider } from './mock-flight-provider.js';

const directory = new AirportDirectory(AIRPORTS, AIRLINES);
const now = () => new Date('2026-09-15T12:00:00Z');
const provider = new MockFlightProvider({ directory, now });
const parse = createFlightSearchInputSchema({ today: toCalendarDate('2026-09-15') });
const ctx = () => ({ signal: new AbortController().signal, requestId: 'test' });

const oneWay = (from: string, to: string, date = '2026-12-21', extra: Partial<FlightSearchInputDraft> = {}) =>
  parse.parse({
    tripType: 'one_way',
    cabin: 'economy',
    passengers: { adults: 1, children: 0, infants: 0 },
    journeys: [{ origin: from, destination: to, departureDate: date }],
    ...extra,
  });

describe('MockFlightProvider', () => {
  it('is deterministic for the same query', async () => {
    const a = await provider.searchFlights(oneWay('DAC', 'LHR'), ctx());
    const b = await provider.searchFlights(oneWay('DAC', 'LHR'), ctx());
    expect(a.offers.map((o) => o.offer.id)).toEqual(b.offers.map((o) => o.offer.id));
    expect(a.offers.map((o) => o.offer.price.customerTotal)).toEqual(
      b.offers.map((o) => o.offer.price.customerTotal),
    );
    expect(a.dataOrigin).toBe('demo');
  });

  it('returns a varied set that exercises filters: stops, carriers, fare families, bags', async () => {
    // Tuesday: the Biman nonstop operates (Tue/Thu/Sat).
    const { offers } = await provider.searchFlights(oneWay('DAC', 'LHR', '2026-12-22'), ctx());
    const stops = new Set(offers.map((o) => o.offer.journeys[0]?.segments.length));
    const carriers = new Set(offers.map((o) => o.offer.journeys[0]?.segments[0]?.marketingCarrier.code));
    const bags = new Set(offers.map((o) => o.offer.baggage.checked.kind));
    expect(stops).toEqual(new Set([1, 2]));
    expect(carriers.size).toBeGreaterThanOrEqual(4);
    expect([...bags]).toEqual(expect.arrayContaining(['none', 'weight', 'pieces']));
    expect(
      offers.some((o) =>
        o.offer.journeys[0]?.layovers.some(
          (l) => l.selfTransfer.status === 'provided' && l.selfTransfer.value,
        ),
      ),
    ).toBe(true);
  });

  it('keeps the price breakdown internally consistent and in integer minor units', async () => {
    const input = oneWay('DAC', 'DXB', '2026-12-21', { passengers: { adults: 2, children: 1, infants: 1 } });
    const { offers } = await provider.searchFlights(input, ctx());
    for (const { offer } of offers) {
      const p = offer.price;
      const taxes = p.taxes.status === 'provided' ? p.taxes.value.amountMinor : 0;
      const fees = p.fees.reduce((s, f) => s + f.amount.amountMinor, 0);
      expect(p.base.amountMinor + taxes + fees).toBe(p.supplierTotal.amountMinor);
      expect(p.customerTotal).toEqual(p.supplierTotal);
      expect(Number.isInteger(p.customerTotal.amountMinor)).toBe(true);
      expect(p.perPassenger.status).toBe('provided');
      if (p.perPassenger.status === 'provided') {
        const lineSum = p.perPassenger.value.reduce((s, l) => s + l.unitTotal.amountMinor * l.count, 0);
        expect(lineSum).toBe(p.customerTotal.amountMinor);
        expect(p.perPassenger.value.map((l) => l.passengerType)).toEqual(['adult', 'child', 'infant']);
      }
      expect(offer.seatsRemaining.status).toBe('not_provided');
    }
  });

  it('models local times, time zones and durations correctly across zones', async () => {
    const { offers } = await provider.searchFlights(oneWay('DAC', 'LHR', '2026-12-22'), ctx());
    const direct = offers.find((o) => o.ref.providerOfferId.startsWith('bg-dac-lhr@'));
    const seg = direct?.offer.journeys[0]?.segments[0];
    expect(seg?.departure).toEqual({
      local: '2026-12-22T09:40',
      timeZone: 'Asia/Dhaka',
      utc: '2026-12-22T03:40:00.000Z',
    });
    // 650 minutes later, London is UTC+0 in December.
    expect(seg?.arrival).toEqual({
      local: '2026-12-22T14:30',
      timeZone: 'Europe/London',
      utc: '2026-12-22T14:30:00.000Z',
    });
    expect(direct?.offer.journeys[0]?.totalDurationMinutes).toBe(650);
  });

  it('expresses connections as layovers with airport-change detection', async () => {
    const { offers } = await provider.searchFlights(oneWay('CDG', 'NYC', '2026-12-21'), ctx());
    const selfTransfer = offers.find((o) => o.ref.providerOfferId.startsWith('selfxfer-cdg'));
    const layover = selfTransfer?.offer.journeys[0]?.layovers[0];
    expect(layover).toMatchObject({ durationMinutes: 300, requiresAirportChange: true });
    expect(layover?.selfTransfer).toEqual({ status: 'provided', value: true });
    expect(selfTransfer?.offer.validatingCarrier.status).toBe('not_provided');
  });

  it('surfaces technical stops on a single segment instead of dropping them', async () => {
    const { offers } = await provider.searchFlights(oneWay('DAC', 'KUL', '2026-12-21'), ctx()); // Monday
    const tech = offers.find((o) => o.ref.providerOfferId.startsWith('bg-dac-kul-tech-cgp@'));
    expect(tech?.offer.journeys[0]?.segments).toHaveLength(1);
    expect(tech?.offer.journeys[0]?.segments[0]?.technicalStops[0]).toMatchObject({
      airport: { iataCode: 'CGP' },
    });
    // It doesn't operate on Tuesdays, and "direct only" means nonstop.
    const tue = await provider.searchFlights(oneWay('DAC', 'KUL', '2026-12-22'), ctx());
    expect(tue.offers.some((o) => o.ref.providerOfferId.startsWith('bg-dac-kul-tech-cgp@'))).toBe(false);
    const nonstop = await provider.searchFlights(
      oneWay('DAC', 'KUL', '2026-12-21', { directOnly: true }),
      ctx(),
    );
    expect(nonstop.offers.some((o) => o.ref.providerOfferId.startsWith('bg-dac-kul-tech-cgp@'))).toBe(false);
  });

  it('marks undisclosed baggage and conditions as not provided rather than inventing them', async () => {
    const { offers } = await provider.searchFlights(oneWay('DAC', 'BKK'), ctx());
    const lcc = offers.find((o) => o.ref.providerOfferId.startsWith('fd-dac-dmk@'));
    expect(lcc?.offer.baggage.checked.kind).toBe('unknown');
    expect(lcc?.offer.conditions.refund.status).toBe('not_provided');
    expect(lcc?.offer.journeys[0]?.segments[0]?.aircraft.status).toBe('not_provided');
  });

  it('builds round trips from the same ticketing carrier, with correct return direction', async () => {
    const input = parse.parse({
      tripType: 'round_trip',
      cabin: 'economy',
      passengers: { adults: 1, children: 0, infants: 0 },
      journeys: [
        { origin: 'DAC', destination: 'DXB', departureDate: '2026-12-20' },
        { origin: 'DXB', destination: 'DAC', departureDate: '2027-01-05' },
      ],
    });
    const { offers } = await provider.searchFlights(input, ctx());
    expect(offers.length).toBeGreaterThan(0);
    for (const { offer } of offers) {
      expect(offer.journeys).toHaveLength(2);
      expect(offer.journeys[1]?.segments[0]?.origin.iataCode).toMatch(/DXB|DWC/);
      expect(offer.journeys[1]?.segments.at(-1)?.destination.iataCode).toBe('DAC');
      const carriers = new Set(offer.journeys.map((j) => j.segments[0]?.marketingCarrier.code));
      expect(carriers.size).toBe(1);
    }
  });

  it('returns nothing for unserved routes and cabins, and honours cancellation', async () => {
    expect((await provider.searchFlights(oneWay('SYD', 'DAC'), ctx())).offers).toEqual([]);
    expect(
      (await provider.searchFlights(oneWay('DAC', 'DEL', '2026-12-21', { cabin: 'first' }), ctx())).offers,
    ).toEqual([]);
    const slow = new MockFlightProvider({ directory, now, latencyMs: 1_000 });
    const ac = new AbortController();
    const pending = slow.searchFlights(oneWay('DAC', 'LHR'), { signal: ac.signal, requestId: 't' });
    ac.abort(new Error('cancelled'));
    await expect(pending).rejects.toThrow('cancelled');
  });
});
