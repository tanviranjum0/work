import { ERROR_CODES, type ApiFieldIssue, type ErrorCode } from '@aeronova/shared';

interface AppErrorOptions {
  readonly cause?: unknown;
  readonly issues?: readonly ApiFieldIssue[];
  /** Internal-only context for logs. Must not contain PII or secrets. */
  readonly context?: Readonly<Record<string, string | number | boolean>>;
}

/**
 * `publicMessage` is written for travellers and is safe to return.
 * Anything technical belongs in `cause`/`context`, which are only logged.
 */
export class AppError extends Error {
  readonly issues: readonly ApiFieldIssue[] | undefined;
  readonly context: AppErrorOptions['context'];

  constructor(
    readonly code: ErrorCode,
    readonly httpStatus: number,
    readonly publicMessage: string,
    options: AppErrorOptions = {},
  ) {
    super(publicMessage, { cause: options.cause });
    this.name = new.target.name;
    this.issues = options.issues;
    this.context = options.context;
  }

  get isServerError(): boolean {
    return this.httpStatus >= 500;
  }
}

export class ValidationError extends AppError {
  constructor(issues: readonly ApiFieldIssue[], message = 'Some details need attention.') {
    super(ERROR_CODES.VALIDATION_ERROR, 400, message, { issues });
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Sign in to continue.') {
    super(ERROR_CODES.UNAUTHORIZED, 401, message);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "You don't have access to this.") {
    super(ERROR_CODES.FORBIDDEN, 403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "We couldn't find what you were looking for.") {
    super(ERROR_CODES.NOT_FOUND, 404, message);
  }
}

export class ProviderError extends AppError {
  constructor(
    code:
      | typeof ERROR_CODES.FLIGHT_PROVIDER_TIMEOUT
      | typeof ERROR_CODES.FLIGHT_PROVIDER_RATE_LIMIT
      | typeof ERROR_CODES.FLIGHT_PROVIDER_UNAVAILABLE,
    message: string,
    options: AppErrorOptions = {},
  ) {
    super(code, code === ERROR_CODES.FLIGHT_PROVIDER_RATE_LIMIT ? 503 : 502, message, options);
  }
}
