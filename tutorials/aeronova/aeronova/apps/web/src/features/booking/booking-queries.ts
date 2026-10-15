import { useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Booking } from '@aeronova/shared';
import { apiClient } from '../../services/api-client';

export const bookingKeys = {
  all: ['account', 'bookings'] as const,
  one: (reference: string) => ['account', 'bookings', reference] as const,
};

export const useTrips = () =>
  useQuery({
    queryKey: bookingKeys.all,
    queryFn: ({ signal }) => apiClient.listBookings(signal),
    staleTime: 30_000,
  });

export const useBooking = (reference: string) =>
  useQuery({
    queryKey: bookingKeys.one(reference),
    queryFn: ({ signal }) => apiClient.getBooking(reference, signal),
    staleTime: 30_000,
  });

/**
 * One idempotency key per checkout attempt, kept for the life of the component.
 * A double-click, a retry after a timeout, or a refresh-and-resubmit all reuse
 * it, so the server returns the first booking instead of making a second.
 */
export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const key = useRef<string>(undefined);
  key.current ??= `book-${crypto.randomUUID()}`;
  return useMutation({
    mutationFn: (body: unknown) => apiClient.createBooking(body, key.current as string),
    onSuccess: (booking: Booking) => {
      queryClient.setQueryData(bookingKeys.one(booking.reference), booking);
      void queryClient.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reference: string) => apiClient.cancelBooking(reference),
    onSuccess: (booking: Booking) => {
      queryClient.setQueryData(bookingKeys.one(booking.reference), booking);
      void queryClient.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
};
