import type { CurrencyCode } from '../money/currency.js';
import type { Money } from '../money/money.js';
import type { FlightOffer, PassengerType } from './flight.js';

/**
 * Booking lifecycle. Payment, supplier booking and ticketing are separate
 * steps that fail independently, so each has its own state: a captured payment
 * never implies a confirmed booking, and a confirmed booking never implies a
 * ticket.
 */
export const BOOKING_STATES = [
  'DRAFT',
  'PAYMENT_PENDING',
  'PAYMENT_AUTHORIZED',
  'BOOKING_CONFIRMED',
  'TICKETING_PENDING',
  'TICKETED',
  'FAILED',
  'CANCEL_REQUESTED',
  'CANCELLED',
  'REFUND_PENDING',
  'REFUNDED',
  /** Money moved but the trip did not: needs a human, never shown as success. */
  'PAYMENT_RECONCILIATION_REQUIRED',
] as const;
export type BookingState = (typeof BOOKING_STATES)[number];

const TRANSITIONS: Readonly<Record<BookingState, readonly BookingState[]>> = Object.freeze({
  DRAFT: ['PAYMENT_PENDING', 'FAILED', 'CANCELLED'],
  PAYMENT_PENDING: ['PAYMENT_AUTHORIZED', 'FAILED'],
  // Payment succeeded: from here a failure must not silently discard the money.
  PAYMENT_AUTHORIZED: ['BOOKING_CONFIRMED', 'PAYMENT_RECONCILIATION_REQUIRED', 'REFUND_PENDING'],
  BOOKING_CONFIRMED: ['TICKETING_PENDING', 'CANCEL_REQUESTED', 'PAYMENT_RECONCILIATION_REQUIRED'],
  TICKETING_PENDING: ['TICKETED', 'PAYMENT_RECONCILIATION_REQUIRED', 'CANCEL_REQUESTED'],
  TICKETED: ['CANCEL_REQUESTED'],
  CANCEL_REQUESTED: ['CANCELLED', 'REFUND_PENDING', 'TICKETED'],
  REFUND_PENDING: ['REFUNDED', 'PAYMENT_RECONCILIATION_REQUIRED'],
  FAILED: [],
  CANCELLED: [],
  REFUNDED: [],
  PAYMENT_RECONCILIATION_REQUIRED: ['REFUND_PENDING', 'BOOKING_CONFIRMED', 'CANCELLED'],
});

export const isTerminalBookingState = (state: BookingState): boolean => TRANSITIONS[state].length === 0;

export const canTransition = (from: BookingState, to: BookingState): boolean =>
  TRANSITIONS[from].includes(to);

export class InvalidBookingTransitionError extends Error {
  constructor(
    readonly from: BookingState,
    readonly to: BookingState,
  ) {
    super(`A booking cannot go from ${from} to ${to}.`);
    this.name = 'InvalidBookingTransitionError';
  }
}

/** The only way a booking's state changes. Illegal moves throw rather than being ignored. */
export const nextBookingState = (from: BookingState, to: BookingState): BookingState => {
  if (!canTransition(from, to)) throw new InvalidBookingTransitionError(from, to);
  return to;
};

/** A booking is money-in-flight until it is ticketed, cancelled or refunded. */
export const needsAttention = (state: BookingState): boolean => state === 'PAYMENT_RECONCILIATION_REQUIRED';

export const PAYMENT_STATES = [
  'INITIATED',
  'PENDING',
  'AUTHORIZED',
  'CAPTURED',
  'FAILED',
  'REFUNDED',
] as const;
export type PaymentState = (typeof PAYMENT_STATES)[number];

export const TICKET_STATES = ['PENDING', 'ISSUED', 'FAILED', 'VOIDED'] as const;
export type TicketState = (typeof TICKET_STATES)[number];

export interface BookingPassenger {
  readonly id: string;
  readonly type: PassengerType;
  readonly title: string | null;
  readonly givenName: string;
  readonly middleName: string | null;
  readonly familyName: string;
  readonly dateOfBirth: string;
  readonly gender: string | null;
  readonly nationality: string | null;
  /** Present only when the fare requires it; never stored on a saved traveller. */
  readonly travelDocument: {
    readonly type: 'passport';
    readonly number: string;
    readonly issuingCountry: string;
    readonly expiryDate: string;
  } | null;
  readonly loyaltyNumber: string | null;
}

export interface BookingContact {
  readonly email: string;
  readonly phone: string;
}

/**
 * Everything needed to show the booking years later, copied at confirmation.
 * Supplier offers expire, so an old booking is never re-read from a provider.
 */
export interface BookingSnapshot {
  readonly offer: FlightOffer;
  readonly capturedAt: string;
  /** Where the flight data came from, so a demo booking can never look live. */
  readonly dataOrigin: FlightOffer['dataOrigin'];
}

export interface PaymentAttempt {
  readonly id: string;
  readonly state: PaymentState;
  readonly amount: Money;
  readonly provider: string;
  readonly providerReference: string | null;
  readonly failureReason: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface Ticket {
  readonly id: string;
  readonly passengerId: string;
  readonly number: string;
  readonly state: TicketState;
  readonly issuedAt: string | null;
  /** True for anything not issued by a real airline. Always shown to the traveller. */
  readonly simulated: boolean;
}

export interface BookingEvent {
  readonly at: string;
  readonly state: BookingState;
  readonly note: string;
  /** 'system' or a user id; support actions are attributed in Phase 7. */
  readonly actor: string;
}

export interface Booking {
  readonly id: string;
  /** Short, opaque, non-sequential reference shown to the traveller. */
  readonly reference: string;
  readonly userId: string;
  readonly state: BookingState;
  readonly currency: CurrencyCode;
  readonly total: Money;
  readonly passengers: readonly BookingPassenger[];
  readonly contact: BookingContact;
  readonly snapshot: BookingSnapshot;
  readonly payment: PaymentAttempt | null;
  readonly tickets: readonly Ticket[];
  readonly history: readonly BookingEvent[];
  readonly simulated: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}
