import type { FlightSearchResponse } from '@aeronova/shared';
import { describe, expect, it } from 'vitest';
import fixture from '../../test/fixtures/search-dac-lhr.json';
import returnFixture from '../../test/fixtures/search-dac-lhr-return.json';
import {
  activeFilterCount,
  computeFacets,
  filtersFromParams,
  maxStopsPerJourney,
  NO_FILTERS,
  shapeResults,
  writeFilters,
} from './results-model';

const response = fixture as unknown as FlightSearchResponse;
const shape = (over: Partial<Parameters<typeof shapeResults>[1]> = {}) =>
  shapeResults(response, { filters: NO_FILTERS, sort: 'recommended', priority: 'balanced', ...over });

describe('results model', () => {
  it('groups fare options of the same flights into one itinerary', () => {
    const { groups, totalItineraries } = shape();
    const keys = new Set(response.offers.map((o) => o.offer.itineraryKey));
    expect(groups).toHaveLength(keys.size);
    expect(totalItineraries).toBe(keys.size);
    expect(groups.reduce((n, g) => n + g.fares.length, 0)).toBe(response.offers.length);
    for (const g of groups)
      expect(g.lowestPriceMinor).toBeLessThanOrEqual(g.lead.offer.price.customerTotal.amountMinor);
  });

  it('sorts by price and duration', () => {
    const cheap = shape({ sort: 'cheapest' }).groups.map((g) => g.lead.offer.price.customerTotal.amountMinor);
    expect(cheap).toEqual([...cheap].sort((a, b) => a - b));
    const fast = shape({ sort: 'fastest' }).groups.map((g) => g.lead.metrics.totalTravelMinutes);
    expect(fast).toEqual([...fast].sort((a, b) => a - b));
  });

  it('filters nonstop only, and never treats unknown baggage as included', () => {
    const nonstop = shape({ filters: { ...NO_FILTERS, stops: [0] } });
    expect(nonstop.groups.length).toBeGreaterThan(0);
    expect(nonstop.groups.every((g) => g.lead.metrics.stops === 0)).toBe(true);

    const bags = shape({ filters: { ...NO_FILTERS, checkedBag: true } });
    expect(bags.groups.every((g) => g.fares.every((f) => f.metrics.checkedBagIncluded === 'yes'))).toBe(true);
    // A bag filter picks the bag-inclusive fare as the card's lead where one exists.
    expect(bags.groups.length).toBeGreaterThan(0);
  });

  it('excludes known self-transfers and keeps totals honest', () => {
    const avoided = shape({ filters: { ...NO_FILTERS, avoidSelfTransfer: true } });
    expect(avoided.groups.some((g) => g.lead.metrics.hasSelfTransfer === 'yes')).toBe(false);
    expect(avoided.totalItineraries).toBe(shape().totalItineraries);
  });

  it('re-ranks for a price-first traveller', () => {
    const top = shape({ priority: 'price' }).groups[0]?.lead.offer.price.customerTotal.amountMinor;
    const min = Math.min(...response.offers.map((o) => o.offer.price.customerTotal.amountMinor));
    expect(top).toBe(min);
  });

  it('computes facets over the full set with itinerary-level counts', () => {
    const f = computeFacets(response.offers);
    expect(f.stops[0] + f.stops[1] + f.stops[2]).toBe(shape().totalItineraries);
    expect(f.airlines.map((a) => a.code)).toEqual(expect.arrayContaining(['BG', 'EK', 'QR', 'TK']));
    expect(f.priceRange[0]).toBeLessThan(f.priceRange[1]);
    expect(f.bagDataAvailable).toBe(true);
    expect(f.anySelfTransfer).toBe(true);
  });

  it('round-trips filters through the URL and ignores junk', () => {
    const f = {
      ...NO_FILTERS,
      stops: [1, 0] as (0 | 1)[],
      airlines: ['QR', 'EK'],
      checkedBag: true,
      maxPriceMinor: 90000,
    };
    const p = writeFilters(new URLSearchParams('from=DAC&stops=2'), f);
    expect(p.get('from')).toBe('DAC');
    expect(p.get('stops')).toBe('0,1');
    expect(filtersFromParams(p)).toEqual({ ...f, stops: [0, 1], airlines: ['EK', 'QR'] });
    expect(activeFilterCount(f)).toBe(4);
    expect(
      filtersFromParams(new URLSearchParams('stops=7,x&airlines=<b>&depWin=noon&maxPrice=1e99')),
    ).toEqual(NO_FILTERS);
  });

  it('counts stops per journey, so a round trip with one stop each way is a 1-stop trip', () => {
    const rt = returnFixture as unknown as FlightSearchResponse;
    const oneStopEachWay = rt.offers.find((o) => o.offer.journeys.every((j) => j.layovers.length === 1));
    expect(oneStopEachWay).toBeDefined();
    expect(oneStopEachWay!.metrics.stops).toBe(2); // total, used for scoring
    expect(maxStopsPerJourney(oneStopEachWay!)).toBe(1); // what travellers filter by

    const facets = computeFacets(rt.offers);
    expect(facets.stops[1]).toBeGreaterThan(0);
    const oneStop = shapeResults(rt, {
      filters: { ...NO_FILTERS, stops: [1] },
      sort: 'recommended',
      priority: 'balanced',
    });
    expect(oneStop.groups.length).toBe(facets.stops[1]);
  });
});

describe('codeshareOperators', () => {
  it('lists operators that differ from the selling airline, once each', async () => {
    const { codeshareOperators } = await import('./results-model');
    const offer = (fixture as unknown as FlightSearchResponse).offers[0]!.offer;
    const seg = offer.journeys[0]!.segments[0]!;
    const codeshare = {
      ...offer,
      journeys: [
        {
          ...offer.journeys[0]!,
          segments: [
            {
              ...seg,
              operatingCarrier: {
                status: 'provided' as const,
                value: { code: 'AA', name: 'American Airlines' },
              },
            },
            {
              ...seg,
              id: 'x',
              operatingCarrier: {
                status: 'provided' as const,
                value: { code: 'AA', name: 'American Airlines' },
              },
            },
            { ...seg, id: 'y', operatingCarrier: { status: 'not_provided' as const } },
          ],
        },
      ],
    };
    expect(codeshareOperators(codeshare)).toEqual(['American Airlines']);
    expect(codeshareOperators(offer)).toEqual([]);
  });
});
