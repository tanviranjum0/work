import {
  rankOffers,
  type FlightSearchResponse,
  type RankedOffer,
  type RankingWeights,
} from '@aeronova/shared';
import { wallHour } from '@aeronova/shared';

/*
 * Client-side result shaping: filter → re-rank (if the traveller changed
 * priorities) → sort → group fare options of the same flights.
 * Everything here is pure so it can be tested without rendering.
 */

export const SORT_KEYS = [
  'recommended',
  'cheapest',
  'fastest',
  'earliest',
  'latest',
  'shortest_layover',
] as const;
export type SortKey = (typeof SORT_KEYS)[number];

export const TIME_WINDOWS = {
  early: [0, 6],
  morning: [6, 12],
  afternoon: [12, 18],
  evening: [18, 24],
} as const;
export type TimeWindow = keyof typeof TIME_WINDOWS;

export interface ResultFilters {
  readonly stops: readonly (0 | 1 | 2)[]; // 2 means "2 or more"
  readonly airlines: readonly string[];
  readonly maxPriceMinor: number | null;
  readonly maxDurationMinutes: number | null;
  readonly departWindows: readonly TimeWindow[];
  readonly checkedBag: boolean;
  readonly refundable: boolean;
  readonly avoidSelfTransfer: boolean;
  readonly avoidAirportChange: boolean;
  readonly avoidOvernightLayover: boolean;
  readonly avoidRedEye: boolean;
}

export const NO_FILTERS: ResultFilters = {
  stops: [],
  airlines: [],
  maxPriceMinor: null,
  maxDurationMinutes: null,
  departWindows: [],
  checkedBag: false,
  refundable: false,
  avoidSelfTransfer: false,
  avoidAirportChange: false,
  avoidOvernightLayover: false,
  avoidRedEye: false,
};

export const PRIORITY_PRESETS = {
  balanced: { price: 0.45, duration: 0.3, stops: 0.12, baggage: 0.06, convenience: 0.07 },
  price: { price: 0.8, duration: 0.1, stops: 0.05, baggage: 0.02, convenience: 0.03 },
  time: { price: 0.2, duration: 0.6, stops: 0.12, baggage: 0.03, convenience: 0.05 },
  stops: { price: 0.25, duration: 0.2, stops: 0.45, baggage: 0.03, convenience: 0.07 },
  baggage: { price: 0.35, duration: 0.2, stops: 0.1, baggage: 0.3, convenience: 0.05 },
} as const satisfies Record<string, RankingWeights>;
export type PriorityKey = keyof typeof PRIORITY_PRESETS;

const stopBucket = (stops: number): 0 | 1 | 2 => (stops >= 2 ? 2 : (stops as 0 | 1));

/**
 * Stops as travellers mean them: the most on any one journey. A round trip
 * with one connection each way is a "1 stop" trip, not "2 stops".
 */
export const maxStopsPerJourney = (r: RankedOffer): number =>
  Math.max(
    0,
    ...r.offer.journeys.map(
      (j) => j.layovers.length + j.segments.reduce((n, s) => n + s.technicalStops.length, 0),
    ),
  );
const offerCarriers = (r: RankedOffer) =>
  new Set(r.offer.journeys.flatMap((j) => j.segments.map((s) => s.marketingCarrier.code)));
const firstDeparture = (r: RankedOffer) => r.offer.journeys[0]?.segments[0]?.departure;

export const matchesFilters = (r: RankedOffer, f: ResultFilters): boolean => {
  const m = r.metrics;
  if (f.stops.length && !f.stops.includes(stopBucket(maxStopsPerJourney(r)))) return false;
  if (f.airlines.length) {
    const carriers = offerCarriers(r);
    if (!f.airlines.some((a) => carriers.has(a))) return false;
  }
  if (f.maxPriceMinor !== null && r.offer.price.customerTotal.amountMinor > f.maxPriceMinor) return false;
  if (f.maxDurationMinutes !== null && m.totalTravelMinutes > f.maxDurationMinutes) return false;
  if (f.departWindows.length) {
    const dep = firstDeparture(r);
    const h = dep ? wallHour(dep.local) : -1;
    if (!f.departWindows.some((w) => h >= TIME_WINDOWS[w][0] && h < TIME_WINDOWS[w][1])) return false;
  }
  // Unknown never satisfies a "must include" filter: we don't assume a bag or a refund.
  if (f.checkedBag && m.checkedBagIncluded !== 'yes') return false;
  if (f.refundable && m.refundable !== 'yes') return false;
  // "Avoid" filters exclude only what we know is present.
  if (f.avoidSelfTransfer && m.hasSelfTransfer === 'yes') return false;
  if (f.avoidAirportChange && m.hasAirportChange) return false;
  if (f.avoidOvernightLayover && m.hasOvernightLayover) return false;
  if (f.avoidRedEye && m.hasRedEye) return false;
  return true;
};

const compare: Record<SortKey, (a: RankedOffer, b: RankedOffer) => number> = {
  recommended: (a, b) => b.score - a.score,
  cheapest: (a, b) => a.offer.price.customerTotal.amountMinor - b.offer.price.customerTotal.amountMinor,
  fastest: (a, b) => a.metrics.totalTravelMinutes - b.metrics.totalTravelMinutes,
  earliest: (a, b) => (firstDeparture(a)?.utc ?? '').localeCompare(firstDeparture(b)?.utc ?? ''),
  latest: (a, b) => (firstDeparture(b)?.utc ?? '').localeCompare(firstDeparture(a)?.utc ?? ''),
  shortest_layover: (a, b) => a.metrics.layoverMinutes - b.metrics.layoverMinutes,
};

const tieBreak = (a: RankedOffer, b: RankedOffer) =>
  a.offer.price.customerTotal.amountMinor - b.offer.price.customerTotal.amountMinor ||
  a.offer.id.localeCompare(b.offer.id);

export interface ItineraryGroup {
  /** The fare shown on the card: the first match under the current sort. */
  readonly lead: RankedOffer;
  readonly fares: readonly RankedOffer[];
  readonly lowestPriceMinor: number;
}

export interface ShapedResults {
  readonly groups: readonly ItineraryGroup[];
  readonly totalItineraries: number;
  readonly ranked: readonly RankedOffer[];
}

export const shapeResults = (
  response: FlightSearchResponse,
  opts: { filters: ResultFilters; sort: SortKey; priority: PriorityKey },
): ShapedResults => {
  const ranked =
    opts.priority === 'balanced'
      ? response.offers
      : rankOffers(
          response.offers.map((o) => o.offer),
          PRIORITY_PRESETS[opts.priority],
        );
  const all = groupByItinerary([...ranked].sort((a, b) => compare[opts.sort](a, b) || tieBreak(a, b)));
  const filtered = ranked.filter((r) => matchesFilters(r, opts.filters));
  const sorted = [...filtered].sort((a, b) => compare[opts.sort](a, b) || tieBreak(a, b));
  return { groups: groupByItinerary(sorted), totalItineraries: all.length, ranked };
};

const groupByItinerary = (sorted: readonly RankedOffer[]): ItineraryGroup[] => {
  const map = new Map<string, RankedOffer[]>();
  for (const r of sorted) {
    const list = map.get(r.offer.itineraryKey) ?? [];
    list.push(r);
    map.set(r.offer.itineraryKey, list);
  }
  return [...map.values()].map((fares) => ({
    lead: fares[0] as RankedOffer,
    fares,
    lowestPriceMinor: Math.min(...fares.map((f) => f.offer.price.customerTotal.amountMinor)),
  }));
};

export interface Facets {
  readonly stops: Readonly<Record<0 | 1 | 2, number>>;
  readonly airlines: readonly { code: string; name: string; count: number; minPriceMinor: number }[];
  readonly priceRange: readonly [number, number];
  readonly durationRange: readonly [number, number];
  /** False when no offer discloses the fact, so the filter can't mean anything. */
  readonly bagDataAvailable: boolean;
  readonly refundDataAvailable: boolean;
  readonly anySelfTransfer: boolean;
  readonly anyAirportChange: boolean;
  readonly anyOvernight: boolean;
  readonly anyRedEye: boolean;
}

/** Facets describe the full result set so options don't vanish as filters are applied. */
export const computeFacets = (offers: readonly RankedOffer[]): Facets => {
  const stops = { 0: 0, 1: 0, 2: 0 };
  const airlines = new Map<string, { code: string; name: string; count: number; minPriceMinor: number }>();
  const itinerariesByStop = new Map<string, 0 | 1 | 2>();
  let pMin = Infinity;
  let pMax = 0;
  let dMin = Infinity;
  let dMax = 0;
  for (const r of offers) {
    itinerariesByStop.set(r.offer.itineraryKey, stopBucket(maxStopsPerJourney(r)));
    const price = r.offer.price.customerTotal.amountMinor;
    pMin = Math.min(pMin, price);
    pMax = Math.max(pMax, price);
    dMin = Math.min(dMin, r.metrics.totalTravelMinutes);
    dMax = Math.max(dMax, r.metrics.totalTravelMinutes);
    for (const s of r.offer.journeys.flatMap((j) => j.segments)) {
      const a = airlines.get(s.marketingCarrier.code) ?? {
        ...s.marketingCarrier,
        count: 0,
        minPriceMinor: Infinity,
      };
      a.minPriceMinor = Math.min(a.minPriceMinor, price);
      airlines.set(s.marketingCarrier.code, a);
    }
  }
  for (const b of itinerariesByStop.values()) stops[b] += 1;
  const airlineItineraries = new Map<string, Set<string>>();
  for (const r of offers) {
    for (const code of offerCarriers(r)) {
      const set = airlineItineraries.get(code) ?? new Set();
      set.add(r.offer.itineraryKey);
      airlineItineraries.set(code, set);
    }
  }
  return {
    stops,
    airlines: [...airlines.values()]
      .map((a) => ({ ...a, count: airlineItineraries.get(a.code)?.size ?? 0 }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    priceRange: offers.length ? [pMin, pMax] : [0, 0],
    durationRange: offers.length ? [dMin, dMax] : [0, 0],
    bagDataAvailable: offers.some((r) => r.metrics.checkedBagIncluded !== 'unknown'),
    refundDataAvailable: offers.some((r) => r.metrics.refundable !== 'unknown'),
    anySelfTransfer: offers.some((r) => r.metrics.hasSelfTransfer === 'yes'),
    anyAirportChange: offers.some((r) => r.metrics.hasAirportChange),
    anyOvernight: offers.some((r) => r.metrics.hasOvernightLayover),
    anyRedEye: offers.some((r) => r.metrics.hasRedEye),
  };
};

/* ---- filter/sort URL encoding (kept alongside the search params) ---- */

const csv = (v: string | null) => (v ? v.split(',').filter(Boolean) : []);

export const filtersFromParams = (p: URLSearchParams): ResultFilters => ({
  stops: csv(p.get('stops'))
    .map(Number)
    .filter((n): n is 0 | 1 | 2 => n === 0 || n === 1 || n === 2),
  airlines: csv(p.get('airlines')).filter((c) => /^[A-Z0-9]{2}$/.test(c)),
  maxPriceMinor:
    p.has('maxPrice') && Number.isSafeInteger(Number(p.get('maxPrice'))) ? Number(p.get('maxPrice')) : null,
  maxDurationMinutes:
    p.has('maxDuration') && Number.isSafeInteger(Number(p.get('maxDuration')))
      ? Number(p.get('maxDuration'))
      : null,
  departWindows: csv(p.get('depWin')).filter((w): w is TimeWindow => w in TIME_WINDOWS),
  checkedBag: p.get('bag') === '1',
  refundable: p.get('refund') === '1',
  avoidSelfTransfer: p.get('noSelfTransfer') === '1',
  avoidAirportChange: p.get('noAirportChange') === '1',
  avoidOvernightLayover: p.get('noOvernight') === '1',
  avoidRedEye: p.get('noRedEye') === '1',
});

const FILTER_PARAM_KEYS = [
  'stops',
  'airlines',
  'maxPrice',
  'maxDuration',
  'depWin',
  'bag',
  'refund',
  'noSelfTransfer',
  'noAirportChange',
  'noOvernight',
  'noRedEye',
] as const;

export const writeFilters = (p: URLSearchParams, f: ResultFilters): URLSearchParams => {
  const next = new URLSearchParams(p);
  for (const k of FILTER_PARAM_KEYS) next.delete(k);
  const set = (k: string, v: string | null | false) => {
    if (v) next.set(k, v);
  };
  set('stops', f.stops.length ? [...f.stops].sort().join(',') : null);
  set('airlines', f.airlines.length ? [...f.airlines].sort().join(',') : null);
  set('maxPrice', f.maxPriceMinor !== null ? String(f.maxPriceMinor) : null);
  set('maxDuration', f.maxDurationMinutes !== null ? String(f.maxDurationMinutes) : null);
  set('depWin', f.departWindows.length ? f.departWindows.join(',') : null);
  set('bag', f.checkedBag && '1');
  set('refund', f.refundable && '1');
  set('noSelfTransfer', f.avoidSelfTransfer && '1');
  set('noAirportChange', f.avoidAirportChange && '1');
  set('noOvernight', f.avoidOvernightLayover && '1');
  set('noRedEye', f.avoidRedEye && '1');
  return next;
};

export const activeFilterCount = (f: ResultFilters) =>
  FILTER_PARAM_KEYS.length -
  FILTER_PARAM_KEYS.filter((k) => writeFilters(new URLSearchParams(), f).get(k) === null).length;

export const sortFromParams = (p: URLSearchParams): SortKey =>
  (SORT_KEYS as readonly string[]).includes(p.get('sort') ?? '') ? (p.get('sort') as SortKey) : 'recommended';

export const priorityFromParams = (p: URLSearchParams): PriorityKey => {
  const v = p.get('priority') ?? '';
  return v in PRIORITY_PRESETS ? (v as PriorityKey) : 'balanced';
};

/* ---- comparison (itinerary keys are stable within a search, so shareable) ---- */

export const MAX_COMPARE = 3;

export const compareFromParams = (p: URLSearchParams): string[] =>
  [...new Set(csv(p.get('compare')).filter((k) => /^itn_[a-z0-9]{8,32}$/.test(k)))].slice(0, MAX_COMPARE);

export const writeCompare = (p: URLSearchParams, keys: readonly string[]): URLSearchParams => {
  const next = new URLSearchParams(p);
  if (keys.length) next.set('compare', keys.slice(0, MAX_COMPARE).join(','));
  else next.delete('compare');
  return next;
};

/** DOM id for an itinerary's result card, used by in-page links. */
export const itineraryAnchor = (itineraryKey: string) => `itinerary-${itineraryKey}`;

/**
 * Airlines that operate a flight on behalf of the one selling it (codeshares).
 * Shown on the first screen an offer appears, as operator disclosure rules require.
 */
export const codeshareOperators = (offer: RankedOffer['offer']): string[] => {
  const names = new Set<string>();
  for (const s of offer.journeys.flatMap((j) => j.segments)) {
    const op = s.operatingCarrier;
    if (op.status === 'provided' && op.value.name !== s.marketingCarrier.name) names.add(op.value.name);
  }
  return [...names];
};
