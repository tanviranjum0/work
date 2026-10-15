import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../services/api-client';

export const healthQueryKey = ['health'] as const;

export const useHealth = () =>
  useQuery({
    queryKey: healthQueryKey,
    queryFn: ({ signal }) => apiClient.getHealth(signal),
    staleTime: 5 * 60_000,
  });
