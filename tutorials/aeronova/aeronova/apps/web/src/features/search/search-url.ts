import {
  CABIN_CLASSES,
  CURRENCY_CODES,
  type CabinClass,
  type CurrencyCode,
  type FlightSearchInput,
} from '@aeronova/shared';

/*
 * The search is fully described by the URL, so results are shareable,
 * refresh-safe and back-button friendly. Traveller names and other personal
 * details never appear here.
 *
 *   /search?trip=round&from=DAC&to=LHR&depart=2026-12-20&return=2027-01-05&adults=1&cabin=economy
 *   /search?trip=multi&legs=DAC.DXB.2026-12-20~DXB.LHR.2026-12-24&adults=2
 */

export type TripParam = 'round' | 'oneway' | 'multi';

export interface JourneyDraft {
  origin: string;
  destination: string;
  departureDate: string;
}

/** Form state: may be incomplete. The schema decides validity. */
export interface SearchDraft {
  tripType: FlightSearchInput['tripType'];
  journeys: JourneyDraft[];
  returnDate: string;
  adults: number;
  children: number;
  infants: number;
  cabin: CabinClass;
  currency: CurrencyCode;
  directOnly: boolean;
}

export const emptyDraft = (): SearchDraft => ({
  tripType: 'round_trip',
  journeys: [{ origin: '', destination: '', departureDate: '' }],
  returnDate: '',
  adults: 1,
  children: 0,
  infants: 0,
  cabin: 'economy',
  currency: 'USD',
  directOnly: false,
});

const TRIP_TO_PARAM: Record<SearchDraft['tripType'], TripParam> = {
  round_trip: 'round',
  one_way: 'oneway',
  multi_city: 'multi',
};
const PARAM_TO_TRIP: Record<string, SearchDraft['tripType']> = {
  round: 'round_trip',
  oneway: 'one_way',
  multi: 'multi_city',
};

const int = (v: string | null, fallback: number) => {
  const n = Number(v);
  return v !== null && Number.isInteger(n) ? n : fallback;
};

export const draftFromParams = (p: URLSearchParams): SearchDraft => {
  const base = emptyDraft();
  const tripType = PARAM_TO_TRIP[p.get('trip') ?? ''] ?? base.tripType;
  const cabin = (CABIN_CLASSES as readonly string[]).includes(p.get('cabin') ?? '')
    ? (p.get('cabin') as CabinClass)
    : base.cabin;
  const currency = (CURRENCY_CODES as readonly string[]).includes(p.get('currency') ?? '')
    ? (p.get('currency') as CurrencyCode)
    : base.currency;

  const journeys: JourneyDraft[] =
    tripType === 'multi_city'
      ? (p.get('legs') ?? '')
          .split('~')
          .filter(Boolean)
          .slice(0, 6)
          .map((leg) => {
            const [origin = '', destination = '', departureDate = ''] = leg.split('.');
            return { origin: origin.toUpperCase(), destination: destination.toUpperCase(), departureDate };
          })
      : [
          {
            origin: (p.get('from') ?? '').toUpperCase(),
            destination: (p.get('to') ?? '').toUpperCase(),
            departureDate: p.get('depart') ?? '',
          },
        ];

  return {
    tripType,
    journeys: journeys.length > 0 ? journeys : base.journeys,
    returnDate: p.get('return') ?? '',
    adults: int(p.get('adults'), 1),
    children: int(p.get('children'), 0),
    infants: int(p.get('infants'), 0),
    cabin,
    currency,
    directOnly: p.get('direct') === '1',
  };
};

export const paramsFromDraft = (d: SearchDraft): URLSearchParams => {
  const p = new URLSearchParams({ trip: TRIP_TO_PARAM[d.tripType] });
  if (d.tripType === 'multi_city') {
    p.set('legs', d.journeys.map((j) => `${j.origin}.${j.destination}.${j.departureDate}`).join('~'));
  } else {
    const [first] = d.journeys;
    p.set('from', first?.origin ?? '');
    p.set('to', first?.destination ?? '');
    p.set('depart', first?.departureDate ?? '');
    if (d.tripType === 'round_trip') p.set('return', d.returnDate);
  }
  p.set('adults', String(d.adults));
  if (d.children) p.set('children', String(d.children));
  if (d.infants) p.set('infants', String(d.infants));
  p.set('cabin', d.cabin);
  if (d.currency !== 'USD') p.set('currency', d.currency);
  if (d.directOnly) p.set('direct', '1');
  return p;
};

/** Request body shape before validation; the schema turns it into FlightSearchInput. */
export interface SearchPayload {
  readonly tripType: SearchDraft['tripType'];
  readonly journeys: readonly JourneyDraft[];
  readonly passengers: { readonly adults: number; readonly children: number; readonly infants: number };
  readonly cabin: CabinClass;
  readonly currency: CurrencyCode;
  readonly directOnly: boolean;
}

export const toApiInput = (d: SearchDraft): SearchPayload => {
  const [first] = d.journeys;
  const journeys =
    d.tripType === 'round_trip' && first
      ? [first, { origin: first.destination, destination: first.origin, departureDate: d.returnDate }]
      : d.tripType === 'one_way' && first
        ? [first]
        : d.journeys;
  return {
    tripType: d.tripType,
    journeys,
    passengers: { adults: d.adults, children: d.children, infants: d.infants },
    cabin: d.cabin,
    currency: d.currency,
    directOnly: d.directOnly,
  };
};

/**
 * Applies `move` to every date in the current URL, keeping filters, sort and
 * everything else the traveller set.
 */
export const shiftSearchParams = (
  params: URLSearchParams,
  move: (date: string) => string,
): URLSearchParams => {
  const next = new URLSearchParams(params);
  for (const key of ['depart', 'return'] as const) {
    const v = next.get(key);
    if (v) next.set(key, move(v));
  }
  const legs = next.get('legs');
  if (legs) {
    next.set(
      'legs',
      legs
        .split('~')
        .map((leg) => {
          const [o = '', d = '', date = ''] = leg.split('.');
          return `${o}.${d}.${date ? move(date) : date}`;
        })
        .join('~'),
    );
  }
  return next;
};
