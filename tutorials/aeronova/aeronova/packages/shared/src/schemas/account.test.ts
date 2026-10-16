import { describe, expect, it } from 'vitest';
import { toCalendarDate } from '../dates/calendar-date.js';
import { createTravelerInputSchema, savedSearchInputSchema, updateProfileSchema } from './account.js';

const traveler = createTravelerInputSchema({ today: toCalendarDate('2026-09-17') });

describe('traveller input', () => {
  it('accepts international names and applies defaults', () => {
    const t = traveler.parse({
      givenName: 'Tanvír',
      familyName: "O'Brien-Rahman",
      dateOfBirth: '1992-04-03',
    });
    expect(t).toMatchObject({
      title: null,
      middleName: null,
      gender: null,
      nationality: null,
      loyaltyAccounts: [],
    });
    expect(
      traveler.parse({ givenName: 'তানভীর', familyName: 'আহমেদ', dateOfBirth: '1992-04-03' }).givenName,
    ).toBe('তানভীর');
  });

  it('rejects impossible or unsafe values', () => {
    const issues = (v: object) => {
      const r = traveler.safeParse({ givenName: 'A', familyName: 'B', dateOfBirth: '1990-01-01', ...v });
      return r.success ? [] : r.error.issues.map((i) => i.message);
    };
    expect(issues({ givenName: '<script>' })).toContain('Use letters, spaces, hyphens or apostrophes.');
    expect(issues({ givenName: '' })).toContain('Required.');
    expect(issues({ dateOfBirth: '2027-01-01' })).toContain('Date of birth is in the future.');
    expect(issues({ dateOfBirth: '1890-01-01' })).toContain('Check the year of birth.');
    expect(issues({ dateOfBirth: '1990-02-30' })).toContain('Use a real date in YYYY-MM-DD format.');
    expect(issues({ nationality: 'Bangladesh' })).toContain('Use a 2-letter country code, e.g. BD.');
    expect(issues({ passportNumber: 'A1234567' }).length).toBeGreaterThan(0);
    expect(
      issues({ loyaltyAccounts: Array.from({ length: 6 }, () => ({ airlineCode: 'EK', number: '1' })) })
        .length,
    ).toBeGreaterThan(0);
  });

  it('normalizes codes', () => {
    const t = traveler.parse({
      givenName: 'A',
      familyName: 'B',
      dateOfBirth: '1990-01-01',
      nationality: 'bd',
      loyaltyAccounts: [{ airlineCode: 'ek', number: 'EK123' }],
    });
    expect(t.nationality).toBe('BD');
    expect(t.loyaltyAccounts[0]?.airlineCode).toBe('EK');
  });
});

describe('profile update', () => {
  it('accepts partial preferences and rejects empty or unknown updates', () => {
    expect(updateProfileSchema.parse({ preferences: { maxStops: 1 } })).toEqual({
      preferences: { maxStops: 1 },
    });
    expect(updateProfileSchema.safeParse({}).success).toBe(false);
    expect(updateProfileSchema.safeParse({ roles: ['ADMIN'] }).success).toBe(false);
    expect(updateProfileSchema.safeParse({ preferences: { currency: 'XYZ' } }).success).toBe(false);
  });
});

describe('saved search input', () => {
  it('accepts known search parameters only', () => {
    const ok = savedSearchInputSchema.parse({
      label: 'Winter in London',
      params: {
        trip: 'round',
        from: 'DAC',
        to: 'LON',
        depart: '2026-12-20',
        return: '2027-01-05',
        adults: '1',
      },
    });
    expect(ok.params.to).toBe('LON');
    expect(
      savedSearchInputSchema.safeParse({ label: 'x', params: { trip: 'oneway', token: 'abc' } }).success,
    ).toBe(false);
    expect(savedSearchInputSchema.safeParse({ label: 'x', params: { from: 'DAC' } }).success).toBe(false);
    expect(
      savedSearchInputSchema.safeParse({ label: 'x', params: { trip: 'oneway', from: '<b>' } }).success,
    ).toBe(false);
    expect(savedSearchInputSchema.safeParse({ label: '', params: { trip: 'oneway' } }).success).toBe(false);
  });
});
