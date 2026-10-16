import {
  addDays,
  compareCalendarDates,
  MAX_ADVANCE_BOOKING_DAYS,
  todayInTimeZone,
  type CalendarDate,
  type FlexibleDateCell,
  type FlexibleDatesResponse,
  type FlightSearchInput,
} from '@aeronova/shared';
import type { Logger } from 'pino';
import type { FlightProvider } from '../../providers/flight/flight-provider.js';
import type { AirportDirectory } from '../airport-directory.js';
import type { FlightSearchService } from './flight-search-service.js';

export const FLEXIBLE_DATE_RADIUS = 3;
const CONCURRENCY = 3;

export interface FlexibleDatesServiceOptions {
  readonly provider: FlightProvider;
  readonly search: FlightSearchService;
  readonly directory: AirportDirectory;
  readonly logger: Logger;
  readonly now?: () => Date;
}

const shift = (input: FlightSearchInput, days: number): FlightSearchInput =>
  ({
    ...input,
    journeys: input.journeys.map((j) => ({ ...j, departureDate: addDays(j.departureDate, days) })),
  }) as FlightSearchInput;

/**
 * Lowest fares for the same trip moved ±3 days (every journey moves together,
 * so trip length is preserved). Built on FlightSearchService, so each date
 * benefits from the search cache and in-flight de-duplication.
 */
export class FlexibleDatesService {
  constructor(private readonly o: FlexibleDatesServiceOptions) {}

  async lowestFares(input: FlightSearchInput, requestId: string): Promise<FlexibleDatesResponse> {
    const base = { currency: input.currency, dataOrigin: null };
    if (!this.o.provider.capabilities.flexibleDates) {
      return { ...base, supported: false, cells: [] };
    }
    const origin = this.o.directory.resolveLocation(input.journeys[0].origin)[0];
    const today = todayInTimeZone(origin?.timeZone ?? 'Etc/GMT+12', this.o.now?.() ?? new Date());
    const latest = addDays(today, MAX_ADVANCE_BOOKING_DAYS);

    const offsets = Array.from({ length: FLEXIBLE_DATE_RADIUS * 2 + 1 }, (_, i) => i - FLEXIBLE_DATE_RADIUS);
    const cells: FlexibleDateCell[] = new Array(offsets.length);
    let dataOrigin: FlexibleDatesResponse['dataOrigin'] = null;

    const work = offsets.map((offset, index) => async () => {
      const shifted = shift(input, offset);
      const departureDates = shifted.journeys.map((j) => j.departureDate);
      const dates = departureDates as CalendarDate[];
      if (dates.some((d) => compareCalendarDates(d, today) < 0 || compareCalendarDates(d, latest) > 0)) {
        cells[index] = { offsetDays: offset, departureDates, status: 'out_of_range', lowestTotal: null };
        return;
      }
      try {
        const res = await this.o.search.search(shifted, requestId);
        dataOrigin = res.dataOrigin;
        const lowest = res.offers.reduce<number | null>(
          (min, r) =>
            min === null
              ? r.offer.price.customerTotal.amountMinor
              : Math.min(min, r.offer.price.customerTotal.amountMinor),
          null,
        );
        cells[index] = {
          offsetDays: offset,
          departureDates,
          status: lowest === null ? 'no_flights' : 'ok',
          lowestTotal: lowest === null ? null : { amountMinor: lowest, currency: res.currency },
        };
      } catch (err) {
        // One failed date must not hide the others.
        this.o.logger.warn({ offset, err }, 'flexible date search failed');
        cells[index] = { offsetDays: offset, departureDates, status: 'unavailable', lowestTotal: null };
      }
    });

    const queue = [...work];
    await Promise.all(
      Array.from({ length: CONCURRENCY }, async () => {
        for (let job = queue.shift(); job; job = queue.shift()) await job();
      }),
    );
    return { ...base, dataOrigin, supported: true, cells };
  }
}
