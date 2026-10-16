import { randomUUID } from 'node:crypto';
import type { SavedSearch, SavedTraveler, TravelerInput, UpdateProfileInput } from '@aeronova/shared';
import { mergePreferences } from '../in-memory.js';
import {
  DuplicateUserError,
  type CreateUserInput,
  type Repositories,
  type SavedSearchRepository,
  type TravelerRepository,
  type UserRecord,
  type UserRepository,
} from '../types.js';
import { duplicateKeyField } from './mongo-errors.js';
import {
  SavedSearchModel,
  TravelerModel,
  UserModel,
  type SavedSearchDocument,
  type TravelerDocument,
  type UserDocument,
} from './models.js';

/* Documents in, domain objects out: Mongoose types never cross this boundary. */

const toUser = (d: UserDocument, withHash = false): UserRecord => ({
  id: d._id,
  subject: d.subject,
  authProvider: d.authProvider,
  email: d.email,
  displayName: d.displayName,
  roles: d.roles,
  preferences: d.preferences,
  ...(withHash ? { passwordHash: d.passwordHash } : {}),
  createdAt: d.createdAt.toISOString(),
  updatedAt: d.updatedAt.toISOString(),
});

const toTraveler = (d: TravelerDocument): SavedTraveler => ({
  id: d._id,
  title: d.title as SavedTraveler['title'],
  givenName: d.givenName,
  middleName: d.middleName,
  familyName: d.familyName,
  dateOfBirth: d.dateOfBirth,
  gender: d.gender as SavedTraveler['gender'],
  nationality: d.nationality,
  loyaltyAccounts: d.loyaltyAccounts,
  createdAt: d.createdAt.toISOString(),
  updatedAt: d.updatedAt.toISOString(),
});

const toSavedSearch = (d: SavedSearchDocument): SavedSearch => ({
  id: d._id,
  label: d.label,
  params: Object.fromEntries(
    d.params instanceof Map ? d.params : Object.entries(d.params),
  ) as SavedSearch['params'],
  createdAt: d.createdAt.toISOString(),
});

export class MongoUserRepository implements UserRepository {
  async findById(id: string) {
    const doc = await UserModel.findById(id).lean<UserDocument>().exec();
    return doc ? toUser(doc) : undefined;
  }
  /** Includes the password hash: only the login path calls this. */
  async findByEmail(email: string) {
    const doc = await UserModel.findOne({ email: email.trim().toLowerCase() })
      .select('+passwordHash')
      .lean<UserDocument>()
      .exec();
    return doc ? toUser(doc, true) : undefined;
  }
  async findBySubject(authProvider: UserRecord['authProvider'], subject: string) {
    const doc = await UserModel.findOne({ authProvider, subject }).lean<UserDocument>().exec();
    return doc ? toUser(doc) : undefined;
  }
  async create(input: CreateUserInput) {
    const { passwordHash, id: explicitId, ...rest } = input;
    try {
      const doc = await UserModel.create({
        _id: explicitId ?? randomUUID(),
        ...rest,
        roles: [...input.roles],
        // Omit the key when no password was supplied rather than storing undefined.
        ...(passwordHash === undefined ? {} : { passwordHash }),
      });
      return toUser(doc.toObject<UserDocument>(), false);
    } catch (err) {
      // A concurrent request can win the race between a caller's pre-check and
      // this insert; the unique index is the actual enforcement, so translate
      // its rejection into the same typed error the in-memory repository throws.
      const field = duplicateKeyField(err);
      if (field) throw new DuplicateUserError(field);
      throw err;
    }
  }
  async updateProfile(id: string, patch: UpdateProfileInput) {
    const current = await UserModel.findById(id).lean<UserDocument>().exec();
    if (!current) return undefined;
    const doc = await UserModel.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(patch.displayName === undefined ? {} : { displayName: patch.displayName }),
          preferences: mergePreferences(current.preferences, patch.preferences),
        },
      },
      { new: true },
    )
      .lean<UserDocument>()
      .exec();
    return doc ? toUser(doc) : undefined;
  }
  async listAll(opts: { limit: number }) {
    const docs = await UserModel.find({})
      .sort({ createdAt: -1 })
      .limit(opts.limit)
      .lean<UserDocument[]>()
      .exec();
    return docs.map((d) => toUser(d));
  }
}

export class MongoTravelerRepository implements TravelerRepository {
  async listByUser(userId: string) {
    const docs = await TravelerModel.find({ userId })
      .sort({ familyName: 1, givenName: 1 })
      .lean<TravelerDocument[]>()
      .exec();
    return docs.map(toTraveler);
  }
  /** Every query is scoped by userId, so one traveller can never be read through another account. */
  async get(userId: string, travelerId: string) {
    const doc = await TravelerModel.findOne({ _id: travelerId, userId }).lean<TravelerDocument>().exec();
    return doc ? toTraveler(doc) : undefined;
  }
  async create(userId: string, input: TravelerInput) {
    const doc = await TravelerModel.create({ _id: randomUUID(), userId, ...input });
    return toTraveler(doc.toObject<TravelerDocument>());
  }
  async update(userId: string, travelerId: string, input: TravelerInput) {
    const doc = await TravelerModel.findOneAndUpdate(
      { _id: travelerId, userId },
      { $set: input },
      { new: true },
    )
      .lean<TravelerDocument>()
      .exec();
    return doc ? toTraveler(doc) : undefined;
  }
  async remove(userId: string, travelerId: string) {
    const res = await TravelerModel.deleteOne({ _id: travelerId, userId }).exec();
    return res.deletedCount === 1;
  }
  async countByUser(userId: string) {
    return TravelerModel.countDocuments({ userId }).exec();
  }
}

export class MongoSavedSearchRepository implements SavedSearchRepository {
  async listByUser(userId: string) {
    const docs = await SavedSearchModel.find({ userId })
      .sort({ createdAt: -1 })
      .lean<SavedSearchDocument[]>()
      .exec();
    return docs.map(toSavedSearch);
  }
  async create(userId: string, input: { label: string; params: SavedSearch['params'] }) {
    const doc = await SavedSearchModel.create({
      _id: randomUUID(),
      userId,
      label: input.label,
      params: input.params,
    });
    return toSavedSearch(doc.toObject<SavedSearchDocument>());
  }
  async remove(userId: string, savedSearchId: string) {
    const res = await SavedSearchModel.deleteOne({ _id: savedSearchId, userId }).exec();
    return res.deletedCount === 1;
  }
  async countByUser(userId: string) {
    return SavedSearchModel.countDocuments({ userId }).exec();
  }
}

export const createMongoRepositories = (): Repositories => ({
  users: new MongoUserRepository(),
  travelers: new MongoTravelerRepository(),
  savedSearches: new MongoSavedSearchRepository(),
});
