import { createFlightSearchInputSchema, todayInTimeZone } from '@aeronova/shared';
import { toApiInput, type SearchDraft } from './search-url';

/*
 * Kept in its own module because it pulls in the validation library: the
 * landing page loads it on first interaction instead of on first paint.
 */

/**
 * Client-side pre-check with the same schema as the server. "Today" is the
 * earliest calendar day on Earth, so the browser never rejects a date that is
 * still valid at the departure airport; the server applies the exact rule.
 */
const REQUIRED = {
  origin: 'Choose where you are flying from.',
  destination: 'Choose where you are flying to.',
  departureDate: 'Choose a departure date.',
  returnDate: 'Choose a return date.',
} as const;

export const validateDraft = (d: SearchDraft, now = new Date()) => {
  const errors: Record<string, string> = {};

  // Empty fields get a plain "choose…" message rather than a format error.
  const journeys = d.tripType === 'multi_city' ? d.journeys : d.journeys.slice(0, 1);
  journeys.forEach((j, i) => {
    for (const field of ['origin', 'destination', 'departureDate'] as const) {
      if (!j[field].trim()) errors[`journeys.${i}.${field}`] = REQUIRED[field];
    }
  });
  if (d.tripType === 'round_trip' && !d.returnDate) errors.returnDate = REQUIRED.returnDate;

  const schema = createFlightSearchInputSchema({ today: todayInTimeZone('Etc/GMT+12', now) });
  const result = schema.safeParse(toApiInput(d));
  if (result.success && Object.keys(errors).length === 0) {
    return { ok: true as const, input: result.data, errors };
  }
  for (const issue of result.success ? [] : result.error.issues) {
    let key = issue.path.join('.');
    if (d.tripType === 'round_trip' && key.startsWith('journeys.1')) {
      // The return journey mirrors the outbound airports; only its date is the traveller's input.
      if (key !== 'journeys.1.departureDate' && key !== 'journeys.1') continue;
      key = key === 'journeys.1' ? 'journeys.0.destination' : 'returnDate';
    }
    errors[key] ??= issue.message;
  }
  return { ok: false as const, errors };
};
