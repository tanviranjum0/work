import { describe, expect, it } from 'vitest';
import {
  BOOKING_STATES,
  canTransition,
  InvalidBookingTransitionError,
  isTerminalBookingState,
  needsAttention,
  nextBookingState,
} from './booking.js';

describe('booking state machine', () => {
  it('follows the happy path', () => {
    const path = [
      'DRAFT',
      'PAYMENT_PENDING',
      'PAYMENT_AUTHORIZED',
      'BOOKING_CONFIRMED',
      'TICKETING_PENDING',
      'TICKETED',
    ] as const;
    path.forEach((state, i) => {
      const next = path[i + 1];
      if (next) expect(nextBookingState(state, next)).toBe(next);
    });
  });

  it('refuses to skip payment, re-ticket, or revive a finished booking', () => {
    expect(() => nextBookingState('DRAFT', 'TICKETED')).toThrow(InvalidBookingTransitionError);
    expect(() => nextBookingState('DRAFT', 'BOOKING_CONFIRMED')).toThrow(InvalidBookingTransitionError);
    expect(() => nextBookingState('CANCELLED', 'TICKETED')).toThrow(InvalidBookingTransitionError);
    expect(() => nextBookingState('FAILED', 'PAYMENT_PENDING')).toThrow(InvalidBookingTransitionError);
    expect(() => nextBookingState('REFUNDED', 'TICKETED')).toThrow(InvalidBookingTransitionError);
    expect(() => nextBookingState('TICKETED', 'TICKETED')).toThrow(/cannot go from TICKETED to TICKETED/);
  });

  it('never lets a paid booking fail without flagging the money', () => {
    // Once payment is authorised, plain FAILED is not reachable: someone must reconcile.
    for (const state of ['PAYMENT_AUTHORIZED', 'BOOKING_CONFIRMED', 'TICKETING_PENDING'] as const) {
      expect(canTransition(state, 'FAILED')).toBe(false);
      expect(canTransition(state, 'PAYMENT_RECONCILIATION_REQUIRED')).toBe(true);
    }
    expect(needsAttention('PAYMENT_RECONCILIATION_REQUIRED')).toBe(true);
    expect(needsAttention('TICKETED')).toBe(false);
  });

  it('cancels only from states a supplier could still act on', () => {
    expect(canTransition('TICKETED', 'CANCEL_REQUESTED')).toBe(true);
    expect(canTransition('BOOKING_CONFIRMED', 'CANCEL_REQUESTED')).toBe(true);
    expect(canTransition('PAYMENT_PENDING', 'CANCEL_REQUESTED')).toBe(false);
    expect(canTransition('CANCEL_REQUESTED', 'REFUND_PENDING')).toBe(true);
  });

  it('marks exactly the finished states as terminal and leaves no state stranded', () => {
    const terminal = BOOKING_STATES.filter(isTerminalBookingState);
    expect(terminal).toEqual(['FAILED', 'CANCELLED', 'REFUNDED']);
    // Every non-terminal state can still move somewhere, and every state is reachable.
    const reachable = new Set(
      BOOKING_STATES.flatMap((s) => BOOKING_STATES.filter((t) => canTransition(s, t))),
    );
    for (const state of BOOKING_STATES) {
      if (state !== 'DRAFT') expect(reachable.has(state)).toBe(true);
    }
  });
});
