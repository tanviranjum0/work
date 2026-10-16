import { money } from '@aeronova/shared';
import { describe, expect, it } from 'vitest';
import { createDemoCurrencyConverter } from './currency-service.js';

describe('demo currency converter', () => {
  const fx = createDemoCurrencyConverter();
  it('converts through USD and rounds to the target minor unit', () => {
    expect(fx.convert(money(74210, 'USD'), 'BDT')).toEqual({ amountMinor: 8905200, currency: 'BDT' });
    expect(fx.convert(money(74210, 'USD'), 'JPY')).toEqual({ amountMinor: 109089, currency: 'JPY' });
    expect(fx.convert(money(1000, 'EUR'), 'GBP').amountMinor).toBe(867);
  });
  it('is identity for the same currency and labels its source', () => {
    const m = money(5, 'USD');
    expect(fx.convert(m, 'USD')).toBe(m);
    expect(fx.source).toBe('demo_rates');
  });
});
