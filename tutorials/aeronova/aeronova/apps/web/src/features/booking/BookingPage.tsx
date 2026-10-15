import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, CheckCircle2, Download, Printer, TriangleAlert } from 'lucide-react';
import { needsAttention, type Booking, type BookingState } from '@aeronova/shared';
import { Button } from '../../components/ui/Button';
import { apiClient } from '../../services/api-client';
import { JourneyTimeline } from '../search/components/JourneyTimeline';
import { PriceBreakdown } from '../search/components/PriceBreakdown';
import { useBooking, useCancelBooking } from './booking-queries';

/**
 * The endpoint needs a bearer token, so this can't be a plain `<a href>` —
 * the browser has no way to attach one to a normal navigation. Fetch the
 * file as a Blob (the API client already carries the token) and trigger the
 * save through a throwaway object URL, the standard pattern for an
 * authenticated download in a single-page app.
 */
const useItineraryDownload = (reference: string) => {
  const [state, setState] = useState<'idle' | 'pending' | 'error'>('idle');
  const download = async () => {
    setState('pending');
    try {
      const blob = await apiClient.getItineraryPdf(reference);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `AeroNova-${reference}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setState('idle');
    } catch {
      setState('error');
    }
  };
  return { download, isPending: state === 'pending', isError: state === 'error' };
};

const CANCELLABLE: readonly BookingState[] = ['BOOKING_CONFIRMED', 'TICKETING_PENDING', 'TICKETED'];

const StateBadge = ({ state }: { state: BookingState }) => {
  const { t } = useTranslation();
  const tone = needsAttention(state)
    ? 'border-warning text-warning'
    : state === 'TICKETED' || state === 'BOOKING_CONFIRMED'
      ? 'border-success text-success'
      : state === 'CANCELLED' || state === 'FAILED'
        ? 'border-muted text-muted'
        : 'border-info text-info';
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-caption font-semibold ${tone}`}>
      {t(`trips.states.${state}`)}
    </span>
  );
};

/** Confirmation and trip detail: the same page, reached from checkout or from Trips. */
export const BookingPage = () => {
  const { t } = useTranslation();
  const { reference = '' } = useParams();
  const query = useBooking(reference);
  const cancel = useCancelBooking();
  const pdf = useItineraryDownload(reference);
  const booking: Booking | undefined = query.data;

  if (query.isPending) return <p className="content-width py-16 text-muted">{t('detail.checking')}</p>;
  if (query.isError || !booking) {
    return (
      <section className="content-width py-16">
        <h1 className="text-headline font-semibold">{t('errors.notFoundTitle')}</h1>
        <Link to="/trips" className="mt-4 inline-block font-semibold text-primary underline">
          {t('confirmation.viewTrips')}
        </Link>
      </section>
    );
  }

  const ticketed = booking.state === 'TICKETED';
  return (
    <div className="content-width space-y-6 py-8">
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          {needsAttention(booking.state) ? (
            <TriangleAlert aria-hidden className="size-7 text-warning" />
          ) : (
            <CheckCircle2 aria-hidden className="size-7 text-success" />
          )}
          <h1 className="text-headline font-semibold">
            {t(booking.simulated ? 'confirmation.demoTitle' : 'confirmation.title')}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <p className="text-body-sm text-muted">
            {t('confirmation.reference')}:{' '}
            <strong className="font-mono text-body text-fg tabular">{booking.reference}</strong>
          </p>
          <StateBadge state={booking.state} />
          <p className="text-body-sm text-muted">
            {t('confirmation.contactLine', { email: booking.contact.email })}
          </p>
        </div>
        {needsAttention(booking.state) && (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-control bg-surface-muted px-3 py-2 text-body-sm"
          >
            <AlertTriangle aria-hidden className="mt-0.5 size-4 shrink-0 text-warning" />
            {t('confirmation.needsAttention')}
          </p>
        )}
        {booking.simulated && (
          <p className="rounded-control border border-warning px-3 py-2 text-body-sm font-semibold text-warning">
            {t('confirmation.demoTicket')}
          </p>
        )}
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section
          aria-label={t('booking.summary.title')}
          className="space-y-6 rounded-panel border border-border bg-surface p-4 sm:p-5"
        >
          {booking.snapshot.offer.journeys.map((j) => (
            <JourneyTimeline key={j.id} journey={j} />
          ))}
        </section>

        <div className="space-y-5">
          <section
            aria-labelledby="travellers-heading"
            className="rounded-panel border border-border bg-surface p-4"
          >
            <h2
              id="travellers-heading"
              className="mb-2 font-sans text-body font-semibold [font-stretch:100%]"
            >
              {t('confirmation.travellers')}
            </h2>
            <ul className="space-y-1 text-body-sm">
              {booking.passengers.map((p) => (
                <li key={p.id}>
                  {[p.givenName, p.familyName].join(' ')}
                  <span className="text-muted">
                    {' '}
                    · {t(`booking.passengerTitles.${p.type}`, { n: '' }).trim()}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {booking.tickets.length > 0 && (
            <section
              aria-labelledby="tickets-heading"
              className="rounded-panel border border-border bg-surface p-4"
            >
              <h2 id="tickets-heading" className="mb-2 font-sans text-body font-semibold [font-stretch:100%]">
                {t('confirmation.tickets')}
              </h2>
              <ul className="space-y-1 font-mono text-body-sm tabular">
                {booking.tickets.map((ticket) => (
                  <li key={ticket.id}>{ticket.number}</li>
                ))}
              </ul>
            </section>
          )}

          <PriceBreakdown price={booking.snapshot.offer.price} />

          <div className="flex flex-wrap gap-2">
            <Button busy={pdf.isPending} onClick={() => void pdf.download()}>
              <Download aria-hidden className="size-4" />
              {pdf.isPending ? t('confirmation.downloadingPdf') : t('confirmation.downloadPdf')}
            </Button>
            <Button variant="secondary" onClick={() => window.print()}>
              <Printer aria-hidden className="size-4" />
              {t('confirmation.print')}
            </Button>
            {CANCELLABLE.includes(booking.state) && (
              <Button
                variant="ghost"
                busy={cancel.isPending}
                onClick={() => cancel.mutate(booking.reference)}
              >
                {cancel.isPending ? t('confirmation.cancelling') : t('confirmation.cancel')}
              </Button>
            )}
          </div>
          {cancel.isError && (
            <p role="alert" className="text-body-sm text-danger">
              {t('confirmation.cancelFailed')}
            </p>
          )}
          {pdf.isError && (
            <p role="alert" className="text-body-sm text-danger">
              {t('confirmation.downloadFailed')}
            </p>
          )}
          {ticketed && <p className="text-caption text-muted">{t('booking.demoBanner')}</p>}
        </div>
      </div>

      <section aria-labelledby="history-heading">
        <h2 id="history-heading" className="mb-2 font-sans text-body font-semibold [font-stretch:100%]">
          {t('confirmation.history')}
        </h2>
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
