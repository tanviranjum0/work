import { describe, expect, it } from 'vitest';
import { InMemoryUserRepository } from '../../repositories/in-memory.js';
import type { VerifiedIdentity } from '../../auth/auth-provider.js';
import { AccountService } from './account-service.js';

const identity: VerifiedIdentity = {
  subject: 'user-sub-1',
  email: 'new@example.com',
  emailVerified: true,
  roles: [],
};

describe('AccountService.resolveUser', () => {
  it('creates a user on first sign-in and reuses it on the next one', async () => {
    const service = new AccountService({
      users: new InMemoryUserRepository(),
      travelers: undefined as never,
      savedSearches: undefined as never,
    });
    const first = await service.resolveUser(identity, 'dev');
    const second = await service.resolveUser(identity, 'dev');
    expect(second.id).toBe(first.id);
  });

  it('resolves two concurrent first-sign-ins to the same user instead of one failing', async () => {
    // Simulates two authenticated requests arriving together for a brand-new
    // identity — e.g. two tabs open right after signing in.
    const service = new AccountService({
      users: new InMemoryUserRepository(),
      travelers: undefined as never,
      savedSearches: undefined as never,
    });
    const [a, b] = await Promise.all([
      service.resolveUser(identity, 'dev'),
      service.resolveUser(identity, 'dev'),
    ]);
    expect(a.id).toBe(b.id);
  });

  it('only ever creates one local user for the identity, win or lose the race', async () => {
    const users = new InMemoryUserRepository();
    const service = new AccountService({
      users,
      travelers: undefined as never,
      savedSearches: undefined as never,
    });
    await Promise.all(Array.from({ length: 5 }, () => service.resolveUser(identity, 'dev')));
    expect(await users.findByEmail(identity.email)).toBeDefined();
    // findBySubject after all settle should still be exactly one record for this identity.
    const found = await users.findBySubject('dev', identity.subject);
    expect(found?.email).toBe(identity.email);
  });
});
