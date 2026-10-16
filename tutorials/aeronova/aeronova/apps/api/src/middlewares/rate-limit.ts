import { ipKeyGenerator, rateLimit, type Options } from 'express-rate-limit';
import type { RequestHandler } from 'express';
import { AppError } from '../errors/app-error.js';
import { ERROR_CODES } from '@aeronova/shared';

/**
 * Per-route budgets. These counters live in process memory, so each API
 * instance has its own budget. A shared store replaces this in Phase 7.
 */
export const RATE_LIMITS = {
  search: { windowMs: 60_000, limit: 20 },
  autocomplete: { windowMs: 60_000, limit: 120 },
  pricing: { windowMs: 60_000, limit: 30 },
  /** Credential endpoints: strict, to slow down guessing. */
  auth: { windowMs: 15 * 60_000, limit: 10 },
  account: { windowMs: 60_000, limit: 60 },
  /** Purchases: strict, and idempotency makes retries safe anyway. */
  booking: { windowMs: 60_000, limit: 10 },
  /** Each call can fan out to seven searches. */
  flexibleDates: { windowMs: 60_000, limit: 6 },
  /** Admin endpoints: very strict, per the brief — internal tooling, not a public surface. */
  admin: { windowMs: 60_000, limit: 30 },
} as const satisfies Record<string, Pick<Options, 'windowMs' | 'limit'>>;

export const createRateLimiter = (
  policy: Pick<Options, 'windowMs' | 'limit'>,
  name: string,
): RequestHandler =>
  rateLimit({
    ...policy,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    identifier: name,
    keyGenerator: (req) => `${name}:${ipKeyGenerator(req.ip ?? 'unknown')}`,
    handler: (_req, _res, next) => {
      next(
        new AppError(
          ERROR_CODES.RATE_LIMITED,
          429,
          "You're searching faster than we can keep up. Wait a moment and try again.",
        ),
      );
    },
  });
