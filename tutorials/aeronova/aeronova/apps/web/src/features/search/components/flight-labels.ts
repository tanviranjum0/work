import type { TFunction } from 'i18next';
import { formatMoney, type BaggageAllowance, type FareConditions, type Money } from '@aeronova/shared';

export const bagLabel = (t: TFunction, bag: BaggageAllowance, kind: 'checked' | 'cabin') => {
  const ns = kind === 'checked' ? 'results.bags' : 'results.cabinBag';
  switch (bag.kind) {
    case 'unknown':
      return t(`${ns}.unknown`);
    case 'none':
      return t(`${ns}.none`);
    case 'pieces': {
      const base = t(`${ns}.pieces`, { count: bag.quantity });
      return bag.maxWeightKg.status === 'provided' ? `${base}, ${bag.maxWeightKg.value} kg` : base;
    }
    case 'weight':
      return t(`${ns}.weight`, { kg: bag.totalKg });
  }
};

export const conditionLabel = (
  t: TFunction,
  c: FareConditions['refund'],
  kind: 'refund' | 'change',
  locale: string,
) => {
  if (c.status === 'not_provided') return t(`results.${kind}.unknown`);
  const base = t(`results.${kind}.${c.value.value}`);
  return c.value.value === 'allowed_with_fee' && c.value.penalty.status === 'provided'
    ? `${base} (${formatMoney(c.value.penalty.value, locale)})`
    : base;
};

export const money0 = (m: Money, locale: string) =>
  formatMoney(
    m,
    locale,
    m.amountMinor % 100 === 0 || m.currency === 'JPY'
      ? { minimumFractionDigits: 0, maximumFractionDigits: 0 }
      : {},
  );
