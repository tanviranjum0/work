import { z } from 'zod';
import { compareCalendarDates, isCalendarDate, type CalendarDate } from '../dates/calendar-date.js';
import { ACCOUNT_LIMITS, GENDERS, SAVED_SEARCH_PARAM_KEYS, TRAVELER_TITLES } from '../domain/account.js';
import { cabinClassSchema, currencySchema } from './common.js';

/**
 * Letters (any script), combining marks, spaces, hyphens and apostrophes.
 * Suppliers apply stricter transliteration rules at booking; this only keeps
 * obviously invalid input out of storage.
 */
const personName = z
  .string()
  .trim()
  .min(1, { error: 'Required.' })
  .max(40, { error: 'Use 40 characters or fewer.' })
  .regex(/^\p{L}[\p{L}\p{M}' -]*$/u, { error: 'Use letters, spaces, hyphens or apostrophes.' });

const airlineCode = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z0-9]{2}$/, { error: 'Use a 2-character airline code, e.g. EK.' });

export const loyaltyAccountSchema = z.strictObject({
  airlineCode,
  number: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9]{1,25}$/, { error: 'Use up to 25 letters or digits.' }),
});

/** Built per request so "not in the future" uses a real clock, like the search schema. */
export const createTravelerInputSchema = (opts: { today: CalendarDate }) =>
  z.strictObject({
    title: z.enum(TRAVELER_TITLES).nullable().default(null),
    givenName: personName,
    middleName: personName.nullable().default(null),
    familyName: personName,
    dateOfBirth: z
      .string()
      .refine(isCalendarDate, { error: 'Use a real date in YYYY-MM-DD format.' })
      .refine((d) => compareCalendarDates(d as CalendarDate, opts.today) <= 0, {
        error: 'Date of birth is in the future.',
      })
      .refine((d) => Number(d.slice(0, 4)) >= Number(opts.today.slice(0, 4)) - 120, {
        error: 'Check the year of birth.',
      }),
    gender: z.enum(GENDERS).nullable().default(null),
    nationality: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^[A-Z]{2}$/, { error: 'Use a 2-letter country code, e.g. BD.' })
      .nullable()
      .default(null),
    loyaltyAccounts: z.array(loyaltyAccountSchema).max(ACCOUNT_LIMITS.loyaltyAccountsPerTraveler).default([]),
  });

export type TravelerInput = z.output<ReturnType<typeof createTravelerInputSchema>>;

export const updateProfileSchema = z
  .strictObject({
    displayName: z.string().trim().min(1).max(60).optional(),
    preferences: z
      .strictObject({
        currency: currencySchema.optional(),
        cabin: cabinClassSchema.optional(),
        locale: z.literal('en').optional(),
        maxStops: z.union([z.literal(0), z.literal(1), z.literal(2), z.null()]).optional(),
        preferredAirlines: z.array(airlineCode).max(ACCOUNT_LIMITS.preferredAirlines).optional(),
      })
      .optional(),
  })
  .refine((v) => v.displayName !== undefined || v.preferences !== undefined, { error: 'Nothing to update.' });

export type UpdateProfileInput = z.output<typeof updateProfileSchema>;

const paramValue = z
  .string()
  .max(160)
  .regex(/^[A-Za-z0-9.~,:-]*$/, { error: 'Unexpected characters in search.' });

export const savedSearchInputSchema = z.strictObject({
  label: z.string().trim().min(1).max(60),
  params: z
    .partialRecord(z.enum(SAVED_SEARCH_PARAM_KEYS), paramValue)
    .refine((p) => Boolean(p.trip), { error: 'Missing trip type.' }),
});

export type SavedSearchInput = z.output<typeof savedSearchInputSchema>;
