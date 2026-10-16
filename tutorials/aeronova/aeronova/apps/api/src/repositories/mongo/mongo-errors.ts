/**
 * Recognizes a MongoDB duplicate-key error (E11000) and names which unique
 * index it hit. Node's MongoDB driver (and Mongoose, which wraps it) sets
 * `code: 11000` and a `keyPattern` object naming the fields of the violated
 * index — documented, stable behaviour across driver versions, not something
 * tied to a specific server response we'd need a live connection to observe.
 *
 * See repositories/mongo/models.ts for the indexes this checks against:
 *   users: { email: 1 } unique, { authProvider: 1, subject: 1 } unique
 */
interface DuplicateKeyLike {
  readonly code?: unknown;
  readonly keyPattern?: unknown;
}

const hasKey = (keyPattern: unknown, key: string): boolean =>
  typeof keyPattern === 'object' && keyPattern !== null && key in keyPattern;

/**
 * Returns which users-collection unique index an E11000 hit: 'email',
 * 'subject', or 'unknown' when the server doesn't say. MongoDB includes
 * `keyPattern`; FerretDB (used for the integration tests) does not, and
 * requiring it turned a genuine duplicate into a 500. On the users collection
 * any duplicate key means "this account already exists", whichever index fired.
 */
export const duplicateKeyField = (err: unknown): 'email' | 'subject' | 'unknown' | undefined => {
  if (typeof err !== 'object' || err === null) return undefined;
  const e = err as DuplicateKeyLike;
  if (e.code !== 11000) return undefined;
  if (hasKey(e.keyPattern, 'email')) return 'email';
  if (hasKey(e.keyPattern, 'subject')) return 'subject';
  // A keyPattern naming some other index is not a users-collection duplicate we understand.
  return e.keyPattern === undefined ? 'unknown' : undefined;
};
