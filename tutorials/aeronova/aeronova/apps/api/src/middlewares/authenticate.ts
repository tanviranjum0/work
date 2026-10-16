import type { RequestHandler } from 'express';
import type { Role } from '@aeronova/shared';
import { InvalidTokenError, type AuthProvider } from '../auth/auth-provider.js';
import { AuthenticationError, AuthorizationError } from '../errors/app-error.js';
import type { AccountService } from '../services/account/account-service.js';
import type { UserRecord } from '../repositories/types.js';

declare module 'express-serve-static-core' {
  interface Request {
    /** Set by `requireAuth`; present only after a verified token. */
    user?: UserRecord;
  }
}

const bearer = (header: string | undefined): string | undefined => {
  const [scheme, token] = (header ?? '').split(' ');
  return scheme?.toLowerCase() === 'bearer' && token ? token : undefined;
};

export interface AuthDependencies {
  readonly provider: AuthProvider;
  readonly accounts: AccountService;
}

/**
 * Verifies the bearer token and loads the local user. Roles come from storage,
 * never from the request, so a client cannot claim to be an admin.
 */
export const requireAuth =
  ({ provider, accounts }: AuthDependencies): RequestHandler =>
  (req, _res, next) => {
    const token = bearer(req.get('authorization'));
    if (!token) {
      next(new AuthenticationError('Sign in to continue.'));
      return;
    }
    void (async () => {
      try {
        const identity = await provider.verify(token);
        req.user = await accounts.resolveUser(identity, provider.id);
        next();
      } catch (err) {
        next(
          err instanceof InvalidTokenError
            ? new AuthenticationError('Your session has expired. Sign in again.')
            : err,
        );
      }
    })();
  };

export const requireRole =
  (...roles: Role[]): RequestHandler =>
  (req, _res, next) => {
    const user = req.user;
    if (!user) {
      next(new AuthenticationError());
      return;
    }
    next(roles.some((r) => user.roles.includes(r)) ? undefined : new AuthorizationError());
  };

/** Throws if used outside an authenticated route, so handlers need no null checks. */
export const currentUser = (req: { user?: UserRecord }): UserRecord => {
  if (!req.user) throw new AuthenticationError();
  return req.user;
};
