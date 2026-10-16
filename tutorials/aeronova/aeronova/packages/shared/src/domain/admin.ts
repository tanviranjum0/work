import type { BookingState } from './booking.js';
import type { AppMode } from '../app-mode.js';
import type { CurrencyCode } from '../money/currency.js';

export interface AdminMetrics {
  readonly totalUsers: number;
  readonly totalBookings: number;
  readonly bookingsByState: Partial<Record<BookingState, number>>;
  /** Minor units per currency — never summed across currencies into one misleading total. */
  readonly bookingTotalsByCurrency: Partial<Record<CurrencyCode, number>>;
}

export interface AdminProviderStatus {
  readonly appMode: AppMode;
  readonly flightProvider: string;
  readonly bookingProvider: string;
  readonly paymentProvider: string;
  readonly ticketingProvider: string;
  readonly authProvider: 'dev';
}
