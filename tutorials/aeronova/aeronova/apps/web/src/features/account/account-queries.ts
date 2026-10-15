import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { SavedSearch, SavedTraveler } from '@aeronova/shared';
import { apiClient } from '../../services/api-client';

/** All account data is cached under one key prefix, so sign-out can drop it in one call. */
export const accountKeys = {
  travelers: ['account', 'travelers'] as const,
  savedSearches: ['account', 'saved-searches'] as const,
};

export const useTravelers = () =>
  useQuery({
    queryKey: accountKeys.travelers,
    queryFn: ({ signal }) => apiClient.listTravelers(signal),
    staleTime: 60_000,
  });

export const useTravelerMutations = () => {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: accountKeys.travelers });
  return {
    create: useMutation({
      mutationFn: (body: unknown) => apiClient.createTraveler(body),
      onSuccess: invalidate,
    }),
    update: useMutation({
      mutationFn: ({ id, body }: { id: string; body: unknown }) => apiClient.updateTraveler(id, body),
      onSuccess: invalidate,
    }),
    remove: useMutation({ mutationFn: (id: string) => apiClient.deleteTraveler(id), onSuccess: invalidate }),
  };
};

export const useSavedSearches = () =>
  useQuery({
    queryKey: accountKeys.savedSearches,
    queryFn: ({ signal }) => apiClient.listSavedSearches(signal),
    staleTime: 60_000,
  });

export const useSavedSearchMutations = () => {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: accountKeys.savedSearches });
  return {
    create: useMutation({
      mutationFn: (body: { label: string; params: Record<string, string> }) =>
        apiClient.createSavedSearch(body),
      onSuccess: invalidate,
    }),
    remove: useMutation({
      mutationFn: (id: string) => apiClient.deleteSavedSearch(id),
      onSuccess: invalidate,
    }),
  };
};

export type { SavedSearch, SavedTraveler };
