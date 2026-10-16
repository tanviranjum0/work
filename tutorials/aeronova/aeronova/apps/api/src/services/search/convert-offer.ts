import type { CurrencyCode, FlightOffer, MaybeProvided, Money } from '@aeronova/shared';
import type { CurrencyConverter } from '../currency-service.js';

const mapProvided = <T>(m: MaybeProvided<T>, fn: (v: T) => T): MaybeProvided<T> =>
  m.status === 'provided' ? { status: 'provided', value: fn(m.value) } : m;

/**
 * Converts every money field of an offer. Totals are re-derived from the
 * converted components so the breakdown still adds up exactly after rounding.
 */
export const convertOffer = (offer: FlightOffer, to: CurrencyCode, fx: CurrencyConverter): FlightOffer => {
  if (offer.price.currency === to) return offer;
  const c = (m: Money) => fx.convert(m, to);
  const p = offer.price;
  const base = c(p.base);
  const taxes = mapProvided(p.taxes, c);
  const fees = p.fees.map((f) => ({ ...f, amount: c(f.amount) }));
  const supplierTotal = {
    currency: to,
    amountMinor:
      base.amountMinor +
      (taxes.status === 'provided' ? taxes.value.amountMinor : 0) +
      fees.reduce((s, f) => s + f.amount.amountMinor, 0),
  };
  const markup = c(p.markup);
  const serviceFee = c(p.serviceFee);
  const discount = c(p.discount);
  const customerTotal = {
    currency: to,
    amountMinor:
      supplierTotal.amountMinor + markup.amountMinor + serviceFee.amountMinor - discount.amountMinor,
  };
  const penalty = (cond: FlightOffer['conditions']['refund']) =>
    mapProvided(cond, (v) => ({ ...v, penalty: mapProvided(v.penalty, c) }));

  return {
    ...offer,
    conditions: { refund: penalty(offer.conditions.refund), change: penalty(offer.conditions.change) },
    price: {
      currency: to,
      base,
      taxes,
      fees,
      supplierTotal,
      markup,
      serviceFee,
      discount,
      customerTotal,
      perPassenger: mapProvided(p.perPassenger, (lines) =>
        lines.map((l) => ({ ...l, unitTotal: c(l.unitTotal) })),
      ),
    },
  };
};
