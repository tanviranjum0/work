import type { AppMode } from '../app-mode.js';
import type { ErrorCode } from '../errors/error-codes.js';

export interface ApiFieldIssue {
  readonly path: string;
  readonly message: string;
}

export interface ApiErrorBody {
  readonly code: ErrorCode;
  readonly message: string;
  readonly requestId: string;
  readonly issues?: readonly ApiFieldIssue[];
}

export interface ApiSuccess<T> {
  readonly success: true;
  readonly data: T;
}

export interface ApiFailure {
  readonly success: false;
  readonly error: ApiErrorBody;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export type HealthCheckResult = 'ok' | 'skipped' | 'failed';

export interface HealthStatus {
  readonly status: 'ok' | 'degraded' | 'unavailable';
  readonly mode: AppMode;
  readonly version: string;
  readonly checks?: Readonly<Record<string, HealthCheckResult>>;
}
