import type {
  Role,
  SavedSearch,
  SavedTraveler,
  TravelerInput,
  UpdateProfileInput,
  UserPreferences,
} from '@aeronova/shared';

/** A user as stored. `passwordHash` only exists under the dev auth provider. */
export interface UserRecord {
  readonly id: string;
  /** Identity-provider subject; unique together with the provider. */
  readonly subject: string;
  readonly authProvider: 'dev';
  readonly email: string;
  readonly displayName: string;
  readonly roles: readonly Role[];
  readonly preferences: UserPreferences;
  readonly passwordHash?: string | undefined;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CreateUserInput {
  readonly subject: string;
  readonly authProvider: 'dev';
  readonly email: string;
  readonly displayName: string;
  readonly roles: readonly Role[];
  readonly passwordHash?: string | undefined;
  /**
   * Overrides the repository's own id generation. Needed only so the dev auth
   * provider can make `id === subject` by construction: dev has no external
   * identity provider assigning `subject`, so the record's own id doubles as
   * one, and the two must be the same value for `findBySubject` to ever find
   * what the token identifies (see auth.routes.ts `/register`).
   */
  readonly id?: string | undefined;
}

/**
 * Thrown by `UserRepository.create` when the email or the (authProvider,
 * subject) pair is already taken. Two requests can both pass a pre-check and
 * race into `create` — over the network against MongoDB this is a real gap,
 * not a theoretical one — so `create` itself is the enforcement point, backed
 * by the unique indexes in repositories/mongo/models.ts.
 */
export class DuplicateUserError extends Error {
  constructor(readonly field: 'email' | 'subject' | 'unknown') {
    super(
      field === 'unknown'
        ? 'A user with these details already exists.'
        : `A user with this ${field} already exists.`,
    );
    this.name = 'DuplicateUserError';
  }
}

export interface UserRepository {
  findById(id: string): Promise<UserRecord | undefined>;
  findBySubject(authProvider: UserRecord['authProvider'], subject: string): Promise<UserRecord | undefined>;
  findByEmail(email: string): Promise<UserRecord | undefined>;
  /** @throws {DuplicateUserError} if the email or (authProvider, subject) pair is already taken. */
  create(input: CreateUserInput): Promise<UserRecord>;
  updateProfile(id: string, patch: UpdateProfileInput): Promise<UserRecord | undefined>;
  /** Admin only: every account, newest first. Callers must enforce the role check themselves. */
  listAll(opts: { limit: number }): Promise<UserRecord[]>;
}

export interface TravelerRepository {
  listByUser(userId: string): Promise<SavedTraveler[]>;
  get(userId: string, travelerId: string): Promise<SavedTraveler | undefined>;
  create(userId: string, input: TravelerInput): Promise<SavedTraveler>;
  update(userId: string, travelerId: string, input: TravelerInput): Promise<SavedTraveler | undefined>;
  remove(userId: string, travelerId: string): Promise<boolean>;
  countByUser(userId: string): Promise<number>;
}

export interface SavedSearchRepository {
  listByUser(userId: string): Promise<SavedSearch[]>;
  create(userId: string, input: { label: string; params: SavedSearch['params'] }): Promise<SavedSearch>;
  remove(userId: string, savedSearchId: string): Promise<boolean>;
  countByUser(userId: string): Promise<number>;
}

export interface Repositories {
  readonly users: UserRepository;
  readonly travelers: TravelerRepository;
  readonly savedSearches: SavedSearchRepository;
}
