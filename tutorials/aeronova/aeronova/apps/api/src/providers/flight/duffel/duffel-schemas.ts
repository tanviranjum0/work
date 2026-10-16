import { z } from 'zod';

/*
 * The subset of Duffel API v2 fields this adapter reads, from
 * https://duffel.com/docs/api/v2/offers and /offer-requests (checked September 2026).
 * Parsing is deliberately lenient (unknown keys pass through, optional fields may be
 * null) and happens per offer, so one malformed offer is skipped rather than failing
 * the whole search.
 */

const nullableString = z.string().nullish();

export const duffelPlaceSchema = z.object({
  iata_code: z.string(),
  time_zone: z.string(),
  name: nullableString,
  city_name: nullableString,
});

export const duffelCarrierSchema = z.object({
  iata_code: z.string().nullish(),
  name: z.string(),
});

const baggageSchema = z.object({
  type: z.enum(['checked', 'carry_on']).or(z.string()),
  quantity: z.number().int().nonnegative(),
});

export const duffelSegmentSchema = z.object({
  id: z.string(),
  departing_at: z.string(),
  arriving_at: z.string(),
  duration: nullableString,
  origin: duffelPlaceSchema,
  destination: duffelPlaceSchema,
  origin_terminal: nullableString,
  destination_terminal: nullableString,
  marketing_carrier: duffelCarrierSchema,
  marketing_carrier_flight_number: z.string(),
  operating_carrier: duffelCarrierSchema.nullish(),
  operating_carrier_flight_number: nullableString,
  aircraft: z.object({ iata_code: nullableString, name: nullableString }).nullish(),
  stops: z.array(z.object({ airport: duffelPlaceSchema, duration: nullableString })).nullish(),
  passengers: z
    .array(
      z.object({
        passenger_id: z.string(),
        cabin_class: z.enum(['economy', 'premium_economy', 'business', 'first']).nullish(),
        baggages: z.array(baggageSchema).nullish(),
      }),
    )
    .nullish(),
});

export const duffelSliceSchema = z.object({
  id: z.string(),
  duration: nullableString,
  fare_brand_name: nullableString,
  segments: z.array(duffelSegmentSchema).min(1),
});

const conditionSchema = z
  .object({
    allowed: z.boolean(),
    penalty_amount: nullableString,
    penalty_currency: nullableString,
  })
  .nullish();

export const duffelOfferSchema = z.object({
  id: z.string(),
  live_mode: z.boolean(),
  expires_at: z.string(),
  total_amount: z.string(),
  total_currency: z.string(),
  base_amount: nullableString,
  base_currency: nullableString,
  tax_amount: nullableString,
  tax_currency: nullableString,
  owner: duffelCarrierSchema,
  passengers: z.array(z.object({ id: z.string(), type: nullableString })).nullish(),
  conditions: z
    .object({ refund_before_departure: conditionSchema, change_before_departure: conditionSchema })
    .nullish(),
  slices: z.array(duffelSliceSchema).min(1),
});

export type DuffelOffer = z.infer<typeof duffelOfferSchema>;
export type DuffelSegment = z.infer<typeof duffelSegmentSchema>;

/** Envelope shapes: offers are parsed individually afterwards. */
export const duffelOfferRequestEnvelope = z.object({
  data: z.object({ id: z.string(), live_mode: z.boolean(), offers: z.array(z.unknown()).default([]) }),
});
export const duffelOfferEnvelope = z.object({ data: z.unknown() });

export const duffelErrorEnvelope = z.object({
  errors: z
    .array(
      z.object({
        type: nullableString,
        code: nullableString,
        title: nullableString,
        message: nullableString,
      }),
    )
    .default([]),
  meta: z.object({ request_id: nullableString }).partial().nullish(),
});
