import { useTranslation } from 'react-i18next';
import { formatMoney, type PriceBreakdown as Price } from '@aeronova/shared';

/** Never just a number: every component of the total is shown. */
export const PriceBreakdown = ({ price, locale = 'en' }: { price: Price; locale?: string }) => {
  const { t } = useTranslation();
  const f = (m: Parameters<typeof formatMoney>[0]) => formatMoney(m, locale);
  const rows: [string, string][] = [
    [t('results.baseFare'), f(price.base)],
    [t('results.taxes'), price.taxes.status === 'provided' ? f(price.taxes.value) : t('results.notProvided')],
    ...price.fees.map((fee): [string, string] => [fee.label, f(fee.amount)]),
  ];
  if (price.serviceFee.amountMinor) rows.push([t('results.serviceFee'), f(price.serviceFee)]);
  if (price.discount.amountMinor) rows.push([t('results.discount'), `−${f(price.discount)}`]);

  return (
    <section aria-label={t('results.breakdown')} className="rounded-control border border-border p-3">
      <h4 className="mb-2 font-sans text-body-sm font-semibold [font-stretch:100%]">
        {t('results.breakdown')}
      </h4>
      <dl className="space-y-1 text-body-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-3">
            <dt className="text-muted">{label}</dt>
            <dd className="tabular">{value}</dd>
          </div>
        ))}
        {price.perPassenger.status === 'provided' && price.perPassenger.value.length > 0 && (
          <div className="border-t border-border pt-1.5">
            {price.perPassenger.value.map((l) => (
              <div key={l.passengerType} className="flex justify-between gap-3">
                <dt className="text-muted">
                  {t('results.travellersLine', {
                    count: l.count,
                    type: t(`results.passengerTypes.${l.passengerType}`),
                  })}
                </dt>
                <dd className="tabular">{t('results.each', { price: f(l.unitTotal) })}</dd>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-between gap-3 border-t border-border pt-1.5 font-semibold">
          <dt>{t('results.total')}</dt>
          <dd className="tabular">{f(price.customerTotal)}</dd>
        </div>
      </dl>
    </section>
  );
};
