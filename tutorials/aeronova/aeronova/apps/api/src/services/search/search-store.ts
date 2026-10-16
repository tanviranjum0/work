import type { FlightSearchResponse } from '@aeronova/shared';
import type { ProviderOfferRef } from '../../providers/flight/flight-provider.js';

/**
 * A completed search plus the server-side supplier bindings for its offers.
 * Bindings never leave the API.
 */
export interface StoredSearch {
  readonly response: FlightSearchResponse;
  readonly offerRefs: ReadonlyMap<string, ProviderOfferRef>;
  /** Normalized query fingerprint, used as the cache key. */
  readonly queryKey: string;
}

export interface SearchStore {
  save(search: StoredSearch, ttlMs: number): Promise<void>;
  get(searchId: string): Promise<StoredSearch | undefined>;
  findByQueryKey(queryKey: string): Promise<StoredSearch | undefined>;
}

interface Entry {
  readonly value: StoredSearch;
  readonly expiresAt: number;
}

/**
 * Bounded in-memory store for demo mode and tests. A MongoDB TTL-collection
 * implementation lets search links survive process restarts.
 */
export class InMemorySearchStore implements SearchStore {
  private readonly byId = new Map<string, Entry>();
  private readonly idByKey = new Map<string, string>();

  constructor(
    private readonly maxEntries = 200,
    private readonly now: () => number = Date.now,
  ) {}

  async save(search: StoredSearch, ttlMs: number): Promise<void> {
    const id = search.response.searchId;
    this.byId.delete(id);
    this.byId.set(id, { value: search, expiresAt: this.now() + ttlMs });
    this.idByKey.set(search.queryKey, id);
    while (this.byId.size > this.maxEntries) {
      const oldest = this.byId.keys().next().value;
      if (oldest === undefined) break;
      this.evict(oldest);
    }
  }

  async get(searchId: string): Promise<StoredSearch | undefined> {
    const entry = this.byId.get(searchId);
    if (!entry) return undefined;
    if (entry.expiresAt <= this.now()) {
      this.evict(searchId);
      return undefined;
    }
    return entry.value;
  }

  async findByQueryKey(queryKey: string): Promise<StoredSearch | undefined> {
    const id = this.idByKey.get(queryKey);
    return id ? this.get(id) : undefined;
  }

  private evict(id: string): void {
    const entry = this.byId.get(id);
    this.byId.delete(id);
    if (entry && this.idByKey.get(entry.value.queryKey) === id) this.idByKey.delete(entry.value.queryKey);
  }
}
