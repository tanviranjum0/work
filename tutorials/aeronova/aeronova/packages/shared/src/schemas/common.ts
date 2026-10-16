import { z } from 'zod';
import { isCalendarDate, type CalendarDate } from '../dates/calendar-date.js';
import { CURRENCY_CODES } from '../money/currency.js';
import { CABIN_CLASSES } from '../domain/flight.js';

export const iataAirportCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{3}$/, { error: 'Use a 3-letter airport code, e.g. DAC.' });

export const calendarDateSchema = z
  .string()
  .refine(isCalendarDate, { error: 'Use a real date in YYYY-MM-DD format.' })
  .transform((v) => v as CalendarDate);

export const currencySchema = z.enum(CURRENCY_CODES);
export const cabinClassSchema = z.enum(CABIN_CLASSES);
