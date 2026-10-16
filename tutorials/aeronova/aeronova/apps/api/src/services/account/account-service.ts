import {
  ACCOUNT_LIMITS,
  DEFAULT_PREFERENCES,
  ERROR_CODES,
  type SavedSearch,
  type SavedSearchInput,
  type SavedTraveler,
  type TravelerInput,
  type UpdateProfileInput,
  type UserProfile,
} from '@aeronova/shared';
import { AppError, NotFoundError } from '../../errors/app-error.js';
import { DuplicateUserError } from '../../repositories/types.js';
import type { AuthProvider, VerifiedIdentity } from '../../auth/auth-provider.js';
import type { Repositories, UserRecord } from '../../repositories/types.js';

const limitReached = (what: string, limit: number) =>
  new AppError(ERROR_CODES.VALIDATION_ERROR, 409, `You can save up to ${limit} ${what}. Remove one first.`);

export const toProfile = (u: UserRecord): UserProfile => ({
  id: u.id,
  email: u.email,
  displayName: u.displayName,
  roles: u.roles,
  preferences: u.preferences ?? DEFAULT_PREFERENCES,
  createdAt: u.createdAt,
});

/**
 * Account operations. Every method takes the acting user's id and scopes its
 * queries by it, so a guessed identifier can never reach another account's data.
 */
export class AccountService {
  constructor(private readonly repos: Repositories) {}

  /** First sign-in creates the local user record. */
  async resolveUser(identity: VerifiedIdentity, provider: AuthProvider['id']): Promise<UserRecord> {
    const existing = await this.repos.users.findBySubject(provider, identity.subject);
    if (existing) return existing;
    const roles = identity.roles.filter(
      (r): r is UserRecord['roles'][number] => r === 'USER' || r === 'SUPPORT' || r === 'ADMIN',
    );
    try {
      return await this.repos.users.create({
        subject: identity.subject,
        authProvider: provider,
        email: identity.email,
        displayName: identity.email.split('@')[0] ?? 'Traveller',
        roles: roles.length > 0 ? roles : ['USER'],
      });
    } catch (err) {
      // This runs on every request for a brand-new signed-in identity, so two
      // requests racing here is routine, not exceptional (e.g. two tabs, or a
      // page firing several authenticated calls right after sign-in). The
      // loser should resolve to what the winner created, not fail the request.
      if (err instanceof DuplicateUserError) {
        const winner = await this.repos.users.findBySubject(provider, identity.subject);
        if (winner) return winner;
      }
      throw err;
    }
  }

  async updateProfile(userId: string, patch: UpdateProfileInput): Promise<UserProfile> {
    const updated = await this.repos.users.updateProfile(userId, patch);
    if (!updated) throw new NotFoundError('Account not found.');
    return toProfile(updated);
  }

  /** Admin only: the route layer enforces the ADMIN role before calling this. */
  async adminListUsers(limit: number): Promise<UserProfile[]> {
    const users = await this.repos.users.listAll({ limit });
    return users.map(toProfile);
  }

  listTravelers(userId: string): Promise<SavedTraveler[]> {
    return this.repos.travelers.listByUser(userId);
  }

  async createTraveler(userId: string, input: TravelerInput): Promise<SavedTraveler> {
    if ((await this.repos.travelers.countByUser(userId)) >= ACCOUNT_LIMITS.travelers) {
      throw limitReached('travellers', ACCOUNT_LIMITS.travelers);
    }
    return this.repos.travelers.create(userId, input);
  }

  async updateTraveler(userId: string, travelerId: string, input: TravelerInput): Promise<SavedTraveler> {
    const updated = await this.repos.travelers.update(userId, travelerId, input);
    if (!updated) throw new NotFoundError('We could not find that traveller.');
    return updated;
  }

  async deleteTraveler(userId: string, travelerId: string): Promise<void> {
    if (!(await this.repos.travelers.remove(userId, travelerId))) {
      throw new NotFoundError('We could not find that traveller.');
    }
  }

  listSavedSearches(userId: string): Promise<SavedSearch[]> {
    return this.repos.savedSearches.listByUser(userId);
  }

  async createSavedSearch(userId: string, input: SavedSearchInput): Promise<SavedSearch> {
    if ((await this.repos.savedSearches.countByUser(userId)) >= ACCOUNT_LIMITS.savedSearches) {
      throw limitReached('searches', ACCOUNT_LIMITS.savedSearches);
    }
    return this.repos.savedSearches.create(userId, { label: input.label, params: input.params });
  }

  async deleteSavedSearch(userId: string, savedSearchId: string): Promise<void> {
    if (!(await this.repos.savedSearches.remove(userId, savedSearchId))) {
      throw new NotFoundError('We could not find that saved search.');
    }
  }
}
