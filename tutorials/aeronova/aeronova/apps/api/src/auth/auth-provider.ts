/**
 * How a bearer token becomes an identity. The rest of the API only ever sees
 * `VerifiedIdentity`, keeping token verification separate from account logic.
 */
export interface VerifiedIdentity {
  /** Stable identifier for the authenticated user. */
  readonly subject: string;
  readonly email: string;
  readonly emailVerified: boolean;
  /** Roles asserted by the provider, if it manages them. */
  readonly roles: readonly string[];
}

export class InvalidTokenError extends Error {}

export interface AuthProvider {
  readonly id: 'dev';
  /** Rejects anything it cannot fully verify. Never trusts unsigned claims. */
  verify(token: string): Promise<VerifiedIdentity>;
}
