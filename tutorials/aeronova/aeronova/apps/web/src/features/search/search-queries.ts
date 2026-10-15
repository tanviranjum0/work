import { useEffect, useState } from 'react';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import type { LocationSuggestion } from '@aeronova/shared';
import { apiClient } from '../../services/api-client';
import { toApiInput, type SearchDraft } from './search-url';

export const useDebouncedValue = <T>(value: T, ms: number): T => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
};

export const AIRPORT_QUERY_MIN_CHARS = 2;
export const AIRPORT_QUERY_DEBOUNCE_MS = 300;

/** Debounced, cached autocomplete. Never fires under two characters. */
export const useAirportSuggestions = (text: string) => {
  const q = useDebouncedValue(text.trim().toLowerCase(), AIRPORT_QUERY_DEBOUNCE_MS);
  return useQuery({
    queryKey: ['airports', q],
    queryFn: ({ signal }) => apiClient.searchAirports(q, signal),
    enabled: q.length >= AIRPORT_QUERY_MIN_CHARS,
    staleTime: 60 * 60_000,
    placeholderData: keepPreviousData,
  });
};

/**
 * The query key is the normalized request, so identical searches share a
 * cache entry, and navigating back to results doesn't search again.
 * Starting a new search aborts the previous request through `signal`.
 */
export const searchByIdKey = (searchId: string) => ['search', searchId] as const;

export const useFlightSearch = (draft: SearchDraft, enabled: boolean) => {
  const body = toApiInput(draft);
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['flight-search', body],
    queryFn: async ({ signal }) => {
      const res = await apiClient.searchFlights(body, signal);
      // Prime the by-id cache so opening a flight doesn't fetch the search again.
      queryClient.setQueryData(searchByIdKey(res.searchId), res);
      return res;
    },
    enabled,
    staleTime: 4 * 60_000,
    gcTime: 15 * 60_000,
  });
};

/* Recent airport picks live only in this browser (no account needed, no PII). */
const RECENT_KEY = 'aeronova.recentAirports';
export const readRecentAirports = (): LocationSuggestion[] => {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]');
    return Array.isArray(parsed) ? (parsed as LocationSuggestion[]).slice(0, 5) : [];
  } catch {
    return [];
  }
};
export const rememberAirport = (s: LocationSuggestion) => {
  try {
    const next = [s, ...readRecentAirports().filter((r) => r.code !== s.code)].slice(0, 5);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable: recent picks are a convenience only.
  }
};

/** A stored search, for flight detail deep links. Missing searches surface as a 404 error. */
export const useStoredSearch = (searchId: string) =>
  useQuery({
    queryKey: searchByIdKey(searchId),
    queryFn: ({ signal }) => apiClient.getSearch(searchId, signal),
    staleTime: 10 * 60_000,
    retry: false,
  });

/**
 * Price check for one offer. Runs once per offer; the traveller decides when
 * to check again (no automatic retries, no refetch on focus).
 */
export const useOfferPrice = (searchId: string, offerId: string, enabled: boolean) =>
  useQuery({
    queryKey: ['price', searchId, offerId],
    queryFn: ({ signal }) => apiClient.priceOffer({ searchId, offerId }, signal),
    enabled,
    retry: false,
    staleTime: 5 * 60_000,
    gcTime: 10 * 60_000,
    refetchOnWindowFocus: false,
  });

/** Nearby-date prices. Loads only after the main results, never retried. */
export const useFlexibleDates = (draft: SearchDraft, enabled: boolean) => {
  const body = toApiInput(draft);
  return useQuery({
    queryKey: ['flexible-dates', body],
    queryFn: ({ signal }) => apiClient.flexibleDates(body, signal),
    enabled,
    staleTime: 4 * 60_000,
    retry: false,
  });
};
