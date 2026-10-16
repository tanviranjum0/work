import mongoose, { type Model } from 'mongoose';

// Mongoose ships CommonJS: destructure from the default export so this also
// works under Node's ESM loader, not just under the bundler.
const { Schema, model, models } = mongoose;
import { DEFAULT_PREFERENCES, ROLES, type Role, type UserPreferences } from '@aeronova/shared';

/*
 * Mongoose lives behind the repositories: these documents never leave this
 * folder. Indexes mirror the queries the repositories actually run.
 */

export interface UserDocument {
  _id: string;
  subject: string;
  authProvider: 'dev';
  email: string;
  displayName: string;
  roles: Role[];
  preferences: UserPreferences;
  passwordHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

const preferencesSchema = new Schema<UserPreferences>(
  {
    currency: { type: String, required: true, default: DEFAULT_PREFERENCES.currency },
    cabin: { type: String, required: true, default: DEFAULT_PREFERENCES.cabin },
    locale: { type: String, required: true, default: DEFAULT_PREFERENCES.locale },
    maxStops: { type: Number, default: null },
    preferredAirlines: { type: [String], default: [] },
  },
  { _id: false },
);

const userSchema = new Schema<UserDocument>(
  {
    _id: { type: String, required: true },
    subject: { type: String, required: true },
    authProvider: { type: String, required: true, enum: ['dev'] },
    email: { type: String, required: true, lowercase: true, trim: true },
    displayName: { type: String, required: true },
    roles: { type: [String], enum: ROLES, default: ['USER'] },
    preferences: { type: preferencesSchema, default: () => ({}) },
    // Only set under the dev auth provider. `select: false` keeps it out of reads
    // unless explicitly requested, so it cannot leak into a response by accident.
    passwordHash: { type: String, select: false },
  },
  { timestamps: true, versionKey: false, _id: false },
);
userSchema.index({ authProvider: 1, subject: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });

export interface TravelerDocument {
  _id: string;
  userId: string;
  title: string | null;
  givenName: string;
  middleName: string | null;
  familyName: string;
  dateOfBirth: string;
  gender: string | null;
  nationality: string | null;
  loyaltyAccounts: { airlineCode: string; number: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const travelerSchema = new Schema<TravelerDocument>(
  {
    _id: { type: String, required: true },
    userId: { type: String, required: true },
    title: { type: String, default: null },
    givenName: { type: String, required: true },
    middleName: { type: String, default: null },
    familyName: { type: String, required: true },
    // Stored as a calendar-date string so no timezone can shift it.
    dateOfBirth: { type: String, required: true },
    gender: { type: String, default: null },
    nationality: { type: String, default: null },
    loyaltyAccounts: {
      type: [new Schema({ airlineCode: String, number: String }, { _id: false })],
      default: [],
    },
  },
  { timestamps: true, versionKey: false, _id: false },
);
travelerSchema.index({ userId: 1, familyName: 1, givenName: 1 });

export interface SavedSearchDocument {
  _id: string;
  userId: string;
  label: string;
  params: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

const savedSearchSchema = new Schema<SavedSearchDocument>(
  {
    _id: { type: String, required: true },
    userId: { type: String, required: true },
    label: { type: String, required: true },
    params: { type: Map, of: String, required: true },
  },
  { timestamps: true, versionKey: false, _id: false },
);
savedSearchSchema.index({ userId: 1, createdAt: -1 });

export interface AuditEventDocument {
  _id: string;
  type: string;
  at: Date;
  actorUserId: string | null;
  actorEmail: string | null;
  requestId: string;
  context: Record<string, string>;
}

const auditEventSchema = new Schema<AuditEventDocument>(
  {
    _id: { type: String, required: true },
    type: { type: String, required: true },
    at: { type: Date, required: true },
    actorUserId: { type: String, default: null },
    actorEmail: { type: String, default: null },
    requestId: { type: String, required: true },
    context: { type: Map, of: String, default: () => ({}) },
  },
  { versionKey: false, _id: false },
);
// Listing is always "newest N, optionally of one type": one compound index serves both shapes.
auditEventSchema.index({ type: 1, at: -1 });
auditEventSchema.index({ at: -1 });

/** Reusing registered models avoids recompiling schemas on API restarts. */
export const UserModel: Model<UserDocument> =
  (models.User as Model<UserDocument>) ?? model('User', userSchema);
export const TravelerModel: Model<TravelerDocument> =
  (models.Traveler as Model<TravelerDocument>) ?? model('Traveler', travelerSchema);
export const SavedSearchModel: Model<SavedSearchDocument> =
  (models.SavedSearch as Model<SavedSearchDocument>) ?? model('SavedSearch', savedSearchSchema);
export const AuditEventModel: Model<AuditEventDocument> =
  (models.AuditEvent as Model<AuditEventDocument>) ?? model('AuditEvent', auditEventSchema);
