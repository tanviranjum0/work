import { useQuery } from '@tanstack/react-query';
import type { AuditEventType, BookingState } from '@aeronova/shared';
import { apiClient } from '../../services/api-client';

export const useAdminMetrics = () =>
  useQuery({
    queryKey: ['admin', 'metrics'],
    queryFn: ({ signal }) => apiClient.getAdminMetrics(signal),
    staleTime: 30_000,
  });

export const useAdminUsers = (limit = 50) =>
  useQuery({
    queryKey: ['admin', 'users', limit],
    queryFn: ({ signal }) => apiClient.getAdminUsers(limit, signal),
    staleTime: 30_000,
  });

export const useAdminBookings = (opts: { limit?: number; state?: BookingState } = {}) => {
  const limit = opts.limit ?? 50;
  return useQuery({
    queryKey: ['admin', 'bookings', limit, opts.state ?? null],
    queryFn: ({ signal }) =>
      apiClient.getAdminBookings({ limit, ...(opts.state ? { state: opts.state } : {}) }, signal),
    staleTime: 30_000,
  });
};

export const useAdminBooking = (reference: string) =>
  useQuery({
    queryKey: ['admin', 'booking', reference],
    queryFn: ({ signal }) => apiClient.getAdminBooking(reference, signal),
    staleTime: 30_000,
  });

export const useAdminAuditLog = (opts: { limit?: number; type?: AuditEventType } = {}) => {
  const limit = opts.limit ?? 50;
  return useQuery({
    queryKey: ['admin', 'audit-log', limit, opts.type ?? null],
    queryFn: ({ signal }) =>
      apiClient.getAdminAuditLog({ limit, ...(opts.type ? { type: opts.type } : {}) }, signal),
    staleTime: 15_000,
  });
};

export const useAdminProviderStatus = () =>
  useQuery({
    queryKey: ['admin', 'provider-status'],
    queryFn: ({ signal }) => apiClient.getAdminProviderStatus(signal),
    staleTime: 60_000,
  });
