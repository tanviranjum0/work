import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useBookingEnabled } from '../../lib/use-client-config';
import { cityOf } from '../search/places';
import { ArrowLeft, CircleAlert, CircleCheck, Loader2, RefreshCw } from 'lucide-react';
import type { RankedOffer } from '@aeronova/shared';
import { Button } from '../../components/ui/Button';
import { ApiClientError } from '../../services/api-client';
import { formatDuration, formatWallDate } from '../search/format';
import { useOfferPrice, useStoredSearch } from '../search/search-queries';
import { AirlineMark } from '../search/components/AirlineMark';
import { JourneyTimeline } from '../search/components/JourneyTimeline';
import { PriceBreakdown } from '../search/components/PriceBreakdown';
import { EmptyState, SearchError } from '../search/components/SearchStates';
import { FareOptions } from './FareOptions';
import { airborneMinutes, clockShiftMinutes } from './journey-facts';
import { PriceChangeDialog } from './PriceChangeDialog';

const useNow = (ms: number) => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(id);
  }, [ms]);
  return now;
};

const localTime = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(new Date(iso));

const isExpired = (e: unknown) =>
  e instanceof ApiClientError && (e.code === 'OFFER_EXPIRED' || e.status === 404);

/**
 * Stable deep link: /flights/:searchId/:offerId?<search params>. The search
 * params let an expired link re-run the same search instead of dead-ending.
 */
export const FlightDetailPage = () => {
  const { t } = useTranslation();
  const { searchId = '', offerId = '' } = useParams();
  const { search: query } = useLocation();
  const navigate = useNavigate();
  const resultsHref = `/search${query}`;
  const now = useNow(30_000);

  const search = useStoredSearch(searchId);
  const ranked: RankedOffer | undefined = search.data?.offers.find((r) => r.offer.id === offerId);
  const price = useOfferPrice(searchId, offerId, Boolean(ranked));
  const bookingEnabled = useBookingEnabled();
  const quote = price.data;

  const [accepted, setAccepted] = useState<ReadonlySet<string>>(new Set());
  const [declined, setDeclined] = useState<ReadonlySet<string>>(new Set());
  const focusFaresOnClose = useRef(false);
  const needsAcceptance = quote?.status === 'changed' && !accepted.has(quote.quoteId);
  const stale = quote ? Date.parse(quote.expiresAt) <= now : false;

  const backLink = (
    <Link
      to={resultsHref}
      className="inline-flex items-center gap-1.5 text-body-sm font-semibold text-primary hover:underline"
    >
      <ArrowLeft aria-hidden className="size-4" />
      {t('detail.back')}
    </Link>
  );

  if (search.isPending) {
    return (
      <div className="content-width flex-1 py-10" aria-busy="true">
        <p role="status" className="flex items-center gap-2 text-muted">
          <Loader2 aria-hidden className="size-4 animate-spin" />
          {t('detail.loading')}
        </p>
      </div>
    );
  }

  const gone = (title: string, body: string) => (
    <div className="content-width flex-1 space-y-4 py-10">
      {backLink}
      <EmptyState
        title={title}
        body={body}
        actions={
          query ? (
            <Link
              to={resultsHref}
              className="rounded-control bg-primary px-4 py-2 font-semibold text-on-primary hover:bg-primary-hover"
            >
              {t('detail.expired.searchAgain')}
            </Link>
          ) : (
            <Link
              to="/"
              className="rounded-control bg-primary px-4 py-2 font-semibold text-on-primary hover:bg-primary-hover"
            >
              {t('detail.expired.home')}
            </Link>
          )
        }
      />
    </div>
  );

  if (search.isError) {
    return isExpired(search.error) ? (
      gone(t('detail.missing.title'), t('detail.missing.body'))
    ) : (
      <div className="content-width flex-1 space-y-4 py-10">
        {backLink}
        <SearchError error={search.error} onRetry={() => void search.refetch()} />
      </div>
    );
  }
  if (!ranked || !search.data) return gone(t('detail.missing.title'), t('detail.missing.body'));
  if (price.isError && isExpired(price.error))
    return gone(t('detail.expired.title'), t('detail.expired.body'));

  const data = search.data;
  const { offer } = ranked;
  const fares = data.offers.filter((r) => r.offer.itineraryKey === offer.itineraryKey);
  const shownOffer = quote && !needsAcceptance ? quote.offer : offer;
  const first = offer.journeys[0];
  const carriers = [
    ...new Map(
      offer.journeys.flatMap((j) => j.segments.map((s) => [s.marketingCarrier.code, s.marketingCarrier])),
    ).values(),
  ];
  const isRoundTrip = data.query.tripType === 'round_trip';

  const status = (() => {
    if (price.isFetching) {
      return (
        <p role="status" className="flex items-center gap-2 text-body-sm text-muted">
          <Loader2 aria-hidden className="size-4 animate-spin" />
          {t('detail.checking')}
        </p>
      );
    }
    if (price.isError) {
      return (
        <div role="alert" className="space-y-2 text-body-sm">
          <p className="flex items-center gap-2 text-danger">
            <CircleAlert aria-hidden className="size-4" />
            {t('detail.priceError')}
          </p>
          <Button variant="secondary" onClick={() => void price.refetch()}>
            <RefreshCw aria-hidden className="size-4" />
            {t('detail.checkAgain')}
          </Button>
        </div>
      );
    }
    if (!quote) return <p className="text-body-sm text-muted">{t('detail.notConfirmed')}</p>;
    if (stale) {
      return (
        <div className="space-y-2 text-body-sm">
          <p className="text-warning">{t('detail.stale')}</p>
          <Button variant="secondary" onClick={() => void price.refetch()}>
            <RefreshCw aria-hidden className="size-4" />
            {t('detail.checkAgain')}
          </Button>
        </div>
      );
    }
    if (needsAcceptance) {
      return (
        <div className="space-y-2 text-body-sm">
          <p className="flex items-center gap-2 text-warning">
            <CircleAlert aria-hidden className="size-4" />
            {t('detail.changed.title')}
          </p>
          <Button
            variant="secondary"
            onClick={() => setDeclined((d) => new Set([...d].filter((id) => id !== quote.quoteId)))}
          >
            {t('detail.reviewChange')}
          </Button>
        </div>
      );
    }
    return (
      <p role="status" className="flex items-center gap-2 text-body-sm text-success">
        <CircleCheck aria-hidden className="size-4" />
        {t(quote.status === 'changed' ? 'detail.changedAccepted' : 'detail.confirmed', {
          time: localTime(quote.checkedAt),
        })}
      </p>
    );
  })();

  const fromCity = cityOf(data.places, first?.origin.iataCode ?? '');
  const toCity = cityOf(data.places, first?.destination.iataCode ?? '');

  return (
    <div className="flex-1 pb-28 lg:pb-12">
      <title>{`${fromCity} to ${toCity} · AeroNova`}</title>
      <div className="border-b border-border bg-surface">
        <div className="content-width space-y-3 py-5">
          {backLink}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex -space-x-1.5">
              {carriers.slice(0, 2).map((c) => (
                <AirlineMark key={c.code} carrier={c} />
              ))}
            </div>
            <div>
              <h1 className="text-headline font-semibold">
                {data.query.tripType === 'multi_city'
                  ? t('results.multiTitle')
                  : t('detail.title', { from: fromCity, to: toCity })}
              </h1>
              <p className="text-body-sm text-muted">
                {carriers.map((c) => c.name).join(' + ')}
                {', '}
                {offer.journeys.map((j) => formatWallDate(j.segments[0]?.departure.local ?? '')).join(' – ')}
              </p>
            </div>
          </div>
          {data.dataOrigin !== 'live' && <p className="text-caption text-muted">{t('detail.demoNotice')}</p>}
        </div>
      </div>

      <div className="content-width grid gap-8 pt-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="min-w-0 space-y-10">
          <section aria-labelledby="trip-heading" className="space-y-5">
            <h2 id="trip-heading" className="text-title font-semibold">
              {t('detail.yourTrip')}
            </h2>
            {offer.journeys.map((j, i) => {
              const shift = clockShiftMinutes(j);
              const ground = j.totalDurationMinutes - airborneMinutes(j);
              const label = isRoundTrip
                ? t(i === 0 ? 'detail.outbound' : 'detail.return')
                : t('search.flight', { n: i + 1 });
              const dest = j.destination.iataCode;
              const origin = j.origin.iataCode;
              return (
                <article
                  key={j.id}
                  aria-labelledby={`${j.id}-h`}
                  className="rounded-panel border border-border bg-surface p-4 sm:p-5"
                >
                  <h3 id={`${j.id}-h`} className="font-sans text-body font-semibold [font-stretch:100%]">
                    {t('detail.journeyHeading', { label, from: origin, to: dest })}
                  </h3>
                  <dl className="mt-3 grid grid-cols-3 gap-3 border-b border-border pb-4 text-body-sm">
                    {(
                      [
                        [t('detail.totalTime'), formatDuration(j.totalDurationMinutes)],
                        [t('detail.flyingTime'), formatDuration(airborneMinutes(j))],
                        [t('detail.groundTime'), ground > 0 ? formatDuration(ground) : '—'],
                      ] as const
                    ).map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-caption text-muted">{k}</dt>
                        <dd className="font-semibold tabular">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-4">
                    <JourneyTimeline journey={j} />
                  </div>
                  <p className="mt-3 text-caption text-muted">
                    {shift === 0
                      ? t('detail.clockSame', { airport: dest, origin })
                      : t(shift > 0 ? 'detail.clockAhead' : 'detail.clockBehind', {
                          airport: dest,
                          origin,
                          shift: formatDuration(Math.abs(shift)),
                        })}
                  </p>
                </article>
              );
            })}
          </section>

          <section aria-labelledby="fares-heading" className="space-y-3">
            <h2
              id="fares-heading"
              tabIndex={-1}
              className="scroll-mt-24 text-title font-semibold outline-none"
            >
              {t('detail.chooseFare')}
            </h2>
            <p className="measure text-body-sm text-muted">{t('detail.fareHint')}</p>
            <FareOptions
              fares={fares}
              selectedId={offer.id}
              onSelect={(id) =>
                navigate(`/flights/${encodeURIComponent(searchId)}/${encodeURIComponent(id)}${query}`, {
                  replace: true,
                  preventScrollReset: true,
                  flushSync: true,
                })
              }
            />
          </section>
        </div>

        <aside aria-labelledby="summary-heading" className="lg:sticky lg:top-20 lg:self-start">
          <div className="space-y-4 rounded-panel border border-border bg-surface p-4">
            <h2 id="summary-heading" className="font-sans text-body font-semibold [font-stretch:100%]">
              {t('detail.summary')}
            </h2>
            {status}
            <PriceBreakdown price={shownOffer.price} />
            <p className="text-caption text-muted">{t('detail.priceNote')}</p>
            <div className="space-y-2">
              {/* Booking needs a confirmed price: a changed fare must be acknowledged first. */}
              {bookingEnabled === false ? (
                <p className="text-body-sm text-muted">{t('detail.bookingUnavailable')}</p>
              ) : needsAcceptance || stale ? (
                <>
                  <Button size="lg" className="w-full" disabled aria-describedby="booking-blocked">
                    {t('detail.continue')}
                  </Button>
                  <p id="booking-blocked" className="text-caption text-muted">
                    {stale ? t('detail.stale') : t('detail.acceptFirst')}
                  </p>
                </>
              ) : (
                <Link
                  to={`/book/${searchId}/${offerId}${query}`}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-control bg-primary px-6 font-semibold text-on-primary hover:bg-primary-hover"
                >
                  {t('detail.continue')}
                </Link>
              )}
            </div>
          </div>
        </aside>
      </div>

      {quote && (
        <PriceChangeDialog
          quote={quote}
          open={needsAcceptance && !declined.has(quote.quoteId)}
          onAccept={() => setAccepted((a) => new Set(a).add(quote.quoteId))}
          onDecline={() => {
            focusFaresOnClose.current = true;
            setDeclined((d) => new Set(d).add(quote.quoteId));
          }}
          onClosed={() => {
            if (!focusFaresOnClose.current) return;
            focusFaresOnClose.current = false;
            // Take keyboard and screen-reader users to the fares, not just the viewport.
            const heading = document.getElementById('fares-heading');
            heading?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            heading?.focus({ preventScroll: true });
          }}
        />
      )}
    </div>
  );
};
