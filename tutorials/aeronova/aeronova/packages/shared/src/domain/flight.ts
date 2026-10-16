import type { Money } from '../money/money.js';
import type { CurrencyCode } from '../money/currency.js';
import type { MaybeProvided } from './provided.js';

/*
 * Glossary (see docs/ARCHITECTURE.md):
 *   Offer    – a purchasable price for the whole trip, from one supplier.
 *   Journey  – one directional part of a trip (outbound, return, or one multi-city part).
 *   Segment  – one marketed flight number. May include technical stops.
 *   Layover  – ground time between two consecutive segments of the same journey.
 *
 * These are the client-facing shapes. They intentionally contain no supplier
 * identity; the API keeps the supplier binding server-side.
 */

export const CABIN_CLASSES = ['economy', 'premium_economy', 'business', 'first'] as const;
export type CabinClass = (typeof CABIN_CLASSES)[number];

/** Honest provenance for every offer, without revealing which supplier produced it. */
export type OfferDataOrigin = 'demo' | 'sandbox' | 'live';

export interface AirportRef {
  readonly iataCode: string;
  readonly terminal: MaybeProvided<string>;
}

/**
 * Airport-local wall time plus the absolute instant. Display uses `local`;
 * durations and ordering use `utc`. Never re-derive local time from the browser.
 */
export interface FlightMoment {
  readonly local: string; // "2026-12-20T06:20"
  readonly timeZone: string; // "Asia/Dhaka"
  readonly utc: string; // "2026-12-20T00:20:00Z"
}

export interface CarrierRef {
  readonly code: string; // IATA airline designator
  readonly name: string;
}

export interface TechnicalStop {
  readonly airport: AirportRef;
  readonly durationMinutes: MaybeProvided<number>;
}

export interface FlightSegment {
  readonly id: string;
  readonly marketingCarrier: CarrierRef;
  readonly marketingFlightNumber: string;
  readonly operatingCarrier: MaybeProvided<CarrierRef>;
  readonly origin: AirportRef;
  readonly destination: AirportRef;
  readonly departure: FlightMoment;
  readonly arrival: FlightMoment;
  readonly durationMinutes: number;
  readonly aircraft: MaybeProvided<{ readonly code: string; readonly name: MaybeProvided<string> }>;
  readonly cabin: CabinClass;
  readonly technicalStops: readonly TechnicalStop[];
}

export interface Layover {
  readonly afterSegmentId: string;
  readonly beforeSegmentId: string;
  readonly airport: AirportRef;
  readonly durationMinutes: number;
  /** Arrival and next departure airports differ (e.g. LHR → LGW). */
  readonly requiresAirportChange: boolean;
  readonly requiresTerminalChange: MaybeProvided<boolean>;
  /** Separate tickets / no through-checked baggage, when the supplier says so. */
  readonly selfTransfer: MaybeProvided<boolean>;
}

export interface FlightJourney {
  readonly id: string;
  readonly origin: AirportRef;
  readonly destination: AirportRef;
  readonly segments: readonly FlightSegment[];
  readonly layovers: readonly Layover[];
  /** First departure to last arrival, from UTC instants. */
  readonly totalDurationMinutes: number;
}

export type BaggageAllowance =
  | { readonly kind: 'unknown' }
  | { readonly kind: 'none' }
  | { readonly kind: 'pieces'; readonly quantity: number; readonly maxWeightKg: MaybeProvided<number> }
  | { readonly kind: 'weight'; readonly totalKg: number };

export interface BaggagePolicy {
  readonly cabin: BaggageAllowance;
  readonly checked: BaggageAllowance;
}

/**
 * `allowed_fee_unknown`: the supplier says the change or refund is possible
 * but didn't state whether a fee applies. Never shown as free.
 */
export type ConditionValue = 'allowed' | 'allowed_with_fee' | 'allowed_fee_unknown' | 'not_allowed';

export interface FareConditions {
  readonly refund: MaybeProvided<{ readonly value: ConditionValue; readonly penalty: MaybeProvided<Money> }>;
  readonly change: MaybeProvided<{ readonly value: ConditionValue; readonly penalty: MaybeProvided<Money> }>;
}

export type PassengerType = 'adult' | 'child' | 'infant';

export type FeeCategory = 'carrier_surcharge' | 'airport_fee' | 'supplier_fee' | 'other';

export interface PassengerPriceLine {
  readonly passengerType: PassengerType;
  readonly count: number;
  readonly unitTotal: Money;
}

/**
 * Supplier price and customer price are separate from day one so markup,
 * service fees and discounts can be introduced without reshaping bookings.
 */
export interface PriceBreakdown {
  readonly currency: CurrencyCode;
  readonly base: Money;
  readonly taxes: MaybeProvided<Money>;
  readonly fees: readonly {
    readonly category: FeeCategory;
    readonly label: string;
    readonly amount: Money;
  }[];
  readonly supplierTotal: Money;
  readonly markup: Money;
  readonly serviceFee: Money;
  readonly discount: Money;
  readonly customerTotal: Money;
  readonly perPassenger: MaybeProvided<readonly PassengerPriceLine[]>;
}

export interface FlightOffer {
  /** Opaque AeroNova reference. Never a supplier ID. */
  readonly id: string;
  /** Same flights at different fares share this key, so results can group fare options. */
  readonly itineraryKey: string;
  readonly dataOrigin: OfferDataOrigin;
  readonly journeys: readonly FlightJourney[];
  readonly validatingCarrier: MaybeProvided<CarrierRef>;
  readonly cabin: CabinClass;
  readonly fareFamily: MaybeProvided<string>;
  readonly baggage: BaggagePolicy;
  readonly conditions: FareConditions;
  readonly price: PriceBreakdown;
  readonly seatsRemaining: MaybeProvided<number>;
  readonly expiresAt: MaybeProvided<string>;
}
