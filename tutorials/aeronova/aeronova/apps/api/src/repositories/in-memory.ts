import { randomUUID } from 'node:crypto';
import {
  DEFAULT_PREFERENCES,
  type SavedSearch,
  type SavedTraveler,
  type TravelerInput,
  type UpdateProfileInput,
  type UserPreferences,
} from '@aeronova/shared';
import {
  DuplicateUserError,
  type CreateUserInput,
  type Repositories,
  type SavedSearchRepository,
  type TravelerRepository,
  type UserRecord,
  type UserRepository,
} from './types.js';

/**
 * Process-memory repositories so `npm run dev` works with no database.
 * Data is lost on restart, so this is for demo and tests only.
 */
const now = () => new Date().toISOString();
const normaliseEmail = (email: string) => email.trim().toLowerCase();

/** Applies only the keys the patch actually sets, so no field is blanked by accident. */
export const mergePreferences = (
  current: UserPreferences,
  patch: UpdateProfileInput['preferences'],
): UserPreferences => {
  if (!patch) return current;
  const entries = Object.entries(patch).filter(([, v]) => v !== undefined);
  return { ...current, ...Object.fromEntries(entries) } as UserPreferences;
};

export class InMemoryUserRepository implements UserRepository {
  private readonly byId = new Map<string, UserRecord>();

  async findById(id: string) {
    return this.byId.get(id);
  }
  async findBySubject(authProvider: UserRecord['authProvider'], subject: string) {
    return [...this.byId.values()].find((u) => u.authProvider === authProvider && u.subject === subject);
  }
  async findByEmail(email: string) {
    const target = normaliseEmail(email);
    return [...this.byId.values()].find((u) => u.email === target);
  }
  async create(input: CreateUserInput) {
    const email = normaliseEmail(input.email);
    // No `await` between the check and the write: nothing else can run in
    // between, so this closes the duplicate race completely in memory (the
    // Mongo repository has no such guarantee and handles it differently).
    for (const existing of this.byId.values()) {
      if (existing.email === email) throw new DuplicateUserError('email');
      if (existing.authProvider === input.authProvider && existing.subject === input.subject) {
        throw new DuplicateUserError('subject');
      }
    }
    const timestamp = now();
    const { id: explicitId, ...rest } = input;
    const user: UserRecord = {
      ...rest,
      id: explicitId ?? randomUUID(),
      email,
      preferences: DEFAULT_PREFERENCES,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.byId.set(user.id, user);
    return user;
  }
  async updateProfile(id: string, patch: UpdateProfileInput) {
    const current = this.byId.get(id);
    if (!current) return undefined;
    const next: UserRecord = {
      ...current,
      displayName: patch.displayName ?? current.displayName,
      preferences: mergePreferences(current.preferences, patch.preferences),
      updatedAt: now(),
    };
    this.byId.set(id, next);
    return next;
  }
  async listAll(opts: { limit: number }) {
    return [...this.byId.values()]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, opts.limit);
  }
}

export class InMemoryTravelerRepository implements TravelerRepository {
  private readonly byUser = new Map<string, SavedTraveler[]>();

  private list(userId: string) {
    return this.byUser.get(userId) ?? [];
  }
  async listByUser(userId: string) {
    return [...this.list(userId)].sort(
      (a, b) => a.familyName.localeCompare(b.familyName) || a.givenName.localeCompare(b.givenName),
    );
  }
  async get(userId: string, travelerId: string) {
    return this.list(userId).find((t) => t.id === travelerId);
  }
  async create(userId: string, input: TravelerInput) {
    const timestamp = now();
    const traveler: SavedTraveler = {
      id: randomUUID(),
      ...input,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.byUser.set(userId, [...this.list(userId), traveler]);
    return traveler;
  }
  async update(userId: string, travelerId: string, input: TravelerInput) {
    const list = this.list(userId);
    const current = list.find((t) => t.id === travelerId);
    if (!current) return undefined;
    const next: SavedTraveler = { ...current, ...input, updatedAt: now() };
    this.byUser.set(
      userId,
      list.map((t) => (t.id === travelerId ? next : t)),
    );
    return next;
  }
  async remove(userId: string, travelerId: string) {
    const list = this.list(userId);
    const next = list.filter((t) => t.id !== travelerId);
    this.byUser.set(userId, next);
    return next.length !== list.length;
  }
  async countByUser(userId: string) {
    return this.list(userId).length;
  }
}

export class InMemorySavedSearchRepository implements SavedSearchRepository {
  private readonly byUser = new Map<string, SavedSearch[]>();

  private list(userId: string) {
    return this.byUser.get(userId) ?? [];
  }
  async listByUser(userId: string) {
    return [...this.list(userId)].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  async create(userId: string, input: { label: string; params: SavedSearch['params'] }) {
    const saved: SavedSearch = {
      id: randomUUID(),
      label: input.label,
      params: input.params,
      createdAt: now(),
    };
    this.byUser.set(userId, [...this.list(userId), saved]);
    return saved;
  }
  async remove(userId: string, savedSearchId: string) {
    const list = this.list(userId);
    const next = list.filter((s) => s.id !== savedSearchId);
    this.byUser.set(userId, next);
    return next.length !== list.length;
  }
  async countByUser(userId: string) {
    return this.list(userId).length;
  }
}

export const createInMemoryRepositories = (): Repositories => ({
  users: new InMemoryUserRepository(),
  travelers: new InMemoryTravelerRepository(),
  savedSearches: new InMemorySavedSearchRepository(),
});
