import type { Booking, BookingState } from '@aeronova/shared';
import type { BookingRepository, IdempotencyRecord, IdempotencyStore } from './booking-types.js';

export class InMemoryBookingRepository implements BookingRepository {
  private readonly byId = new Map<string, Booking>();

  async create(booking: Booking) {
    this.byId.set(booking.id, booking);
    return booking;
  }
  async findByReference(userId: string, reference: string) {
    return [...this.byId.values()].find((b) => b.userId === userId && b.reference === reference);
  }
  async findById(bookingId: string) {
    return this.byId.get(bookingId);
  }
  async listByUser(userId: string, opts: { limit?: number } = {}) {
    const all = [...this.byId.values()]
      .filter((b) => b.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return opts.limit ? all.slice(0, opts.limit) : all;
  }
  async update(bookingId: string, patch: Partial<Booking> & { state: BookingState }) {
    const current = this.byId.get(bookingId);
    if (!current) return undefined;
    const next: Booking = { ...current, ...patch, updatedAt: new Date().toISOString() };
    this.byId.set(bookingId, next);
    return next;
  }
  async findByReferenceAny(reference: string) {
    return [...this.byId.values()].find((b) => b.reference === reference);
  }
  async listAll(opts: { limit: number; state?: BookingState }) {
    const all = [...this.byId.values()]
      .filter((b) => (opts.state ? b.state === opts.state : true))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return all.slice(0, opts.limit);
  }
}

export class InMemoryIdempotencyStore implements IdempotencyStore {
  private readonly records = new Map<string, IdempotencyRecord>();

  async claim(record: Omit<IdempotencyRecord, 'createdAt' | 'status' | 'bookingId'>) {
    const existing = this.records.get(record.key);
    if (existing) return { kind: 'existing' as const, record: existing };
    this.records.set(record.key, {
      ...record,
      status: 'in_progress',
      bookingId: null,
      createdAt: new Date().toISOString(),
    });
    return { kind: 'claimed' as const };
  }
  async complete(key: string, bookingId: string) {
    const existing = this.records.get(key);
    if (existing) this.records.set(key, { ...existing, status: 'completed', bookingId });
  }
  async release(key: string) {
    this.records.delete(key);
  }
}
