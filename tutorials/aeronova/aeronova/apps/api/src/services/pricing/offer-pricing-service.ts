import { randomUUID } from 'node:crypto';
import { ERROR_CODES, type PriceCheckRequest, type PricedQuote } from '@aeronova/shared';
import type { Logger } from 'pino';
import { AppError, NotFoundError, ProviderError } from '../../errors/app-error.js';
import type { FlightProvider } from '../../providers/flight/flight-provider.js';
import type { CurrencyConverter } from '../currency-service.js';
import { convertOffer } from '../search/convert-offer.js';
import type { SearchStore } from '../search/search-store.js';
import type { QuoteStore } from './quote-store.js';

export interface OfferPricingServiceOptions {
  readonly provider: FlightProvider;
  readonly searches: SearchStore;
  readonly quotes: QuoteStore;
  readonly fx: CurrencyConverter;
  readonly logger: Logger;
  readonly timeoutMs: number;
  readonly now?: () => Date;
}

const offerGone = () =>
  new AppError(
    ERROR_CODES.OFFER_EXPIRED,
    410,
    'This fare is no longer available. Search again to see current fares.',
  );

/**
 * Turns an indicative search price into a bookable quote. Never assumes the
 * search price still holds, and never hides a change: the caller gets both
 * the previous and the current total.
 */
export class OfferPricingService {
  constructor(private readonly o: OfferPricingServiceOptions) {}

  async price(req: PriceCheckRequest, requestId: string): Promise<PricedQuote> {
    const stored = await this.o.searches.get(req.searchId);
    // A search we no longer hold means its offers can't be trusted either.
    if (!stored) throw offerGone();
    const ranked = stored.response.offers.find((r) => r.offer.id === req.offerId);
    const ref = stored.offerRefs.get(req.offerId);
    if (!ranked || !ref) throw new NotFoundError('We could not find that fare in this search.');
    if (ref.provider !== this.o.provider.id) throw offerGone();

    const signal = AbortSignal.timeout(this.o.timeoutMs);
    const started = performance.now();
    let result;
    try {
      result = await this.o.provider.priceOffer(ref, ranked.offer, { signal, requestId });
    } catch (err) {
      const ms = Math.round(performance.now() - started);
      if (err instanceof AppError) throw err;
      throw new ProviderError(
        signal.aborted ? ERROR_CODES.FLIGHT_PROVIDER_TIMEOUT : ERROR_CODES.FLIGHT_PROVIDER_UNAVAILABLE,
        "We couldn't confirm this price right now. Try again in a moment.",
        { cause: err, context: { provider: ref.provider, ms, operation: 'price' } },
      );
    }

    if (result.kind === 'unavailable') {
      this.o.logger.info({ provider: ref.provider, reason: result.reason }, 'offer no longer available');
      throw offerGone();
    }

    const currency = stored.response.currency;
    const offer = convertOffer(result.offer, currency, this.o.fx);
    const previousTotal = ranked.offer.price.customerTotal;
    const status =
      offer.price.customerTotal.amountMinor === previousTotal.amountMinor ? 'confirmed' : 'changed';
    const now = this.o.now?.() ?? new Date();
    const quote: PricedQuote = {
      quoteId: `qt_${randomUUID().replaceAll('-', '')}`,
      searchId: req.searchId,
      offerId: req.offerId,
      status,
      offer,
      previousTotal,
      checkedAt: now.toISOString(),
      expiresAt: result.expiresAt,
      dataOrigin: stored.response.dataOrigin,
    };
    await this.o.quotes.save({ quote, ref });
    this.o.logger.info(
      {
        provider: ref.provider,
        status,
        deltaMinor: offer.price.customerTotal.amountMinor - previousTotal.amountMinor,
        providerMs: Math.round(performance.now() - started),
      },
      'offer priced',
    );
    return quote;
  }
}
