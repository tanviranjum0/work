import type { PricedQuote } from '@aeronova/shared';
import type { ProviderOfferRef } from '../../providers/flight/flight-provider.js';

export interface StoredQuote {
  readonly quote: PricedQuote;
  /** Server-side supplier binding; the booking step (Phase 5) consumes it. */
  readonly ref: ProviderOfferRef;
}

export interface QuoteStore {
  save(entry: StoredQuote): Promise<void>;
  /** Returns nothing once the quote has expired. */
  get(quoteId: string): Promise<StoredQuote | undefined>;
}

/** Bounded, expiring in-memory store for demo mode and tests. */
export class InMemoryQuoteStore implements QuoteStore {
  private readonly entries = new Map<string, StoredQuote>();

  constructor(
    private readonly maxEntries = 500,
    private readonly now: () => number = Date.now,
  ) {}

  async save(entry: StoredQuote): Promise<void> {
    this.entries.delete(entry.quote.quoteId);
    this.entries.set(entry.quote.quoteId, entry);
    while (this.entries.size > this.maxEntries) {
      const oldest = this.entries.keys().next().value;
      if (oldest === undefined) break;
      this.entries.delete(oldest);
    }
  }

  async get(quoteId: string): Promise<StoredQuote | undefined> {
    const entry = this.entries.get(quoteId);
    if (!entry) return undefined;
    if (Date.parse(entry.quote.expiresAt) <= this.now()) {
      this.entries.delete(quoteId);
      return undefined;
    }
    return entry;
  }
}
