import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { formatMoney } from '@aeronova/shared';
import { JourneyTimeline } from '../search/components/JourneyTimeline';
import { PriceBreakdown } from '../search/components/PriceBreakdown';
import { useAdminBooking } from './admin-queries';
import { StateBadge } from './StateBadge';

export const AdminBookingDetailPage = () => {
  const { t } = useTranslation();
  const { reference = '' } = useParams();
  const query = useAdminBooking(reference);

  if (query.isPending) return <p className="text-muted">{t('results.searching')}</p>;
  if (query.isError || !query.data) return <p className="text-danger">{t('admin.loadFailed')}</p>;
  const booking = query.data;

  return (
    <div className="space-y-6">
      <div>
        <Link to="/admin/bookings" className="text-body-sm font-semibold text-primary underline">
          ← {t('admin.bookings.title')}
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h2 className="font-mono text-title font-semibold">
            {t('admin.bookings.detailTitle', { reference: booking.reference })}
          </h2>
          <StateBadge state={booking.state} />
        </div>
        <p className="mt-1 text-body-sm text-muted">
          {t('admin.bookings.owner')}: {booking.contact.email} ({t('admin.bookings.accountId')}:{' '}
          <span className="font-mono">{booking.userId}</span>)
        </p>
      </div>

      <section
        aria-label={t('booking.summary.title')}
        className="space-y-6 rounded-panel border border-border bg-surface p-4"
      >
        {booking.snapshot.offer.journeys.map((j) => (
          <JourneyTimeline key={j.id} journey={j} />
        ))}
      </section>

      <PriceBreakdown price={booking.snapshot.offer.price} />
      <p className="text-body-sm font-semibold">{formatMoney(booking.total)}</p>

      <section aria-labelledby="admin-history-heading">
        <h3 id="admin-history-heading" className="mb-2 font-sans text-body font-semibold [font-stretch:100%]">
          {t('confirmation.history')}
        </h3>
        <ol className="space-y-1 text-body-sm text-muted">
          {booking.history.map((event) => (
            <li key={`${event.at}-${event.state}`} className="tabular">
              {new Date(event.at).toLocaleString()} — {t(`trips.states.${event.state}`)}
              {event.note ? `: ${event.note}` : ''}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
};
