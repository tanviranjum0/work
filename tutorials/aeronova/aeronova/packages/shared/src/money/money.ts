import { CURRENCY_EXPONENTS, type CurrencyCode } from './currency.js';

/** Money is always an integer count of the currency's minor unit. Never a float. */
export interface Money {
  readonly amountMinor: number;
  readonly currency: CurrencyCode;
}

export class CurrencyMismatchError extends Error {
  constructor(a: CurrencyCode, b: CurrencyCode) {
    super(`Cannot combine ${a} with ${b} without an explicit conversion.`);
    this.name = 'CurrencyMismatchError';
  }
}

const assertInteger = (n: number, label: string): void => {
  if (!Number.isSafeInteger(n)) throw new RangeError(`${label} must be a safe integer, got ${n}`);
};

export const money = (amountMinor: number, currency: CurrencyCode): Money => {
  assertInteger(amountMinor, 'amountMinor');
  return { amountMinor, currency };
};

export const zero = (currency: CurrencyCode): Money => money(0, currency);

/**
 * Converts a supplier decimal string (e.g. "742.10") to minor units with
 * string arithmetic, so float drift can never enter a price.
 */
export const fromDecimalString = (value: string, currency: CurrencyCode): Money => {
  const match = /^(-)?(\d+)(?:\.(\d+))?$/.exec(value.trim());
  if (!match) throw new RangeError(`Invalid decimal amount: "${value}"`);
  const [, sign, whole = '0', fraction = ''] = match;
  const exponent = CURRENCY_EXPONENTS[currency];
  if (/[^0]/.test(fraction.slice(exponent))) {
    throw new RangeError(`"${value}" has more precision than ${currency} supports`);
  }
  const minor = Number(whole + fraction.slice(0, exponent).padEnd(exponent, '0'));
  return money(sign && minor !== 0 ? -minor : minor, currency);
};

export const add = (a: Money, b: Money): Money => {
  if (a.currency !== b.currency) throw new CurrencyMismatchError(a.currency, b.currency);
  return money(a.amountMinor + b.amountMinor, a.currency);
};

export const sum = (items: readonly Money[], currency: CurrencyCode): Money =>
  items.reduce<Money>((acc, item) => add(acc, item), zero(currency));

export const multiply = (a: Money, factor: number): Money => {
  assertInteger(factor, 'factor');
  return money(a.amountMinor * factor, a.currency);
};

export const toMajorNumber = (m: Money): number => m.amountMinor / 10 ** CURRENCY_EXPONENTS[m.currency];

export const formatMoney = (m: Money, locale = 'en', options: Intl.NumberFormatOptions = {}): string =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: m.currency,
    minimumFractionDigits: CURRENCY_EXPONENTS[m.currency],
    maximumFractionDigits: CURRENCY_EXPONENTS[m.currency],
    ...options,
  }).format(toMajorNumber(m));
