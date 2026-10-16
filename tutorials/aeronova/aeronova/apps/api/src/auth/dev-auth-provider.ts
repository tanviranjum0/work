import { randomUUID } from 'node:crypto';
import { jwtVerify, SignJWT } from 'jose';
import type { AppMode } from '@aeronova/shared';
import { InvalidTokenError, type AuthProvider, type VerifiedIdentity } from './auth-provider.js';

export const DEV_ISSUER = 'aeronova-dev';
const ALGORITHM = 'HS256';

export interface DevTokenClaims {
  readonly subject: string;
  readonly email: string;
  readonly roles: readonly string[];
}

/**
 * Email-and-password auth for local development and demos. It signs its own
 * tokens with a symmetric key, so it must never run in production mode: both
 * the configuration layer and this constructor enforce that restriction.
 */
export class DevAuthProvider implements AuthProvider {
  readonly id = 'dev' as const;
  private readonly key: Uint8Array;

  constructor(
    secret: string,
    private readonly ttlMinutes: number,
    appMode: AppMode,
  ) {
    // Keyed on APP_MODE, not NODE_ENV: a deployed demo legitimately runs with
    // NODE_ENV=production (it is a deployed process). Config validation
    // enforces the same production-mode restriction independently.
    if (appMode === 'production') throw new Error('DevAuthProvider must not be used in production mode.');
    if (secret.length < 32) throw new Error('Dev auth secret must be at least 32 characters.');
    this.key = new TextEncoder().encode(secret);
  }

  async issue(claims: DevTokenClaims): Promise<{ accessToken: string; expiresInSeconds: number }> {
    const expiresInSeconds = this.ttlMinutes * 60;
    const accessToken = await new SignJWT({ email: claims.email, roles: [...claims.roles] })
      .setProtectedHeader({ alg: ALGORITHM })
      .setSubject(claims.subject)
      // Unique per token: two tokens issued in the same second are still distinguishable,
      // and revocation lists (Phase 7) have something to key on.
      .setJti(randomUUID())
      .setIssuer(DEV_ISSUER)
      .setIssuedAt()
      .setExpirationTime(`${expiresInSeconds}s`)
      .sign(this.key);
    return { accessToken, expiresInSeconds };
  }

  async verify(token: string): Promise<VerifiedIdentity> {
    try {
      const { payload } = await jwtVerify(token, this.key, { issuer: DEV_ISSUER, algorithms: [ALGORITHM] });
      const email = typeof payload.email === 'string' ? payload.email : '';
      if (!payload.sub || !email) throw new InvalidTokenError('Token is missing required claims.');
      const roles = Array.isArray(payload.roles)
        ? payload.roles.filter((r): r is string => typeof r === 'string')
        : [];
      return { subject: payload.sub, email, emailVerified: true, roles };
    } catch (err) {
      throw err instanceof InvalidTokenError ? err : new InvalidTokenError('Token could not be verified.');
    }
  }
}
