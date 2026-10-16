import { describe, expect, it } from 'vitest';
import { add, CurrencyMismatchError, formatMoney, fromDecimalString, money, multiply, sum } from './money.js';

describe('money', () => {
  it('parses supplier decimal strings without float drift', () => {
    expect(fromDecimalString('742.10', 'USD')).toEqual({ amountMinor: 74210, currency: 'USD' });
    expect(fromDecimalString('0.30', 'USD').amountMinor).toBe(30);
    expect(fromDecimalString('742', 'USD').amountMinor).toBe(74200);
    expect(fromDecimalString('1200', 'JPY').amountMinor).toBe(1200);
    expect(fromDecimalString('1200.00', 'JPY').amountMinor).toBe(1200);
  });

  it('rejects precision the currency cannot represent', () => {
    expect(() => fromDecimalString('1.005', 'USD')).toThrow(RangeError);
    expect(() => fromDecimalString('12.5', 'JPY')).toThrow(RangeError);
    expect(() => fromDecimalString('abc', 'USD')).toThrow(RangeError);
  });

  it('refuses non-integer amounts and factors', () => {
    expect(() => money(10.5, 'USD')).toThrow(RangeError);
    expect(() => multiply(money(100, 'USD'), 1.5)).toThrow(RangeError);
  });

  it('never silently mixes currencies', () => {
    expect(() => add(money(1, 'USD'), money(1, 'EUR'))).toThrow(CurrencyMismatchError);
  });

  it('sums and multiplies in minor units', () => {
    const adult = money(74210, 'USD');
    expect(sum([multiply(adult, 2), money(5000, 'USD')], 'USD').amountMinor).toBe(153420);
  });

  it('formats with the currency exponent', () => {
    expect(formatMoney(money(74210, 'USD'), 'en-US')).toBe('$742.10');
    expect(formatMoney(money(1200, 'JPY'), 'en-US')).toBe('¥1,200');
  });
});
