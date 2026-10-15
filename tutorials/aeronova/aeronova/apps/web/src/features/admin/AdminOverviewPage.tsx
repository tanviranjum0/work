import { useTranslation } from 'react-i18next';
import { BOOKING_STATES, formatMoney, type CurrencyCode } from '@aeronova/shared';
import { useAdminMetrics, useAdminProviderStatus } from './admin-queries';

const Card = ({ label, value }: { label: string; value: string | number }) => (
  <div className="rounded-panel border border-border bg-surface p-4">
    <p className="text-caption text-muted">{label}</p>
    <p className="mt-1 font-display text-headline font-semibold tabular">{value}</p>
  </div>
);

export const AdminOverviewPage = () => {
  const { t } = useTranslation();
  const metrics = useAdminMetrics();
  const status = useAdminProviderStatus();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-title font-semibold">{t('admin.overview.title')}</h2>
        <p className="mt-1 measure text-muted">{t('admin.overview.lede')}</p>
      </div>

      {metrics.isError && <p className="text-danger">{t('admin.loadFailed')}</p>}
      {metrics.data && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Card label={t('admin.overview.totalUsers')} value={metrics.data.totalUsers} />
            <Card label={t('admin.overview.totalBookings')} value={metrics.data.totalBookings} />
          </div>

          <section aria-labelledby="by-state-heading">
            <h3 id="by-state-heading" className="font-sans text-body font-semibold [font-stretch:100%]">
              {t('admin.overview.byState')}
            </h3>
            <dl className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-body-sm sm:grid-cols-3">
              {BOOKING_STATES.filter((state) => metrics.data.bookingsByState[state] !== undefined).map(
                (state) => (
                  <div key={state} className="flex justify-between gap-3 border-b border-border py-1">
                    <dt className="text-muted">{t(`trips.states.${state}`)}</dt>
                    <dd className="tabular">{metrics.data.bookingsByState[state]}</dd>
                  </div>
                ),
              )}
            </dl>
          </section>

          <section aria-labelledby="by-currency-heading">
            <h3 id="by-currency-heading" className="font-sans text-body font-semibold [font-stretch:100%]">
              {t('admin.overview.byCurrency')}
            </h3>
            <dl className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-body-sm sm:grid-cols-3">
              {Object.entries(metrics.data.bookingTotalsByCurrency).map(([currency, amountMinor]) => (
                <div key={currency} className="flex justify-between gap-3 border-b border-border py-1">
                  <dt className="text-muted">{currency}</dt>
                  <dd className="tabular">
                    {formatMoney({ amountMinor: amountMinor ?? 0, currency: currency as CurrencyCode })}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </>
      )}

      <section aria-labelledby="provider-status-heading">
        <h3 id="provider-status-heading" className="font-sans text-body font-semibold [font-stretch:100%]">
          {t('admin.overview.providerStatus')}
        </h3>
        {status.isError && <p className="mt-2 text-danger">{t('admin.loadFailed')}</p>}
        {status.data && (
          <dl className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-body-sm sm:grid-cols-3">
            {[
              [t('admin.overview.appMode'), status.data.appMode],
              [t('admin.overview.flightProvider'), status.data.flightProvider],
              [t('admin.overview.bookingProvider'), status.data.bookingProvider],
              [t('admin.overview.paymentProvider'), status.data.paymentProvider],
              [t('admin.overview.ticketingProvider'), status.data.ticketingProvider],
              [t('admin.overview.authProvider'), status.data.authProvider],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-3 border-b border-border py-1">
                <dt className="text-muted">{label}</dt>
                <dd className="tabular">{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </section>
    </div>
  );
};
