import type { FlightOffer, FlightSearchInput, OfferDataOrigin } from '@aeronova/shared';

export type FlightProviderId = 'mock' | 'duffel';

export interface ProviderContext {
  readonly signal: AbortSignal;
  readonly requestId: string;
}

/**
 * The supplier binding for an offer. Stays server-side: clients only ever see
 * `FlightOffer.id`, and the API looks the binding up when repricing or booking.
 */
export interface ProviderOfferRef {
  readonly provider: FlightProviderId;
  readonly providerOfferId: string;
}

export interface ProviderBoundOffer {
  readonly offer: FlightOffer;
  readonly ref: ProviderOfferRef;
}

export interface ProviderSearchResult {
  readonly offers: readonly ProviderBoundOffer[];
  readonly dataOrigin: OfferDataOrigin;
  /** Supplier-declared expiry for the whole result set, if any. */
  readonly expiresAt: string | undefined;
}

export type ProviderPriceResult =
  /** Supplier re-confirmed the offer. `offer` may carry a different price. */
  | { readonly kind: 'priced'; readonly offer: FlightOffer; readonly expiresAt: string }
  /** Supplier no longer sells this offer (expired, sold out, withdrawn). */
  | { readonly kind: 'unavailable'; readonly reason: 'expired' | 'sold_out' };

/**
 * Every supplier adapter implements this. Adapters own all supplier-specific
 * shapes and must return fully normalized offers priced in a single currency.
 */
export interface FlightProviderCapabilities {
  /**
   * Whether nearby-date prices may be fetched by running extra searches.
   * Off for metered suppliers: seven searches per results page burns quota.
   */
  readonly flexibleDates: boolean;
}

export interface FlightProvider {
  readonly id: FlightProviderId;
  readonly capabilities: FlightProviderCapabilities;
  /** Safe to retry: search has no side effects. */
  searchFlights(input: FlightSearchInput, ctx: ProviderContext): Promise<ProviderSearchResult>;
  /**
   * Re-confirms one offer with the supplier. Read-only on the supplier side,
   * but not retried automatically: the traveller decides when to check again.
   * `known` is the normalized offer from search, for suppliers (like the mock)
   * that price relative to it; real adapters fetch the offer by `ref`.
   */
  priceOffer(ref: ProviderOfferRef, known: FlightOffer, ctx: ProviderContext): Promise<ProviderPriceResult>;
}
