import { CURRENCY_EXPONENTS, money, type CurrencyCode, type Money } from '@aeronova/shared';

/**
 * Demo FX table: fixed, rounded, illustrative rates (units of currency per 1 USD).
 * These are NOT live exchange rates. Responses that use them are marked
 * `conversion: 'demo_rates'` and the UI must disclose that.
 */
export const DEMO_USD_RATES: Readonly<Record<CurrencyCode, number>> = Object.freeze({
  USD: 1,
  EUR: 0.9,
  GBP: 0.78,
  BDT: 120,
  AED: 3.6725,
  SAR: 3.75,
  CAD: 1.37,
  AUD: 1.52,
  JPY: 147,
  SGD: 1.34,
});

export interface CurrencyConverter {
  readonly source: 'demo_rates';
  convert(amount: Money, to: CurrencyCode): Money;
}

/** Rounds half away from zero at the target currency's minor unit. */
export const createDemoCurrencyConverter = (rates = DEMO_USD_RATES): CurrencyConverter => ({
  source: 'demo_rates',
  convert(amount, to) {
    if (amount.currency === to) return amount;
    const fromRate = rates[amount.currency];
    const toRate = rates[to];
    const major = amount.amountMinor / 10 ** CURRENCY_EXPONENTS[amount.currency];
    const converted = (major / fromRate) * toRate;
    const minor = Math.sign(converted) * Math.round(Math.abs(converted) * 10 ** CURRENCY_EXPONENTS[to]);
    return money(minor, to);
  },
});
