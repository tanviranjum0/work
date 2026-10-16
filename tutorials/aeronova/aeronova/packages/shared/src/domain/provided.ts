/**
 * Supplier data is frequently incomplete. Rather than defaulting unknown values
 * (e.g. "1 bag"), every optional fact is explicitly provided or not, and the UI
 * is forced by the type system to render "Not provided" for the latter.
 */
export type MaybeProvided<T> =
  { readonly status: 'provided'; readonly value: T } | { readonly status: 'not_provided' };

export const provided = <T>(value: T): MaybeProvided<T> => ({ status: 'provided', value });
export const notProvided: MaybeProvided<never> = Object.freeze({ status: 'not_provided' });

export const valueOr = <T, F>(m: MaybeProvided<T>, fallback: F): T | F =>
  m.status === 'provided' ? m.value : fallback;
