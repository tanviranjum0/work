import type { CabinClass } from './flight.js';
import type { CurrencyCode } from '../money/currency.js';

export const ROLES = ['USER', 'SUPPORT', 'ADMIN'] as const;
export type Role = (typeof ROLES)[number];

export interface UserPreferences {
  readonly currency: CurrencyCode;
  readonly cabin: CabinClass;
  readonly locale: 'en';
  /** Most stops per journey the traveller usually accepts; null means no preference. */
  readonly maxStops: 0 | 1 | 2 | null;
  readonly preferredAirlines: readonly string[];
}

export const DEFAULT_PREFERENCES: UserPreferences = Object.freeze({
  currency: 'USD',
  cabin: 'economy',
  locale: 'en',
  maxStops: null,
  preferredAirlines: [],
});

export interface UserProfile {
  /** Opaque public id. */
  readonly id: string;
  readonly email: string;
  readonly displayName: string;
  readonly roles: readonly Role[];
  readonly preferences: UserPreferences;
  readonly createdAt: string;
}

export const GENDERS = ['female', 'male'] as const;
export const TRAVELER_TITLES = ['mr', 'ms', 'mrs', 'miss', 'dr'] as const;

export interface LoyaltyAccount {
  readonly airlineCode: string;
  readonly number: string;
}

/**
 * A saved traveller. Identity-document numbers are deliberately absent: they
 * are collected at booking time until field-level encryption exists.
 */
export interface SavedTraveler {
  readonly id: string;
  readonly title: (typeof TRAVELER_TITLES)[number] | null;
  readonly givenName: string;
  readonly middleName: string | null;
  readonly familyName: string;
  readonly dateOfBirth: string;
  readonly gender: (typeof GENDERS)[number] | null;
  readonly nationality: string | null;
  readonly loyaltyAccounts: readonly LoyaltyAccount[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

/** URL parameters that fully describe a search (see the web app's search-url module). */
export const SAVED_SEARCH_PARAM_KEYS = [
  'trip',
  'from',
  'to',
  'depart',
  'return',
  'legs',
  'adults',
  'children',
  'infants',
  'cabin',
  'currency',
  'direct',
] as const;
export type SavedSearchParamKey = (typeof SAVED_SEARCH_PARAM_KEYS)[number];

export interface SavedSearch {
  readonly id: string;
  readonly label: string;
  readonly params: Readonly<Partial<Record<SavedSearchParamKey, string>>>;
  readonly createdAt: string;
}

export const ACCOUNT_LIMITS = Object.freeze({
  travelers: 20,
  savedSearches: 20,
  loyaltyAccountsPerTraveler: 5,
  preferredAirlines: 10,
});
