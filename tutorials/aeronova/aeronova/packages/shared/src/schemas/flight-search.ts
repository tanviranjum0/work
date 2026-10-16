import { z } from 'zod';
import { addDays, compareCalendarDates, type CalendarDate } from '../dates/calendar-date.js';
import { cabinClassSchema, calendarDateSchema, currencySchema, iataAirportCodeSchema } from './common.js';

import {
  MAX_ADVANCE_BOOKING_DAYS,
  MAX_MULTI_CITY_JOURNEYS,
  MAX_PASSENGERS_PER_BOOKING,
} from '../domain/search-limits.js';

export const passengerCountsSchema = z
  .strictObject({
    adults: z
      .number()
      .int()
      .min(1, { error: 'At least one adult is required.' })
      .max(MAX_PASSENGERS_PER_BOOKING),
    children: z.number().int().min(0).max(MAX_PASSENGERS_PER_BOOKING),
    infants: z.number().int().min(0).max(MAX_PASSENGERS_PER_BOOKING),
  })
  .superRefine((p, ctx) => {
    if (p.infants > p.adults) {
      ctx.addIssue({ code: 'custom', path: ['infants'], message: 'Each infant must travel with an adult.' });
    }
    if (p.adults + p.children + p.infants > MAX_PASSENGERS_PER_BOOKING) {
      ctx.addIssue({
        code: 'custom',
        path: ['adults'],
        message: `A single booking can include up to ${MAX_PASSENGERS_PER_BOOKING} travellers.`,
      });
    }
  });

const journeyRequestSchema = z.strictObject({
  origin: iataAirportCodeSchema,
  destination: iataAirportCodeSchema,
  departureDate: calendarDateSchema,
});

const baseFields = {
  passengers: passengerCountsSchema,
  cabin: cabinClassSchema,
  currency: currencySchema.default('USD'),
  directOnly: z.boolean().default(false),
};

const rawSearchSchema = z.discriminatedUnion('tripType', [
  z.strictObject({
    tripType: z.literal('one_way'),
    journeys: z.tuple([journeyRequestSchema]),
    ...baseFields,
  }),
  z.strictObject({
    tripType: z.literal('round_trip'),
    journeys: z.tuple([journeyRequestSchema, journeyRequestSchema]),
    ...baseFields,
  }),
  z.strictObject({
    tripType: z.literal('multi_city'),
    journeys: z.array(journeyRequestSchema).min(2).max(MAX_MULTI_CITY_JOURNEYS),
    ...baseFields,
  }),
]);

/**
 * Date rules depend on "today", so the schema is built per request with an
 * injected clock. That keeps validation pure and deterministic under test.
 */
export const createFlightSearchInputSchema = (opts: { today: CalendarDate }) =>
  rawSearchSchema.superRefine((input, ctx) => {
    const latest = addDays(opts.today, MAX_ADVANCE_BOOKING_DAYS);
    input.journeys.forEach((j, i) => {
      if (j.origin === j.destination) {
        ctx.addIssue({
          code: 'custom',
          path: ['journeys', i, 'destination'],
          message: 'Choose a destination different from the origin.',
        });
      }
      if (compareCalendarDates(j.departureDate, opts.today) < 0) {
        ctx.addIssue({
          code: 'custom',
          path: ['journeys', i, 'departureDate'],
          message: 'This date has passed.',
        });
      }
      if (compareCalendarDates(j.departureDate, latest) > 0) {
        ctx.addIssue({
          code: 'custom',
          path: ['journeys', i, 'departureDate'],
          message: 'Airlines publish fares up to about a year ahead. Choose an earlier date.',
        });
      }
      const prev = input.journeys[i - 1];
      if (prev && compareCalendarDates(j.departureDate, prev.departureDate) < 0) {
        ctx.addIssue({
          code: 'custom',
          path: ['journeys', i, 'departureDate'],
          message:
            input.tripType === 'round_trip'
              ? 'Return must be on or after the departure date.'
              : 'Each flight must depart on or after the previous one.',
        });
      }
    });
    if (input.tripType === 'round_trip') {
      const [out, ret] = input.journeys;
      if (ret.origin !== out.destination || ret.destination !== out.origin) {
        ctx.addIssue({
          code: 'custom',
          path: ['journeys', 1],
          message: 'A round trip returns along the same route. Use multi-city for open-jaw trips.',
        });
      }
    }
  });

export type FlightSearchInput = z.output<typeof rawSearchSchema>;
export type FlightSearchInputDraft = z.input<typeof rawSearchSchema>;
export type PassengerCounts = z.output<typeof passengerCountsSchema>;
