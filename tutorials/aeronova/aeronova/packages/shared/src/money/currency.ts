/**
 * Supported display/settlement currencies with ISO 4217 minor-unit exponents.
 * JPY has no minor unit, so ¥1,200 is stored as amountMinor 1200.
 */
export const CURRENCY_EXPONENTS = {
  USD: 2,
  EUR: 2,
  GBP: 2,
  BDT: 2,
  AED: 2,
  SAR: 2,
  CAD: 2,
  AUD: 2,
  JPY: 0,
  SGD: 2,
} as const;

export type CurrencyCode = keyof typeof CURRENCY_EXPONENTS;
export const CURRENCY_CODES = Object.keys(CURRENCY_EXPONENTS) as [CurrencyCode, ...CurrencyCode[]];

export const isCurrencyCode = (value: string): value is CurrencyCode =>
  Object.prototype.hasOwnProperty.call(CURRENCY_EXPONENTS, value);
