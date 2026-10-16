import type { CurrencyCode } from '../money/currency.js';
import type { Money } from '../money/money.js';
import type { FlightSearchInput } from '../schemas/flight-search.js';
import type { OfferDataOrigin } from './flight.js';
import type { RankedOffer } from './ranking.js';

/** Display names for every location code in a response, so clients never guess. */
export interface PlaceSummary {
  readonly code: string;
  readonly kind: 'airport' | 'city';
  readonly cityName: string;
  /** Airport name, or "All airports" wording is left to the client for cities. */
  readonly airportName: string | null;
  readonly countryName: string;
  readonly timeZone: string;
}

export type CurrencyConversionSource = 'none' | 'supplier' | 'demo_rates';

export interface FlightSearchResponse {
  readonly searchId: string;
  readonly query: FlightSearchInput;
  readonly dataOrigin: OfferDataOrigin;
  readonly currency: CurrencyCode;
  /** How prices reached `currency`. `demo_rates` must be disclosed in the UI. */
  readonly conversion: CurrencyConversionSource;
  readonly generatedAt: string;
  /** Offers stop being bookable after this; a reprice is required. */
  readonly expiresAt: string;
  readonly totalOffers: number;
  /** True when the supplier returned more offers than the configured cap. */
  readonly truncated: boolean;
  readonly offers: readonly RankedOffer[];
  /** Keyed by IATA airport or city code. Covers the query and every offer. */
  readonly places: Readonly<Record<string, PlaceSummary>>;
}

export type FlexibleDateStatus = 'ok' | 'no_flights' | 'out_of_range' | 'unavailable';

export interface FlexibleDateCell {
  /** Shift applied to every journey date, in days. 0 is the searched trip. */
  readonly offsetDays: number;
  /** Departure date of each journey after the shift. */
  readonly departureDates: readonly string[];
  readonly status: FlexibleDateStatus;
  /** Lowest customer total on that date, when status is 'ok'. */
  readonly lowestTotal: Money | null;
}

export interface FlexibleDatesResponse {
  /** False when the connected supplier can't answer this cheaply; clients hide the view. */
  readonly supported: boolean;
  readonly currency: CurrencyCode;
  /** Null when no search ran (unsupported, or every date out of range). */
  readonly dataOrigin: OfferDataOrigin | null;
  readonly cells: readonly FlexibleDateCell[];
}
