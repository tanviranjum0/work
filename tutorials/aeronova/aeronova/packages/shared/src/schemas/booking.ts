import { z } from 'zod';
import { compareCalendarDates, isCalendarDate, type CalendarDate } from '../dates/calendar-date.js';
import { GENDERS, TRAVELER_TITLES } from '../domain/account.js';
import { MAX_PASSENGERS_PER_BOOKING } from '../domain/search-limits.js';

const personName = z
  .string()
  .trim()
  .min(1, { error: 'Required.' })
  .max(40, { error: 'Use 40 characters or fewer.' })
  .regex(/^\p{L}[\p{L}\p{M}' -]*$/u, { error: 'Use letters, spaces, hyphens or apostrophes.' });

const countryCode = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{2}$/, { error: 'Use a 2-letter country code, e.g. BD.' });

const calendarDate = z.string().refine(isCalendarDate, { error: 'Use a real date in YYYY-MM-DD format.' });

/**
 * Traveller details for a booking. Names must match the travel document, so
 * the rules are stricter than a saved traveller's: this is what the airline
 * receives.
 */
export const createBookingInputSchema = (opts: { today: CalendarDate }) => {
  const passenger = z.strictObject({
    type: z.enum(['adult', 'child', 'infant']),
    title: z.enum(TRAVELER_TITLES).nullable().default(null),
    givenName: personName,
    middleName: personName.nullable().default(null),
    familyName: personName,
    dateOfBirth: calendarDate.refine((d) => compareCalendarDates(d as CalendarDate, opts.today) <= 0, {
      error: 'Date of birth is in the future.',
    }),
    gender: z.enum(GENDERS).nullable().default(null),
    nationality: countryCode.nullable().default(null),
    travelDocument: z
      .strictObject({
        type: z.literal('passport'),
        number: z
          .string()
          .trim()
          .toUpperCase()
          .regex(/^[A-Z0-9]{5,15}$/, { error: 'Check the passport number.' }),
        issuingCountry: countryCode,
        expiryDate: calendarDate.refine((d) => compareCalendarDates(d as CalendarDate, opts.today) > 0, {
          error: 'This passport has expired.',
        }),
      })
      .nullable()
      .default(null),
    loyaltyNumber: z
      .string()
      .trim()
      .regex(/^[A-Za-z0-9]{1,25}$/)
      .nullable()
      .default(null),
  });

  return z
    .strictObject({
      /** The quote being bought: proves the price was checked, and when. */
      quoteId: z.string().min(1),
      passengers: z.array(passenger).min(1).max(MAX_PASSENGERS_PER_BOOKING),
      contact: z.strictObject({
        email: z
          .string()
          .trim()
          .max(254)
          .pipe(z.email({ error: 'Enter a valid email address.' })),
        phone: z
          .string()
          .trim()
          .regex(/^\+?[0-9 ()-]{6,20}$/, { error: 'Enter a phone number we can reach you on.' }),
      }),
      /** Simulated payment details; a real provider would receive a token instead. */
      payment: z.strictObject({ method: z.literal('demo_card'), holderName: personName }),
      acceptedTerms: z.literal(true, { error: 'Please confirm you accept the fare conditions.' }),
    })
    .superRefine((input, ctx) => {
      const adults = input.passengers.filter((p) => p.type === 'adult').length;
      const infants = input.passengers.filter((p) => p.type === 'infant').length;
      if (adults === 0) {
        ctx.addIssue({ code: 'custom', path: ['passengers'], message: 'At least one adult must travel.' });
      }
      if (infants > adults) {
        ctx.addIssue({
          code: 'custom',
          path: ['passengers'],
          message: 'Each infant must travel with an adult.',
        });
      }
    });
};

export type CreateBookingInput = z.output<ReturnType<typeof createBookingInputSchema>>;
export type BookingPassengerInput = CreateBookingInput['passengers'][number];
