import { randomUUID } from 'node:crypto';
import {
  ERROR_CODES,
  nextBookingState,
  type Booking,
  type BookingEvent,
  type BookingPassenger,
  type BookingState,
  type CreateBookingInput,
  type PaymentAttempt,
  type PricedQuote,
} from '@aeronova/shared';
import type { Logger } from 'pino';
import { AppError, NotFoundError } from '../../errors/app-error.js';
import type { BookingProvider } from '../../providers/booking/booking-provider.js';
import type { PaymentProvider } from '../../providers/payment/payment-provider.js';
import type { TicketingProvider } from '../../providers/ticketing/ticketing-provider.js';
import type { BookingRepository, IdempotencyStore } from '../../repositories/booking-types.js';
import type { QuoteStore } from '../pricing/quote-store.js';
import { shortHash } from '../../utils/hash.js';

/** Unambiguous characters only: no O/0 or I/1 confusion when read aloud. */
const REFERENCE_ALPHABET = 'ACDEFGHJKLMNPQRTUVWXY2346789';

export const generateReference = (random: () => number = Math.random): string =>
  Array.from(
    { length: 6 },
    () => REFERENCE_ALPHABET[Math.floor(random() * REFERENCE_ALPHABET.length)] ?? 'A',
  ).join('');

export interface BookingServiceOptions {
  readonly quotes: QuoteStore;
  readonly bookings: BookingRepository;
  readonly idempotency: IdempotencyStore;
  readonly booking: BookingProvider;
  readonly payment: PaymentProvider;
  readonly ticketing: TicketingProvider;
  readonly logger: Logger;
  readonly now?: () => Date;
  readonly random?: () => number;
}

const expired = () =>
  new AppError(
    ERROR_CODES.OFFER_EXPIRED,
    410,
    'This price is no longer held. Check the price again to continue.',
  );

/**
 * Turns a checked price into a booking.
 *
 * The order is deliberate: take payment only after the price is confirmed, and
 * create the reservation only after payment succeeds. Anything that fails once
 * money has moved ends in PAYMENT_RECONCILIATION_REQUIRED rather than a quiet
 * failure, because the traveller has paid and someone must resolve it.
 */
export class BookingService {
  constructor(private readonly o: BookingServiceOptions) {}

  private at() {
    return (this.o.now?.() ?? new Date()).toISOString();
  }

  private event(state: BookingState, note: string, actor = 'system'): BookingEvent {
    return { at: this.at(), state, note, actor };
  }

  async create(
    input: CreateBookingInput,
    ctx: { userId: string; idempotencyKey: string; requestId: string },
  ): Promise<Booking> {
    const requestHash = shortHash(JSON.stringify(input));
    const claim = await this.o.idempotency.claim({
      key: ctx.idempotencyKey,
      userId: ctx.userId,
      operation: 'create_booking',
      requestHash,
    });

    if (claim.kind === 'existing') {
      const record = claim.record;
      if (record.userId !== ctx.userId || record.requestHash !== requestHash) {
        throw new AppError(
          ERROR_CODES.IDEMPOTENCY_CONFLICT,
          409,
          'This request was already used for a different booking. Start again to book something else.',
        );
      }
      if (record.status === 'in_progress') {
        throw new AppError(ERROR_CODES.IDEMPOTENCY_CONFLICT, 409, 'This booking is already being processed.');
      }
      const existing = record.bookingId ? await this.o.bookings.findById(record.bookingId) : undefined;
      if (existing) return existing;
    }

    try {
      return await this.book(input, ctx);
    } catch (err) {
      // A failed attempt must not block a genuine retry with the same details —
      // but only this call's own claim may be released, never an in-flight one.
      if (claim.kind === 'claimed') await this.o.idempotency.release(ctx.idempotencyKey);
      throw err;
    }
  }

  private async book(
    input: CreateBookingInput,
    ctx: { userId: string; idempotencyKey: string; requestId: string },
  ): Promise<Booking> {
    const stored = await this.o.quotes.get(input.quoteId);
    if (!stored) throw expired();
    const quote: PricedQuote = stored.quote;
    if (Date.parse(quote.expiresAt) <= Date.parse(this.at())) throw expired();

    const passengers: BookingPassenger[] = input.passengers.map((p) => ({ ...p, id: randomUUID() }));
    const seatedCount = passengers.filter((p) => p.type !== 'infant').length;
    if (seatedCount === 0) {
      throw new AppError(ERROR_CODES.VALIDATION_ERROR, 400, 'At least one traveller must occupy a seat.');
    }

    const simulated = this.o.booking.simulated || this.o.ticketing.simulated || this.o.payment.simulated;
    let booking: Booking = await this.o.bookings.create({
      id: randomUUID(),
      reference: generateReference(this.o.random),
      userId: ctx.userId,
      state: 'DRAFT',
      currency: quote.offer.price.currency,
      total: quote.offer.price.customerTotal,
      passengers,
      contact: input.contact,
      snapshot: { offer: quote.offer, capturedAt: this.at(), dataOrigin: quote.dataOrigin },
      payment: null,
      tickets: [],
      history: [this.event('DRAFT', 'Booking started from a checked price.')],
      simulated,
      createdAt: this.at(),
      updatedAt: this.at(),
    });

    const advance = async (
      state: BookingState,
      note: string,
      patch: Partial<Booking> = {},
    ): Promise<Booking> => {
      const next = nextBookingState(booking.state, state);
      const updated = await this.o.bookings.update(booking.id, {
        ...patch,
        state: next,
        history: [...booking.history, this.event(next, note)],
      });
      if (!updated) throw new NotFoundError('Booking not found.');
      booking = updated;
      return updated;
    };

    // 1. Payment.
    await advance('PAYMENT_PENDING', 'Taking payment.');
    const paymentBase: PaymentAttempt = {
      id: randomUUID(),
      state: 'INITIATED',
      amount: booking.total,
      provider: this.o.payment.id,
      providerReference: null,
      failureReason: null,
      createdAt: this.at(),
      updatedAt: this.at(),
    };
    let payment: PaymentAttempt;
    try {
      const result = await this.o.payment.authorize({
        amount: booking.total,
        reference: booking.reference,
        idempotencyKey: `${ctx.idempotencyKey}:payment`,
        holderName: input.payment.holderName,
      });
      if (result.kind === 'declined') {
        payment = { ...paymentBase, state: 'FAILED', failureReason: result.reason, updatedAt: this.at() };
        await advance('FAILED', 'Payment was declined.', { payment });
        throw new AppError(ERROR_CODES.PAYMENT_FAILED, 402, result.reason);
      }
      payment = {
        ...paymentBase,
        state: 'AUTHORIZED',
        providerReference: result.providerReference,
        updatedAt: this.at(),
      };
    } catch (err) {
      if (err instanceof AppError) throw err;
      await advance('FAILED', 'Payment could not be processed.', {
        payment: { ...paymentBase, state: 'FAILED', failureReason: 'provider_error', updatedAt: this.at() },
      });
      this.o.logger.error({ err, bookingId: booking.id }, 'payment provider failed');
      throw new AppError(
        ERROR_CODES.PAYMENT_FAILED,
        502,
        "We couldn't process the payment. No money has been taken.",
      );
    }
    await advance('PAYMENT_AUTHORIZED', 'Payment authorised.', { payment });

    // 2. Reservation with the supplier. Money has moved: failures need reconciling.
    const reconcile = async (note: string, cause: unknown): Promise<never> => {
      await advance('PAYMENT_RECONCILIATION_REQUIRED', note);
      this.o.logger.error(
        { bookingId: booking.id, reference: booking.reference, requestId: ctx.requestId, err: cause },
        'payment taken without a completed booking',
      );
      throw new AppError(
        ERROR_CODES.BOOKING_FAILED,
        502,
        'Your payment went through but the airline did not confirm the booking. Our team is looking into it; quote your reference and we will refund or complete it.',
        { context: { bookingReference: booking.reference } },
      );
    };

    // The call is wrapped, the decision is not: reconcile() throws, and must not
    // be caught by this try and run a second time.
    const reservation = await this.o.booking
      .createBooking({
        offerRef: stored.ref,
        offer: quote.offer,
        passengers,
        contact: input.contact,
        idempotencyKey: `${ctx.idempotencyKey}:booking`,
      })
      .catch((err: unknown) => ({ kind: 'error' as const, err }));

    if (reservation.kind === 'error') {
      return await reconcile('The airline did not respond when confirming the booking.', reservation.err);
    }
    if (reservation.kind === 'unavailable') {
      return await reconcile(
        `The airline could not hold these seats (${reservation.reason}).`,
        reservation.reason,
      );
    }
    const supplierReference = reservation.supplierReference;
    await advance('BOOKING_CONFIRMED', `Airline confirmed the reservation (${supplierReference}).`);

    // 3. Ticketing.
    await advance('TICKETING_PENDING', 'Issuing tickets.');
    const issued = await this.o.ticketing
      .issueTickets({
        supplierReference,
        passengers,
        validatingCarrier:
          quote.offer.validatingCarrier.status === 'provided'
            ? quote.offer.validatingCarrier.value.code
            : null,
        idempotencyKey: `${ctx.idempotencyKey}:ticketing`,
      })
      .catch((err: unknown) => ({ kind: 'error' as const, err }));

    if (issued.kind === 'error') return await reconcile('Ticketing did not complete.', issued.err);
    if (issued.kind === 'failed') {
      return await reconcile('Tickets could not be issued for this booking.', issued.reason);
    }
    await advance('TICKETED', 'Tickets issued.', {
      tickets: issued.tickets,
      payment: { ...payment, state: 'CAPTURED', updatedAt: this.at() },
    });

    await this.o.idempotency.complete(ctx.idempotencyKey, booking.id);
    this.o.logger.info(
      {
        event: 'BOOKING_TICKETED',
        bookingId: booking.id,
        simulated: booking.simulated,
        requestId: ctx.requestId,
      },
      'booking completed',
    );
    return booking;
  }

  /**
   * Trips as the traveller sees them. A booking that failed before anything was
   * reserved is kept for support but is not a trip, so it is left out here.
   * Anything needing reconciliation is included: they paid, and must see it.
   */
  async list(userId: string, limit = 50): Promise<Booking[]> {
    const all = await this.o.bookings.listByUser(userId, { limit });
    return all.filter((b) => b.state !== 'FAILED');
  }

  async get(userId: string, reference: string): Promise<Booking> {
    const booking = await this.o.bookings.findByReference(userId, reference.toUpperCase());
    if (!booking) throw new NotFoundError('We could not find that booking.');
    return booking;
  }

  /** Admin only: the route layer enforces the ADMIN role before calling either of these. */
  async adminList(opts: { limit: number; state?: BookingState }): Promise<Booking[]> {
    return this.o.bookings.listAll(opts);
  }

  async adminGet(reference: string): Promise<Booking> {
    const booking = await this.o.bookings.findByReferenceAny(reference.toUpperCase());
    if (!booking) throw new NotFoundError('We could not find that booking.');
    return booking;
  }

  /** Cancellation asks the supplier first; the refund itself is a separate step. */
  async cancel(userId: string, reference: string): Promise<Booking> {
    const booking = await this.get(userId, reference);
    let state: BookingState;
    try {
      state = nextBookingState(booking.state, 'CANCEL_REQUESTED');
    } catch {
      throw new AppError(
        ERROR_CODES.INVALID_STATE_TRANSITION,
        409,
        'This booking can no longer be cancelled here. Contact support with your reference.',
      );
    }
    const requested = await this.o.bookings.update(booking.id, {
      state,
      history: [...booking.history, this.event(state, 'Cancellation requested by the traveller.', userId)],
    });
    if (!requested) throw new NotFoundError('Booking not found.');

    const result = await this.o.booking.cancelBooking(booking.reference);
    if (result.kind === 'not_allowed') {
      const restored = await this.o.bookings.update(booking.id, {
        state: nextBookingState(requested.state, 'TICKETED'),
        history: [...requested.history, this.event('TICKETED', 'The airline refused the cancellation.')],
      });
      throw new AppError(
        ERROR_CODES.INVALID_STATE_TRANSITION,
        409,
        restored
          ? 'The airline would not cancel this booking. Contact support with your reference.'
          : 'The airline would not cancel this booking.',
      );
    }
    const refundable = booking.payment?.state === 'CAPTURED' || booking.payment?.state === 'AUTHORIZED';
    const finalState = nextBookingState(requested.state, refundable ? 'REFUND_PENDING' : 'CANCELLED');
    const updated = await this.o.bookings.update(booking.id, {
      state: finalState,
      history: [
        ...requested.history,
        this.event(finalState, refundable ? 'Cancelled. A refund is being processed.' : 'Cancelled.'),
      ],
    });
    if (!updated) throw new NotFoundError('Booking not found.');
    return updated;
  }
}
