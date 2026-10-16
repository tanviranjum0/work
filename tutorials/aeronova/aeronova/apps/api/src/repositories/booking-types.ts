import type { Booking, BookingState } from '@aeronova/shared';

export interface BookingRepository {
  create(booking: Booking): Promise<Booking>;
  /** Scoped by user: a guessed reference never reveals someone else's trip. */
  findByReference(userId: string, reference: string): Promise<Booking | undefined>;
  findById(bookingId: string): Promise<Booking | undefined>;
  listByUser(userId: string, opts?: { limit?: number }): Promise<Booking[]>;
  update(bookingId: string, patch: Partial<Booking> & { state: BookingState }): Promise<Booking | undefined>;
  /** Admin only: not scoped by owner. Callers must enforce the role check themselves. */
  findByReferenceAny(reference: string): Promise<Booking | undefined>;
  /** Admin only: every user's bookings, newest first, optionally narrowed to one state. */
  listAll(opts: { limit: number; state?: BookingState }): Promise<Booking[]>;
}

/**
 * Remembers the outcome of a request so a retry (or a double-click) returns
 * the first answer instead of doing the work twice.
 */
export interface IdempotencyRecord {
  readonly key: string;
  readonly userId: string;
  readonly operation: string;
  /** Hash of the request body: the same key with a different payload is a conflict. */
  readonly requestHash: string;
  readonly status: 'in_progress' | 'completed';
  readonly bookingId: string | null;
  readonly createdAt: string;
}

export interface IdempotencyStore {
  /** Claims the key, or returns the existing record if it was already claimed. */
  claim(
    record: Omit<IdempotencyRecord, 'createdAt' | 'status' | 'bookingId'>,
  ): Promise<
    { readonly kind: 'claimed' } | { readonly kind: 'existing'; readonly record: IdempotencyRecord }
  >;
  complete(key: string, bookingId: string): Promise<void>;
  release(key: string): Promise<void>;
}
