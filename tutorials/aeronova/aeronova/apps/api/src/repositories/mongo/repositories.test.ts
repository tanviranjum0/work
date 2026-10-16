import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DuplicateUserError, type CreateUserInput } from '../types.js';

/*
 * The models module is mocked rather than connecting to a real MongoDB
 * (unavailable in this environment): these tests verify the repository's own
 * logic — mapping documents to domain objects and translating the driver's
 * documented E11000 error shape — not the database's behaviour itself.
 */
const create = vi.fn();
const findById = vi.fn();
vi.mock('./models.js', () => ({
  UserModel: {
    create: (...args: unknown[]) => create(...args),
    findById: (...args: unknown[]) => findById(...args),
    findOne: vi.fn(),
    findByIdAndUpdate: vi.fn(),
  },
  TravelerModel: {},
  SavedSearchModel: {},
}));

const { MongoUserRepository } = await import('./repositories.js');

const baseInput: CreateUserInput = {
  subject: 'sub-1',
  authProvider: 'dev',
  email: 'amelia@example.com',
  displayName: 'Amelia',
  roles: ['USER'],
  passwordHash: 'scrypt$...',
};

beforeEach(() => {
  create.mockReset();
  findById.mockReset();
});

describe('MongoUserRepository.create', () => {
  it('maps a created document to a UserRecord, dropping the password hash', async () => {
    const now = new Date('2026-09-19T00:00:00.000Z');
    create.mockResolvedValue({
      toObject: () => ({
        _id: 'u1',
        subject: 'sub-1',
        authProvider: 'dev',
        email: 'amelia@example.com',
        displayName: 'Amelia',
        roles: ['USER'],
        preferences: {
          currency: 'USD',
          cabin: 'economy',
          locale: 'en',
          maxStops: null,
          preferredAirlines: [],
        },
        passwordHash: 'scrypt$...',
        createdAt: now,
        updatedAt: now,
      }),
    });
    const repo = new MongoUserRepository();
    const user = await repo.create(baseInput);
    expect(user).toMatchObject({ id: 'u1', email: 'amelia@example.com', createdAt: now.toISOString() });
    expect(user).not.toHaveProperty('passwordHash');
  });

  it('translates a duplicate-email write into DuplicateUserError', async () => {
    create.mockRejectedValue({ name: 'MongoServerError', code: 11000, keyPattern: { email: 1 } });
    const repo = new MongoUserRepository();
    const err = await repo.create(baseInput).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(DuplicateUserError);
    expect((err as DuplicateUserError).field).toBe('email');
  });

  it('translates a duplicate (authProvider, subject) write into DuplicateUserError', async () => {
    create.mockRejectedValue({
      name: 'MongoServerError',
      code: 11000,
      keyPattern: { authProvider: 1, subject: 1 },
    });
    const repo = new MongoUserRepository();
    const err = await repo.create(baseInput).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(DuplicateUserError);
    expect((err as DuplicateUserError).field).toBe('subject');
  });

  it('never disguises an unrelated failure as a duplicate', async () => {
    create.mockRejectedValue(new Error('connection reset'));
    const repo = new MongoUserRepository();
    const err = await repo.create(baseInput).catch((e: unknown) => e);
    expect(err).not.toBeInstanceOf(DuplicateUserError);
    expect((err as Error).message).toBe('connection reset');
  });
});
