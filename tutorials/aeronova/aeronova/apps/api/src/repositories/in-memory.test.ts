import { describe, expect, it } from 'vitest';
import { DuplicateUserError, type CreateUserInput } from './types.js';
import { InMemoryUserRepository } from './in-memory.js';

const input = (overrides: Partial<CreateUserInput> = {}): CreateUserInput => ({
  subject: 'sub-1',
  authProvider: 'dev',
  email: 'amelia@example.com',
  displayName: 'Amelia',
  roles: ['USER'],
  ...overrides,
});

describe('InMemoryUserRepository.create', () => {
  it('rejects a second user with the same email, case- and space-insensitively', async () => {
    const repo = new InMemoryUserRepository();
    await repo.create(input());
    await expect(
      repo.create(input({ subject: 'sub-2', email: ' Amelia@Example.com ' })),
    ).rejects.toBeInstanceOf(DuplicateUserError);
  });

  it('rejects a second user with the same (authProvider, subject) even with a different email', async () => {
    const repo = new InMemoryUserRepository();
    await repo.create(input());
    const err = await repo.create(input({ email: 'other@example.com' })).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(DuplicateUserError);
    expect((err as DuplicateUserError).field).toBe('subject');
  });

  it('lets exactly one of two concurrent same-email creates win', async () => {
    const repo = new InMemoryUserRepository();
    const results = await Promise.allSettled([
      repo.create(input({ subject: 'a' })),
      repo.create(input({ subject: 'b' })),
    ]);
    const fulfilled = results.filter((r) => r.status === 'fulfilled');
    const rejected = results.filter((r) => r.status === 'rejected');
    expect(fulfilled).toHaveLength(1);
    expect(rejected).toHaveLength(1);
    expect((rejected[0] as PromiseRejectedResult).reason).toBeInstanceOf(DuplicateUserError);
  });
});
