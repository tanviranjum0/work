import type { FlightSearchResponse, RankedOffer } from '@aeronova/shared';
import { describe, expect, it } from 'vitest';
import fixture from '../../../test/fixtures/search-dac-lhr-return.json';
import { pick } from './IntelligencePanel';

const withId = (r: RankedOffer, id: string): RankedOffer => ({ ...r, offer: { ...r.offer, id } });

describe('IntelligencePanel pick', () => {
  it('breaks ties on the chosen measure by price, not by id', () => {
    const ranked = (fixture as unknown as FlightSearchResponse).offers;
    // Two fares of the same flights: identical travel time, different prices.
    const key = ranked.find(
      (r, i) => ranked.findIndex((o) => o.offer.itineraryKey === r.offer.itineraryKey) !== i,
    )!.offer.itineraryKey;
    const fares = ranked.filter((r) => r.offer.itineraryKey === key);
    const sorted = [...fares].sort(
      (a, b) => a.offer.price.customerTotal.amountMinor - b.offer.price.customerTotal.amountMinor,
    );
    const cheap = withId(sorted[0]!, 'z-cheaper-fare');
    const pricey = withId(sorted.at(-1)!, 'a-pricier-fare');
    expect(pick([pricey, cheap], (r) => r.metrics.totalTravelMinutes)?.offer.id).toBe('z-cheaper-fare');
  });
});
