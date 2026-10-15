import { QueryClient } from '@tanstack/react-query';
import { ApiClientError } from '../services/api-client';

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        // Bounded retries, and only for failures that retrying can fix.
        retry: (failureCount, error) =>
          failureCount < 2 && error instanceof ApiClientError && error.isTransient,
        retryDelay: (attempt) => Math.min(1_000 * 2 ** attempt, 6_000),
      },
      mutations: { retry: false },
    },
  });
