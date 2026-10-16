import { describe, expect, it } from 'vitest';
import { duplicateKeyField } from './mongo-errors.js';

/** Shape the MongoDB Node driver (and Mongoose) actually throws on E11000. */
const e11000 = (keyPattern: Record<string, 1>) => ({
  name: 'MongoServerError',
  code: 11000,
  keyPattern,
  keyValue: Object.fromEntries(Object.keys(keyPattern).map((k) => [k, 'x'])),
  message: 'E11000 duplicate key error collection',
});

describe('duplicateKeyField', () => {
  it('names the field for each unique index on the users collection', () => {
    expect(duplicateKeyField(e11000({ email: 1 }))).toBe('email');
    expect(duplicateKeyField(e11000({ authProvider: 1, subject: 1 }))).toBe('subject');
  });

  it('does not match a non-duplicate-key error, even with the same message text', () => {
    expect(duplicateKeyField(new Error('E11000 duplicate key error collection'))).toBeUndefined();
    expect(duplicateKeyField({ code: 121, keyPattern: { email: 1 } })).toBeUndefined(); // validation error code
    expect(duplicateKeyField(undefined)).toBeUndefined();
    expect(duplicateKeyField('boom')).toBeUndefined();
  });

  it('treats a duplicate with no keyPattern (FerretDB omits it) as a duplicate, not an unknown failure', () => {
    expect(duplicateKeyField({ code: 11000, errmsg: 'E11000 duplicate key error collection: x.users' })).toBe(
      'unknown',
    );
  });

  it('does not match a duplicate key on an unrelated index', () => {
    expect(duplicateKeyField(e11000({ userId: 1, familyName: 1 }))).toBeUndefined();
  });
});
