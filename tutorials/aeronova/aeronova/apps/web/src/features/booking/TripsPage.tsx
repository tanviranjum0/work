import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useBookingEnabled } from '../../lib/use-client-config';
import { formatMoney, type Booking } from '@aeronova/shared';
import { formatWallDate } from '../search/format';
import { useTrips } from './booking-queries';

const firstDeparture = (booking: Booking) => booking.snapshot.offer.journeys[0]?.segments[0]?.departure;

export const TripsPage = () => {
  const { t } = useTranslation();
  const bookingEnabled = useBookingEnabled();
  const trips = useTrips();

  if (bookingEnabled === false) {
    return <p className="content-width py-16 text-muted">{t('trips.unavailable')}</p>;
  }
  return (
    <section aria-labelledby="trips-heading" className="content-width py-8">
      <h1 id="trips-heading" className="text-headline font-semibold">
        {t('trips.title')}
      </h1>
      <p className="mt-1 measure text-muted">{t('trips.lede')}</p>

      {trips.isPending && <p className="mt-6 text-muted">{t('results.searching')}</p>}

      {trips.data?.length === 0 && (
        <div className="mt-6 rounded-panel border border-dashed border-control-border px-6 py-10 text-center">
          <p className="font-semibold">{t('trips.empty')}</p>
          <p className="mt-1 text-body-sm text-muted">{t('trips.emptyBody')}</p>
          <Link to="/" className="mt-4 inline-block font-semibold text-primary underline">
            {t('trips.search')}
          </Link>
        </div>
      )}

      <ul className="mt-6 space-y-3">
        {(trips.data ?? []).map((booking) => {
          const departure = firstDeparture(booking);
          const last = booking.snapshot.offer.journeys.at(-1)?.segments.at(-1);
          return (
            <li key={booking.reference}>
              <Link
                to={`/bookings/${booking.reference}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-panel border border-border bg-surface px-4 py-3 hover:border-control-border"
              >
                <div>
                  <p className="font-semibold">
                    {booking.snapshot.offer.journeys[0]?.origin.iataCode} → {last?.destination.iataCode}
                  </p>
                  <p className="text-caption text-muted tabular">
                    {departure ? formatWallDate(departure.local) : ''}
                    {', '}
                    <span className="font-mono">{booking.reference}</span>
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-caption text-muted">{t(`trips.states.${booking.state}`)}</span>
                  <span className="font-semibold tabular">{formatMoney(booking.total)}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
