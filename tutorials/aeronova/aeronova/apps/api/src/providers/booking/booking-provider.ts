import type { BookingPassenger, FlightOffer } from '@aeronova/shared';
import type { ProviderOfferRef } from '../flight/flight-provider.js';

export interface CreateBookingRequest {
  readonly offerRef: ProviderOfferRef;
  readonly offer: FlightOffer;
  readonly passengers: readonly BookingPassenger[];
  readonly contact: { readonly email: string; readonly phone: string };
  readonly idempotencyKey: string;
}

export type CreateBookingResult =
  | { readonly kind: 'confirmed'; readonly supplierReference: string }
  /** The offer went away between pricing and booking: the traveller must choose again. */
  | { readonly kind: 'unavailable'; readonly reason: 'offer_expired' | 'sold_out' };

/**
 * Creating the reservation with the supplier. Separate from ticketing because
 * suppliers confirm and issue at different times, and either can fail alone.
 */
export interface BookingProvider {
  readonly id: string;
  /** False only when a real supplier is issuing real reservations. */
  readonly simulated: boolean;
  createBooking(request: CreateBookingRequest): Promise<CreateBookingResult>;
  cancelBooking(supplierReference: string): Promise<{ kind: 'cancelled' | 'not_allowed' }>;
}
