import { ERROR_CODES, type FlightOffer, type FlightSearchInput } from '@aeronova/shared';
import type { Logger } from 'pino';
import { ProviderError } from '../../../errors/app-error.js';
import type {
  FlightProvider,
  ProviderBoundOffer,
  ProviderContext,
  ProviderOfferRef,
  ProviderPriceResult,
  ProviderSearchResult,
} from '../flight-provider.js';
import type { DuffelClient } from './duffel-client.js';
import { DuffelError } from './duffel-client.js';
import { mapDuffelOffer } from './duffel-mapper.js';
import { duffelOfferEnvelope, duffelOfferRequestEnvelope, duffelOfferSchema } from './duffel-schemas.js';

/**
 * Representative ages inside the standard child (2–11) and infant (<2) bands.
 * Duffel requires an age for every passenger under 18; the search form collects
 * counts only. Booking (Phase 5) collects real dates of birth and reprices.
 */
export const REPRESENTATIVE_CHILD_AGE = 7;
export const REPRESENTATIVE_INFANT_AGE = 1;

/** Duffel's documented default; one connection per slice keeps sandbox results comparable. */
const MAX_CONNECTIONS_WITH_STOPS = 1;

export interface DuffelFlightProviderOptions {
  readonly client: DuffelClient;
  readonly logger: Logger;
  /** Must be shorter than our own timeout so Duffel returns partial results instead of nothing. */
  readonly supplierTimeoutMs: number;
}

const toProviderError = (err: unknown, operation: string): never => {
  if (err instanceof DuffelError) {
    const context = { provider: 'duffel', operation, kind: err.kind, status: err.status ?? 0 };
    if (err.kind === 'rate_limited') {
      throw new ProviderError(
        ERROR_CODES.FLIGHT_PROVIDER_RATE_LIMIT,
        'Flight search is busy right now. Try again shortly.',
        { cause: err, context },
      );
    }
    if (err.kind === 'timeout') {
      throw new ProviderError(
        ERROR_CODES.FLIGHT_PROVIDER_TIMEOUT,
        'Airlines took too long to respond. Try again.',
        { cause: err, context },
      );
    }
    throw new ProviderError(
      ERROR_CODES.FLIGHT_PROVIDER_UNAVAILABLE,
      "We couldn't retrieve flights right now. Try again in a moment.",
      { cause: err, context },
    );
  }
  throw err;
};

export class DuffelFlightProvider implements FlightProvider {
  readonly id = 'duffel' as const;
  // Each nearby-date cell would be a full supplier search: keep it off.
  readonly capabilities = { flexibleDates: false } as const;

  constructor(private readonly o: DuffelFlightProviderOptions) {}

  async searchFlights(input: FlightSearchInput, ctx: ProviderContext): Promise<ProviderSearchResult> {
    const { adults, children, infants } = input.passengers;
    const body = {
      data: {
        slices: input.journeys.map((j) => ({
          origin: j.origin,
          destination: j.destination,
          departure_date: j.departureDate,
        })),
        passengers: [
          ...Array.from({ length: adults }, () => ({ type: 'adult' })),
          ...Array.from({ length: children }, () => ({ age: REPRESENTATIVE_CHILD_AGE })),
          ...Array.from({ length: infants }, () => ({ age: REPRESENTATIVE_INFANT_AGE })),
        ],
        cabin_class: input.cabin,
        max_connections: input.directOnly ? 0 : MAX_CONNECTIONS_WITH_STOPS,
      },
    };

    let envelope;
    try {
      envelope = await this.o.client.request({
        method: 'POST',
        path: '/air/offer_requests',
        query: {
          return_offers: 'true',
          supplier_timeout: String(Math.min(60_000, Math.max(2_000, this.o.supplierTimeoutMs))),
        },
        body,
        signal: ctx.signal,
        requestId: ctx.requestId,
        schema: duffelOfferRequestEnvelope,
        // Creating an offer request only reads airline inventory, so one retry on a gateway error is safe.
        attempts: 2,
      });
    } catch (err) {
      return toProviderError(err, 'search');
    }

    const skipped: Record<string, number> = {};
    const offers: ProviderBoundOffer[] = [];
    for (const raw of envelope.data.offers) {
      const parsed = duffelOfferSchema.safeParse(raw);
      if (!parsed.success) {
        skipped.unparseable = (skipped.unparseable ?? 0) + 1;
        continue;
      }
      const mapped = mapDuffelOffer(parsed.data, input.cabin);
      if (!mapped.ok) {
        skipped[mapped.reason] = (skipped[mapped.reason] ?? 0) + 1;
        continue;
      }
      offers.push({ offer: mapped.offer, ref: { provider: 'duffel', providerOfferId: parsed.data.id } });
    }
    if (Object.keys(skipped).length > 0) {
      this.o.logger.warn({ skipped, offerRequest: envelope.data.id }, 'skipped Duffel offers');
    }

    // Offers in one response can carry different currencies; the search pipeline expects one.
    const currency = offers[0]?.offer.price.currency;
    const sameCurrency = offers.filter((b) => b.offer.price.currency === currency);
    const expiries = sameCurrency.map((b) =>
      b.offer.expiresAt.status === 'provided' ? Date.parse(b.offer.expiresAt.value) : Infinity,
    );
    const earliest = Math.min(...expiries);
    return {
      offers: sameCurrency,
      dataOrigin: envelope.data.live_mode ? 'live' : 'sandbox',
      expiresAt: Number.isFinite(earliest) ? new Date(earliest).toISOString() : undefined,
    };
  }

  async priceOffer(
    ref: ProviderOfferRef,
    known: FlightOffer,
    ctx: ProviderContext,
  ): Promise<ProviderPriceResult> {
    let envelope;
    try {
      envelope = await this.o.client.request({
        method: 'GET',
        path: `/air/offers/${encodeURIComponent(ref.providerOfferId)}`,
        signal: ctx.signal,
        requestId: ctx.requestId,
        schema: duffelOfferEnvelope,
        attempts: 2,
      });
    } catch (err) {
      if (err instanceof DuffelError && (err.kind === 'offer_unavailable' || err.kind === 'not_found')) {
        return { kind: 'unavailable', reason: 'expired' };
      }
      return toProviderError(err, 'price');
    }
    const parsed = duffelOfferSchema.safeParse(envelope.data);
    const mapped = parsed.success ? mapDuffelOffer(parsed.data, known.cabin) : undefined;
    if (!parsed.success || !mapped?.ok) {
      return toProviderError(new DuffelError('malformed_response', 200, undefined, undefined), 'price');
    }
    // Keep the AeroNova ids stable so the client can match the priced offer to the one it chose.
    const offer: FlightOffer = { ...mapped.offer, id: known.id, itineraryKey: known.itineraryKey };
    return { kind: 'priced', offer, expiresAt: parsed.data.expires_at };
  }
}
