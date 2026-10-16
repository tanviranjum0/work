import type { BookingProvider, CreateBookingRequest, CreateBookingResult } from './booking-provider.js';

/**
 * Simulated reservations. Nothing is sent to an airline and no seat is held.
 * A passenger surname containing "soldout" makes the supplier refuse, so the
 * recovery path can be demonstrated.
 */
export class MockBookingProvider implements BookingProvider {
  readonly id = 'mock';
  readonly simulated = true;
  private readonly seen = new Map<string, CreateBookingResult>();
  private readonly cancelled = new Set<string>();

  async createBooking(request: CreateBookingRequest): Promise<CreateBookingResult> {
    const previous = this.seen.get(request.idempotencyKey);
    if (previous) return previous;

    const soldOut = request.passengers.some((p) => p.familyName.toLowerCase().includes('soldout'));
    const result: CreateBookingResult = soldOut
      ? { kind: 'unavailable', reason: 'sold_out' }
      : { kind: 'confirmed', supplierReference: `DEMO${request.idempotencyKey.slice(0, 6).toUpperCase()}` };
    this.seen.set(request.idempotencyKey, result);
    return result;
  }

  async cancelBooking(supplierReference: string): Promise<{ kind: 'cancelled' | 'not_allowed' }> {
    this.cancelled.add(supplierReference);
    return { kind: 'cancelled' };
  }
}
