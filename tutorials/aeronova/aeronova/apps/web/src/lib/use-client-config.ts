import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../services/api-client';

/** Public runtime configuration from the API: which sign-in to use, whether booking exists. */
export const useClientConfig = () =>
  useQuery({
    queryKey: ['client-config'],
    queryFn: ({ signal }) => apiClient.getClientConfig(signal),
    staleTime: Infinity,
  });

/** undefined while loading; the UI treats that as "not yet" rather than "no". */
export const useBookingEnabled = (): boolean | undefined => useClientConfig().data?.features.booking;
