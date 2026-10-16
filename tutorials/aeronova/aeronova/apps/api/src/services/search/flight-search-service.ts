import { randomUUID } from 'node:crypto';
import {
  createFlightSearchInputSchema,
  ERROR_CODES,
  rankOffers,
  todayInTimeZone,
  type FlightSearchInput,
  type FlightSearchResponse,
} from '@aeronova/shared';
import type { Logger } from 'pino';
import { AppError, NotFoundError, ProviderError, ValidationError } from '../../errors/app-error.js';
import type { FlightProvider, ProviderOfferRef } from '../../providers/flight/flight-provider.js';
import { shortHash } from '../../utils/hash.js';
import type { AirportDirectory } from '../airport-directory.js';
import type { CurrencyConverter } from '../currency-service.js';
import { convertOffer } from './convert-offer.js';
import type { SearchStore } from './search-store.js';

export interface FlightSearchServiceOptions {
  readonly provider: FlightProvider;
  readonly directory: AirportDirectory;
  readonly store: SearchStore;
  readonly fx: CurrencyConverter;
  readonly logger: Logger;
  readonly timeoutMs: number;
  /** How long an identical query reuses the previous result. */
  readonly cacheTtlMs?: number;
  /** How long a search can be reopened by id (share links, back button). */
  readonly retentionMs?: number;
  readonly maxOffers?: number;
  readonly now?: () => Date;
}

const DEFAULT_CACHE_TTL_MS = 5 * 60_000;
const DEFAULT_RETENTION_MS = 60 * 60_000;
const DEFAULT_MAX_OFFERS = 200;

/** Stable fingerprint: key order and defaults can't create cache misses. */
const queryKeyFor = (q: FlightSearchInput, provider: string): string =>
  shortHash(
    JSON.stringify([
      provider,
      q.tripType,
      q.cabin,
      q.currency,
      q.directOnly,
      q.passengers.adults,
      q.passengers.children,
      q.passengers.infants,
      q.journeys.map((j) => [j.origin, j.destination, j.departureDate]),
    ]),
  );

export class FlightSearchService {
  private readonly inflight = new Map<string, Promise<FlightSearchResponse>>();

  constructor(private readonly o: FlightSearchServiceOptions) {}

  /** Validates raw input against the clock at the first departure airport. */
  parseInput(raw: unknown): FlightSearchInput {
    const firstOrigin = (raw as { journeys?: { origin?: unknown }[] } | null)?.journeys?.[0]?.origin;
    const originAirport =
      typeof firstOrigin === 'string' ? this.o.directory.resolveLocation(firstOrigin)[0] : undefined;
    const now = this.o.now?.() ?? new Date();
    // Unknown origin: validate against the earliest calendar day on Earth so
    // the airport error, not a date error, is what the traveller sees.
    const today = todayInTimeZone(originAirport?.timeZone ?? 'Etc/GMT+12', now);
    const parsed = createFlightSearchInputSchema({ today }).safeParse(raw);
    if (!parsed.success) {
      throw new ValidationError(
        parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
        'Some search details need attention.',
      );
    }

    const unknown = parsed.data.journeys.flatMap((j, i) =>
      (['origin', 'destination'] as const)
        .filter((f) => this.o.directory.resolveLocation(j[f]).length === 0)
        .map((f) => ({
          path: `journeys.${i}.${f}`,
          message: `We don't recognise the airport code ${j[f]}.`,
        })),
    );
    if (unknown.length > 0) {
      throw new AppError(ERROR_CODES.INVALID_AIRPORT, 400, 'Choose airports from the list.', {
        issues: unknown,
      });
    }
    return parsed.data;
  }

  async search(input: FlightSearchInput, requestId: string): Promise<FlightSearchResponse> {
    const queryKey = queryKeyFor(input, this.o.provider.id);
    const cached = await this.o.store.findByQueryKey(queryKey);
    const now = this.o.now?.() ?? new Date();
    const cacheTtl = this.o.cacheTtlMs ?? DEFAULT_CACHE_TTL_MS;
    if (cached && now.getTime() - Date.parse(cached.response.generatedAt) < cacheTtl) {
      this.o.logger.debug({ queryKey }, 'search cache hit');
      return cached.response;
    }

    // Collapse concurrent identical searches into one supplier call.
    const running = this.inflight.get(queryKey);
    if (running) return running;
    const task = this.execute(input, queryKey, requestId).finally(() => this.inflight.delete(queryKey));
    this.inflight.set(queryKey, task);
    return task;
  }

  async getById(searchId: string): Promise<FlightSearchResponse> {
    const found = await this.o.store.get(searchId);
    if (!found) throw new NotFoundError('This search has expired. Run it again to see current fares.');
    return found.response;
  }

  /** Server-side only: used by repricing and booking in later phases. */
  async resolveOffer(searchId: string, offerId: string): Promise<ProviderOfferRef | undefined> {
    return (await this.o.store.get(searchId))?.offerRefs.get(offerId);
  }

  private async execute(
    input: FlightSearchInput,
    queryKey: string,
    requestId: string,
  ): Promise<FlightSearchResponse> {
    const { provider, logger } = this.o;
    const signal = AbortSignal.timeout(this.o.timeoutMs);
    const started = performance.now();
    let result;
    try {
      result = await provider.searchFlights(input, { signal, requestId });
    } catch (err) {
      const ms = Math.round(performance.now() - started);
      if (err instanceof AppError) throw err;
      if (signal.aborted) {
        logger.warn({ provider: provider.id, ms }, 'flight provider timed out');
        throw new ProviderError(
          ERROR_CODES.FLIGHT_PROVIDER_TIMEOUT,
          'Flight search took too long. Your search is saved, so try again or change the dates.',
          { cause: err, context: { provider: provider.id, ms } },
        );
      }
      throw new ProviderError(
        ERROR_CODES.FLIGHT_PROVIDER_UNAVAILABLE,
        "We couldn't retrieve flights for this route right now. Try again in a moment.",
        { cause: err, context: { provider: provider.id, ms } },
      );
    }
    const providerMs = Math.round(performance.now() - started);

    const maxOffers = this.o.maxOffers ?? DEFAULT_MAX_OFFERS;
    const bound = result.offers.slice(0, maxOffers);
    const needsConversion = bound.some((b) => b.offer.price.currency !== input.currency);
    const offers = bound.map((b) => convertOffer(b.offer, input.currency, this.o.fx));
    const ranked = rankOffers(offers);

    const now = this.o.now?.() ?? new Date();
    const retention = this.o.retentionMs ?? DEFAULT_RETENTION_MS;
    const response: FlightSearchResponse = {
      searchId: `srch_${randomUUID().replaceAll('-', '')}`,
      query: input,
      dataOrigin: result.dataOrigin,
      currency: input.currency,
      conversion: needsConversion ? this.o.fx.source : 'none',
      generatedAt: now.toISOString(),
      expiresAt: result.expiresAt ?? new Date(now.getTime() + 30 * 60_000).toISOString(),
      totalOffers: result.offers.length,
      truncated: result.offers.length > maxOffers,
      offers: ranked,
      places: this.o.directory.describe([
        ...input.journeys.flatMap((j) => [j.origin, j.destination]),
        ...ranked.flatMap((r) =>
          r.offer.journeys.flatMap((j) =>
            j.segments.flatMap((s) => [
              s.origin.iataCode,
              s.destination.iataCode,
              ...s.technicalStops.map((t) => t.airport.iataCode),
            ]),
          ),
        ),
      ]),
    };

    await this.o.store.save(
      { response, queryKey, offerRefs: new Map(bound.map((b) => [b.offer.id, b.ref])) },
      retention,
    );
    logger.info(
      {
        provider: provider.id,
        providerMs,
        offers: ranked.length,
        truncated: response.truncated,
        tripType: input.tripType,
      },
      'flight search completed',
    );
    return response;
  }
}
