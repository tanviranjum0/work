import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { DuplicateUserError } from '../../repositories/types.js';
import { z } from 'zod';
import { ERROR_CODES, type Role } from '@aeronova/shared';
import { AppError, AuthenticationError } from '../../errors/app-error.js';
import { sendSuccess } from '../../http/respond.js';
import { createRateLimiter, RATE_LIMITS } from '../../middlewares/rate-limit.js';
import type { DevAuthProvider } from '../../auth/dev-auth-provider.js';
import { hashPassword, verifyPassword } from '../../auth/password.js';
import { toProfile } from '../../services/account/account-service.js';
import type { AuditService } from '../../services/audit/audit-service.js';
import type { Repositories } from '../../repositories/types.js';

const credentials = z.strictObject({
  // Trim first: a trailing space pasted from a password manager is not a typo worth rejecting.
  email: z
    .string()
    .trim()
    .max(254)
    .pipe(z.email({ error: 'Enter a valid email address.' })),
  // Length beats composition rules; the upper bound protects the hashing work.
  password: z.string().min(10, { error: 'Use at least 10 characters.' }).max(128),
  displayName: z.string().trim().min(1).max(60).optional(),
});

/**
 * Demo sign-up and sign-in. The password-based provider is intentionally
 * unavailable in production mode.
 */
export const authRoutes = (
  provider: DevAuthProvider,
  repos: Repositories,
  audit: AuditService,
  demoAdminEmail: string | undefined,
): Router => {
  const router = Router();
  const limiter = createRateLimiter(RATE_LIMITS.auth, 'auth');

  // The dev token's subject is the user's own id.
  const issueFor = async (user: { id: string; email: string; roles: readonly string[] }) => {
    const { accessToken, expiresInSeconds } = await provider.issue({
      subject: user.id,
      email: user.email,
      roles: user.roles,
    });
    return { accessToken, tokenType: 'Bearer' as const, expiresInSeconds };
  };

  const alreadyExists = () =>
    new AppError(
      ERROR_CODES.VALIDATION_ERROR,
      409,
      'An account already exists for this email. Sign in instead.',
    );

  router.post('/register', limiter, async (req, res) => {
    const { email, password, displayName } = credentials.parse(req.body);
    const normalised = email.trim().toLowerCase();
    // Fast path: skips a scrypt hash (the expensive part) for the common case
    // of a genuinely-taken email. It is not the enforcement point — the
    // repository's create() is — because two requests can both pass this
    // check before either has written anything.
    if (await repos.users.findByEmail(normalised)) throw alreadyExists();
    // id === subject by construction: dev has no external identity provider
    // supplying a subject, so the record's own id is used as one, and the
    // token is later verified back into this same value (see auth-provider.ts).
    const id = randomUUID();
    // Local/demo convenience: the one configured email becomes an admin on its
    // first registration. Forbidden in production by config validation, and
    // scoped to registration only — it is not retroactive.
    const roles: Role[] = demoAdminEmail && normalised === demoAdminEmail ? ['ADMIN'] : ['USER'];
    try {
      const user = await repos.users.create({
        id,
        subject: id,
        authProvider: 'dev',
        email: normalised,
        displayName: displayName ?? normalised.split('@')[0] ?? 'Traveller',
        roles,
        passwordHash: await hashPassword(password),
      });
      audit.record('USER_REGISTERED', {
        requestId: req.requestId,
        actorUserId: user.id,
        actorEmail: user.email,
      });
      sendSuccess(res, { ...(await issueFor(user)), user: toProfile(user) }, 201);
    } catch (err) {
      if (err instanceof DuplicateUserError) throw alreadyExists();
      throw err;
    }
  });

  router.post('/login', limiter, async (req, res) => {
    const { email, password } = credentials.parse(req.body);
    const normalised = email.trim().toLowerCase();
    const user = await repos.users.findByEmail(normalised);
    // Same message and similar work either way: no account enumeration.
    const ok = user?.passwordHash ? await verifyPassword(password, user.passwordHash) : false;
    if (!user || !ok) {
      req.log?.info({ event: 'LOGIN_FAILED' }, 'failed sign-in attempt');
      audit.record('LOGIN_FAILED', {
        requestId: req.requestId,
        actorUserId: user?.id ?? null,
        actorEmail: normalised,
      });
      throw new AuthenticationError('Email or password is incorrect.');
    }
    req.log?.info({ event: 'LOGIN_SUCCEEDED', userId: user.id }, 'sign-in');
    audit.record('LOGIN_SUCCEEDED', {
      requestId: req.requestId,
      actorUserId: user.id,
      actorEmail: user.email,
    });
    sendSuccess(res, { ...(await issueFor(user)), user: toProfile(user) });
  });

  return router;
};
