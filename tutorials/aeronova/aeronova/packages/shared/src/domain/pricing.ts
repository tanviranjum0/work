import type { Money } from '../money/money.js';
import type { FlightOffer, OfferDataOrigin } from './flight.js';

/**
 * A price check ("reprice") result. Search prices are indicative; only a
 * quote may be booked, and only before it expires. When the supplier's price
 * moved, the traveller must acknowledge the change before continuing.
 */
export type PriceCheckStatus = 'confirmed' | 'changed';

export interface PricedQuote {
  /** Opaque reference that the booking step will require (Phase 5). */
  readonly quoteId: string;
  readonly searchId: string;
  readonly offerId: string;
  readonly status: PriceCheckStatus;
  /** The offer as the supplier priced it just now, in the search currency. */
  readonly offer: FlightOffer;
  /** The total shown in search results, for the price-change explanation. */
  readonly previousTotal: Money;
  readonly checkedAt: string;
  readonly expiresAt: string;
  readonly dataOrigin: OfferDataOrigin;
}

export interface PriceCheckRequest {
  readonly searchId: string;
  readonly offerId: string;
}
