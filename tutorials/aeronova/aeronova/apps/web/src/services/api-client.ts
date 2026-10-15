import type {
  Booking,
  ClientConfig,
  AdminMetrics,
  AdminProviderStatus,
  ApiFieldIssue,
  ApiResponse,
  AuditEvent,
  AuditEventType,
  BookingState,
  ErrorCode,
  FlexibleDatesResponse,
  FlightSearchResponse,
  HealthStatus,
  LocationSuggestion,
  PriceCheckRequest,
  PricedQuote,
  SavedSearch,
  SavedTraveler,
  UpdateProfileInput,
  UserProfile,
} from '@aeronova/shared';

import { clientConfig } from '../lib/config';

/** What the built-in sign-in endpoints return. */
export interface AuthSession {
  readonly accessToken: string;
  readonly tokenType: 'Bearer';
  readonly expiresInSeconds: number;
  readonly user: UserProfile;
}

/** The single way the web app talks to the backend. Components never call fetch directly. */
export class ApiClientError extends Error {
  constructor(
    readonly code: ErrorCode | 'NETWORK_ERROR' | 'TIMEOUT' | 'UNEXPECTED_RESPONSE',
    message: string,
    readonly status: number | undefined,
    readonly requestId: string | undefined,
    readonly issues: readonly ApiFieldIssue[] = [],
  ) {
    super(message);
    this.name = 'ApiClientError';
  }

  /** Worth retrying automatically (never used for non-idempotent writes). */
  get isTransient(): boolean {
    return (
      this.code === 'NETWORK_ERROR' ||
      this.code === 'TIMEOUT' ||
      this.code === 'FLIGHT_PROVIDER_TIMEOUT' ||
      this.code === 'SERVICE_UNAVAILABLE'
    );
  }
}

interface RequestOptions {
  readonly method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  readonly body?: unknown;
  readonly signal?: AbortSignal;
  readonly idempotencyKey?: string;
}

type Fetch = typeof fetch;

const isEnvelope = (v: unknown): v is ApiResponse<unknown> =>
  typeof v === 'object' &&
  v !== null &&
  'success' in v &&
  typeof (v as { success: unknown }).success === 'boolean';

export const createApiClient = (
  fetchImpl: Fetch = (...args) => fetch(...args),
  baseUrl = clientConfig.apiBaseUrl,
) => {
  /**
   * The current access token, supplied by the auth provider. Kept here (not in
   * every call site) so no request can forget it, and cleared on sign-out.
   */
  let getToken: () => string | undefined = () => undefined;

  const request = async <T>(path: string, opts: RequestOptions = {}): Promise<T> => {
    const timeout = AbortSignal.timeout(clientConfig.requestTimeoutMs);
    const signal = opts.signal ? AbortSignal.any([opts.signal, timeout]) : timeout;
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (opts.body !== undefined) headers['Content-Type'] = 'application/json';
    if (opts.idempotencyKey) headers['Idempotency-Key'] = opts.idempotencyKey;
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    let res: Response;
    try {
      res = await fetchImpl(`${baseUrl}${path}`, {
        method: opts.method ?? 'GET',
        headers,
        signal,
        credentials: 'omit',
        ...(opts.body !== undefined ? { body: JSON.stringify(opts.body) } : {}),
      });
    } catch (err) {
      // Caller-initiated cancellation is not an error to show; rethrow as-is.
      if (opts.signal?.aborted) throw err;
      if (timeout.aborted) {
        throw new ApiClientError(
          'TIMEOUT',
          'This is taking longer than expected. Try again.',
          undefined,
          undefined,
        );
      }
      throw new ApiClientError(
        'NETWORK_ERROR',
        "We couldn't reach AeroNova. Check your connection.",
        undefined,
        undefined,
      );
    }

    const requestId = res.headers.get('x-request-id') ?? undefined;
    if (res.status === 204) return undefined as T;
    const payload: unknown = await res.json().catch(() => undefined);
    if (!isEnvelope(payload)) {
      throw new ApiClientError(
        'UNEXPECTED_RESPONSE',
        'The service returned an unexpected response.',
        res.status,
        requestId,
      );
    }
    if (!payload.success) {
      const e = payload.error;
      throw new ApiClientError(e.code, e.message, res.status, e.requestId, e.issues ?? []);
    }
    return payload.data as T;
  };

  return {
    request,
    /** Called by the auth provider whenever the signed-in user changes. */
    useTokenSource: (source: () => string | undefined) => {
      getToken = source;
    },
    getHealth: (signal?: AbortSignal) => request<HealthStatus>('/health', signal ? { signal } : {}),
    getClientConfig: (signal?: AbortSignal) =>
      request<ClientConfig>('/api/v1/client-config', signal ? { signal } : {}),
    searchAirports: (q: string, signal?: AbortSignal) =>
      request<LocationSuggestion[]>(
        `/api/v1/airports/search?q=${encodeURIComponent(q)}`,
        signal ? { signal } : {},
      ),
    /** Search has no side effects, so it is safe to cache and retry. */
    searchFlights: (body: unknown, signal?: AbortSignal) =>
      request<FlightSearchResponse>('/api/v1/search/flights', {
        method: 'POST',
        body,
        ...(signal ? { signal } : {}),
      }),
    /** Re-confirms one offer with the supplier. Never retried automatically. */
    createBooking: (body: unknown, idempotencyKey: string) =>
      request<Booking>('/api/v1/bookings', { method: 'POST', body, idempotencyKey }),
    listBookings: (signal?: AbortSignal) => request<Booking[]>('/api/v1/bookings', signal ? { signal } : {}),
    getBooking: (reference: string, signal?: AbortSignal) =>
      request<Booking>(`/api/v1/bookings/${encodeURIComponent(reference)}`, signal ? { signal } : {}),
    cancelBooking: (reference: string) =>
      request<Booking>(`/api/v1/bookings/${encodeURIComponent(reference)}/cancel`, { method: 'POST' }),
    /**
     * Returns the raw PDF as a Blob rather than going through `request`: the
     * happy-path response is a file, not the `{success, data}` JSON envelope
     * every other endpoint returns. Errors (401, 404, ...) still come back as
     * that envelope, so they're parsed the same way `request` would.
     */
    getItineraryPdf: async (reference: string, signal?: AbortSignal): Promise<Blob> => {
      const timeout = AbortSignal.timeout(clientConfig.requestTimeoutMs);
      const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;
      const headers: Record<string, string> = {};
      const token = getToken();
      if (token) headers.Authorization = `Bearer ${token}`;

      let res: Response;
      try {
        res = await fetchImpl(`${baseUrl}/api/v1/bookings/${encodeURIComponent(reference)}/itinerary.pdf`, {
          headers,
          signal: combined,
          credentials: 'omit',
        });
      } catch (err) {
        if (signal?.aborted) throw err;
        if (timeout.aborted) {
          throw new ApiClientError(
            'TIMEOUT',
            'This is taking longer than expected. Try again.',
            undefined,
            undefined,
          );
        }
        throw new ApiClientError(
          'NETWORK_ERROR',
          "We couldn't reach AeroNova. Check your connection.",
          undefined,
          undefined,
        );
      }

      const requestId = res.headers.get('x-request-id') ?? undefined;
      if (!res.ok) {
        const payload: unknown = await res.json().catch(() => undefined);
        if (isEnvelope(payload) && !payload.success) {
          const e = payload.error;
          throw new ApiClientError(e.code, e.message, res.status, e.requestId, e.issues ?? []);
        }
        throw new ApiClientError(
          'UNEXPECTED_RESPONSE',
          'The service returned an unexpected response.',
          res.status,
          requestId,
        );
      }
      return res.blob();
    },
    getAdminMetrics: (signal?: AbortSignal) =>
      request<AdminMetrics>('/api/v1/admin/metrics', signal ? { signal } : {}),
    getAdminUsers: (limit: number, signal?: AbortSignal) =>
      request<UserProfile[]>(`/api/v1/admin/users?limit=${limit}`, signal ? { signal } : {}),
    getAdminBookings: (opts: { limit: number; state?: BookingState }, signal?: AbortSignal) => {
      const params = new URLSearchParams({ limit: String(opts.limit) });
      if (opts.state) params.set('state', opts.state);
      return request<Booking[]>(`/api/v1/admin/bookings?${params.toString()}`, signal ? { signal } : {});
    },
    getAdminBooking: (reference: string, signal?: AbortSignal) =>
      request<Booking>(`/api/v1/admin/bookings/${encodeURIComponent(reference)}`, signal ? { signal } : {}),
    getAdminAuditLog: (opts: { limit: number; type?: AuditEventType }, signal?: AbortSignal) => {
      const params = new URLSearchParams({ limit: String(opts.limit) });
      if (opts.type) params.set('type', opts.type);
      return request<AuditEvent[]>(`/api/v1/admin/audit-log?${params.toString()}`, signal ? { signal } : {});
    },
    getAdminProviderStatus: (signal?: AbortSignal) =>
      request<AdminProviderStatus>('/api/v1/admin/provider-status', signal ? { signal } : {}),
    priceOffer: (body: PriceCheckRequest, signal?: AbortSignal) =>
      request<PricedQuote>('/api/v1/offers/price', { method: 'POST', body, ...(signal ? { signal } : {}) }),
    /** Fans out to several searches on the server; treat as best-effort. */
    flexibleDates: (body: unknown, signal?: AbortSignal) =>
      request<FlexibleDatesResponse>('/api/v1/search/flexible', {
        method: 'POST',
        body,
        ...(signal ? { signal } : {}),
      }),
    register: (body: { email: string; password: string; displayName?: string }) =>
      request<AuthSession>('/api/v1/auth/register', { method: 'POST', body }),
    login: (body: { email: string; password: string }) =>
      request<AuthSession>('/api/v1/auth/login', { method: 'POST', body }),
    getMe: (signal?: AbortSignal) => request<UserProfile>('/api/v1/users/me', signal ? { signal } : {}),
    updateMe: (body: UpdateProfileInput) =>
      request<UserProfile>('/api/v1/users/me', { method: 'PATCH', body }),
    listTravelers: (signal?: AbortSignal) =>
      request<SavedTraveler[]>('/api/v1/travelers', signal ? { signal } : {}),
    createTraveler: (body: unknown) => request<SavedTraveler>('/api/v1/travelers', { method: 'POST', body }),
    updateTraveler: (id: string, body: unknown) =>
      request<SavedTraveler>(`/api/v1/travelers/${encodeURIComponent(id)}`, { method: 'PATCH', body }),
    deleteTraveler: async (id: string): Promise<void> => {
      await request<undefined>(`/api/v1/travelers/${encodeURIComponent(id)}`, { method: 'DELETE' });
    },
    listSavedSearches: (signal?: AbortSignal) =>
      request<SavedSearch[]>('/api/v1/saved-searches', signal ? { signal } : {}),
    createSavedSearch: (body: { label: string; params: Record<string, string> }) =>
      request<SavedSearch>('/api/v1/saved-searches', { method: 'POST', body }),
    deleteSavedSearch: async (id: string): Promise<void> => {
      await request<undefined>(`/api/v1/saved-searches/${encodeURIComponent(id)}`, { method: 'DELETE' });
    },
    getSearch: (searchId: string, signal?: AbortSignal) =>
      request<FlightSearchResponse>(
        `/api/v1/search/${encodeURIComponent(searchId)}`,
        signal ? { signal } : {},
      ),
  };
};

export type ApiClient = ReturnType<typeof createApiClient>;
export const apiClient = createApiClient();
