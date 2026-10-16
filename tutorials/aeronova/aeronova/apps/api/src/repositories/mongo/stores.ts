import mongoose, { type Model } from 'mongoose';
import type { ProviderOfferRef } from '../../providers/flight/flight-provider.js';
import type { QuoteStore, StoredQuote } from '../../services/pricing/quote-store.js';
import type { SearchStore, StoredSearch } from '../../services/search/search-store.js';

const { Schema, model, models } = mongoose;

/*
 * Searches and price quotes must be shared across API instances: a search
 * created on one instance is price-checked on
 * whichever instance serves the next request. Payloads are stored as JSON
 * strings (supplier data is not schema'd here, and field names like `$` or
 * `.` would otherwise be a hazard). Expiry is enforced on every read; the TTL
 * index only cleans up, because MongoDB's TTL sweep runs about once a minute.
 */
interface CachedDocument {
  _id: string;
  key?: string;
  payload: string;
  expiresAt: Date;
}

const cachedSchema = (collection: string, withKey: boolean) => {
  const schema = new Schema<CachedDocument>(
    {
      _id: { type: String, required: true },
      ...(withKey ? { key: { type: String, index: true } } : {}),
      payload: { type: String, required: true },
      expiresAt: { type: Date, required: true },
    },
    // autoIndex off: these indexes are housekeeping, built best-effort by ensureMongoReady.
    { versionKey: false, _id: false, collection, autoIndex: false },
  );
  schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  return schema;
};

export const SearchCacheModel: Model<CachedDocument> =
  (models.SearchCache as Model<CachedDocument>) ?? model('SearchCache', cachedSchema('search_cache', true));
export const QuoteCacheModel: Model<CachedDocument> =
  (models.QuoteCache as Model<CachedDocument>) ?? model('QuoteCache', cachedSchema('quote_cache', false));

interface SerializedSearch {
  response: StoredSearch['response'];
  offerRefs: [string, ProviderOfferRef][];
  queryKey: string;
}

const toSearch = (payload: string): StoredSearch => {
  const s = JSON.parse(payload) as SerializedSearch;
  return { response: s.response, offerRefs: new Map(s.offerRefs), queryKey: s.queryKey };
};

export class MongoSearchStore implements SearchStore {
  constructor(private readonly now: () => number = Date.now) {}

  async save(search: StoredSearch, ttlMs: number): Promise<void> {
    const payload: SerializedSearch = {
      response: search.response,
      offerRefs: [...search.offerRefs.entries()],
      queryKey: search.queryKey,
    };
    await SearchCacheModel.replaceOne(
      { _id: search.response.searchId },
      {
        _id: search.response.searchId,
        key: search.queryKey,
        payload: JSON.stringify(payload),
        expiresAt: new Date(this.now() + ttlMs),
      },
      { upsert: true },
    ).exec();
  }

  async get(searchId: string): Promise<StoredSearch | undefined> {
    const doc = await SearchCacheModel.findOne({ _id: searchId, expiresAt: { $gt: new Date(this.now()) } })
      .lean<CachedDocument>()
      .exec();
    return doc ? toSearch(doc.payload) : undefined;
  }

  async findByQueryKey(queryKey: string): Promise<StoredSearch | undefined> {
    const doc = await SearchCacheModel.findOne({ key: queryKey, expiresAt: { $gt: new Date(this.now()) } })
      .sort({ expiresAt: -1 })
      .lean<CachedDocument>()
      .exec();
    return doc ? toSearch(doc.payload) : undefined;
  }
}

export class MongoQuoteStore implements QuoteStore {
  constructor(private readonly now: () => number = Date.now) {}

  async save(entry: StoredQuote): Promise<void> {
    await QuoteCacheModel.replaceOne(
      { _id: entry.quote.quoteId },
      {
        _id: entry.quote.quoteId,
        payload: JSON.stringify(entry),
        expiresAt: new Date(entry.quote.expiresAt),
      },
      { upsert: true },
    ).exec();
  }

  async get(quoteId: string): Promise<StoredQuote | undefined> {
    const doc = await QuoteCacheModel.findOne({ _id: quoteId, expiresAt: { $gt: new Date(this.now()) } })
      .lean<CachedDocument>()
      .exec();
    return doc ? (JSON.parse(doc.payload) as StoredQuote) : undefined;
  }
}
