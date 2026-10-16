import type { Logger } from 'pino';
import type { z } from 'zod';
import { duffelErrorEnvelope } from './duffel-schemas.js';

export const DUFFEL_BASE_URL = 'https://api.duffel.com';
/** Pinned API version. Change only together with a re-check of the field mapping. */
export const DUFFEL_API_VERSION = 'v2';

export type DuffelFailureKind =
  | 'timeout'
  | 'rate_limited'
  | 'unauthorized'
  | 'offer_unavailable'
  | 'not_found'
  | 'invalid_request'
  | 'unavailable'
  | 'malformed_response';

/** Normalized supplier failure. Never carries the access token or request bodies. */
export class DuffelError extends Error {
  constructor(
    readonly kind: DuffelFailureKind,
    readonly status: number | undefined,
    readonly supplierCode: string | undefined,
    readonly supplierRequestId: string | undefined,
    options: { cause?: unknown } = {},
  ) {
    super(`Duffel ${kind}${status ? ` (${status})` : ''}${supplierCode ? `: ${supplierCode}` : ''}`, options);
    this.name = 'DuffelError';
  }

  /** Only failures that happened before Duffel did any work are safe to retry. */
  get retryable(): boolean {
    return (
      this.kind === 'unavailable' && (this.status === undefined || this.status === 502 || this.status === 503)
    );
  }
}

export interface DuffelClientOptions {
  readonly accessToken: string;
  readonly logger: Logger;
  readonly baseUrl?: string;
  readonly fetchImpl?: typeof fetch;
}

interface RequestOptions<T> {
  readonly method: 'GET' | 'POST';
  readonly path: string;
  readonly query?: Readonly<Record<string, string>>;
  readonly body?: unknown;
  readonly signal: AbortSignal;
  readonly requestId: string;
  readonly schema: z.ZodType<T>;
  /** Attempts for idempotent reads only. */
  readonly attempts?: number;
}

const classify = (status: number, code: string | undefined): DuffelFailureKind => {
  if (status === 401 || status === 403) return 'unauthorized';
  if (status === 429) return 'rate_limited';
  if (status === 404) return 'not_found';
  if (code === 'offer_no_longer_available') return 'offer_unavailable';
  if (status === 504) return 'timeout';
  if (status === 400 || status === 422) return 'invalid_request';
  return 'unavailable';
};

export class DuffelClient {
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;

  constructor(private readonly o: DuffelClientOptions) {
    this.baseUrl = o.baseUrl ?? DUFFEL_BASE_URL;
    this.fetchImpl = o.fetchImpl ?? ((...args) => fetch(...args));
  }

  async request<T>(opts: RequestOptions<T>): Promise<T> {
    const attempts = Math.max(1, opts.attempts ?? 1);
    for (let attempt = 1; ; attempt++) {
      try {
        return await this.once(opts);
      } catch (err) {
        const retry =
          err instanceof DuffelError && err.retryable && attempt < attempts && !opts.signal.aborted;
        if (!retry) throw err;
        this.o.logger.warn({ path: opts.path, attempt, status: err.status }, 'retrying Duffel request');
        await new Promise((r) => setTimeout(r, 250 * attempt));
      }
    }
  }

  private async once<T>({
    method,
    path,
    query,
    body,
    signal,
    requestId,
    schema,
  }: RequestOptions<T>): Promise<T> {
    const url = new URL(path, this.baseUrl);
    for (const [k, v] of Object.entries(query ?? {})) url.searchParams.set(k, v);
    const started = performance.now();
    let res: Response;
    try {
      res = await this.fetchImpl(url, {
        method,
        signal,
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip',
          'Duffel-Version': DUFFEL_API_VERSION,
          Authorization: `Bearer ${this.o.accessToken}`,
          // Lets Duffel support correlate their logs with ours.
          'x-client-correlation-id': requestId,
          ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        },
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      });
    } catch (err) {
      throw new DuffelError(signal.aborted ? 'timeout' : 'unavailable', undefined, undefined, undefined, {
        cause: err,
      });
    }
    const supplierRequestId = res.headers.get('x-request-id') ?? undefined;
    const payload: unknown = await res.json().catch(() => undefined);
    this.o.logger.debug(
      { path, status: res.status, ms: Math.round(performance.now() - started), supplierRequestId },
      'Duffel response',
    );

    if (!res.ok) {
      const parsed = duffelErrorEnvelope.safeParse(payload);
      const code = parsed.success ? (parsed.data.errors[0]?.code ?? undefined) : undefined;
      throw new DuffelError(classify(res.status, code), res.status, code, supplierRequestId);
    }
    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      throw new DuffelError('malformed_response', res.status, undefined, supplierRequestId, {
        cause: parsed.error,
      });
    }
    return parsed.data;
  }
}
