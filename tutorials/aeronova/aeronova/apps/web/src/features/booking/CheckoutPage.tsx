import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useBookingEnabled } from '../../lib/use-client-config';
import { AlertTriangle, FlaskConical, Lock } from 'lucide-react';
import { createBookingInputSchema, todayInTimeZone } from '@aeronova/shared';
import { Button } from '../../components/ui/Button';
import { ApiClientError } from '../../services/api-client';
import { useAuth } from '../auth/auth-context';
import { useTravelers } from '../account/account-queries';
import { PriceBreakdown } from '../search/components/PriceBreakdown';
import { JourneyLine } from '../search/components/JourneyLine';
import { useOfferPrice } from '../search/search-queries';
import { draftFromParams } from '../search/search-url';
import { useCreateBooking } from './booking-queries';
import { emptyPassenger, PassengerForm, toPassengerPayload, type PassengerFormValues } from './PassengerForm';

const label = 'block text-caption font-semibold text-muted';
const field =
  'mt-1 h-11 w-full rounded-control border border-control-border bg-surface px-3 text-body text-fg focus:outline-2 focus:outline-offset-0 focus:outline-primary';

const localTime = (iso: string) =>
  new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

/**
 * Checkout. The price is re-checked here rather than trusted from the results
 * page, and the booking request carries the resulting quote id, so the traveller
 * can only buy a price the supplier confirmed.
 */
export const CheckoutPage = () => {
  const { t } = useTranslation();
  const bookingEnabled = useBookingEnabled();
  const { searchId = '', offerId = '' } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const draft = useMemo(() => draftFromParams(params), [params]);
  const priceCheck = useOfferPrice(searchId, offerId, Boolean(searchId && offerId));
  const travelers = useTravelers();
  const createBooking = useCreateBooking();

  const counts = { adult: draft.adults, child: draft.children, infant: draft.infants };
  const [passengers, setPassengers] = useState<PassengerFormValues[]>(() =>
    (['adult', 'child', 'infant'] as const).flatMap((type) =>
      Array.from({ length: counts[type] }, () => emptyPassenger(type)),
    ),
  );
  const [contact, setContact] = useState({ email: user?.email ?? '', phone: '' });
  const [holderName, setHolderName] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [issues, setIssues] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const quote = priceCheck.data;
  // Ticking state rather than reading the clock while rendering: the hold
  // expires on screen without the traveller having to reload.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, []);
  const expired = quote ? Date.parse(quote.expiresAt) <= now : false;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!quote) return;
    setFormError(null);
    const body = {
      quoteId: quote.quoteId,
      passengers: passengers.map(toPassengerPayload),
      contact: { email: contact.email.trim(), phone: contact.phone.trim() },
      payment: { method: 'demo_card' as const, holderName: holderName.trim() },
      acceptedTerms,
    };
    // Validate with the same schema the API uses, so problems surface next to the field.
    const parsed = createBookingInputSchema({ today: todayInTimeZone('UTC') }).safeParse(body);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[issue.path.join('.')] ??= issue.message;
      setIssues(next);
      setFormError(next.acceptedTerms ?? null);
      return;
    }
    setIssues({});
    try {
      const booking = await createBooking.mutateAsync(body);
      void navigate(`/bookings/${booking.reference}`, { replace: true });
    } catch (err) {
      if (err instanceof ApiClientError) {
        const fieldIssues: Record<string, string> = {};
        for (const issue of err.issues) fieldIssues[issue.path] ??= issue.message;
        setIssues(fieldIssues);
        setFormError(err.code === 'BOOKING_FAILED' ? err.message : (err.message ?? t('booking.failed')));
      } else {
        setFormError(t('booking.failed'));
      }
    }
  };

  if (bookingEnabled === false) {
    return <p className="content-width py-16 text-muted">{t('detail.bookingUnavailable')}</p>;
  }
  if (priceCheck.isPending) {
    return <p className="content-width py-16 text-muted">{t('detail.checking')}</p>;
  }
  if (priceCheck.isError || !quote) {
    return (
      <section className="content-width py-16">
        <p role="alert" className="text-body">
          {t('booking.expired')}
        </p>
        <Link
          className="mt-4 inline-block font-semibold text-primary underline"
          to={`/flights/${searchId}/${offerId}?${params.toString()}`}
        >
          {t('booking.recheck')}
        </Link>
      </section>
    );
  }

  return (
    <div className="content-width grid gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <form onSubmit={(e) => void onSubmit(e)} noValidate className="space-y-5">
        <div>
          <h1 className="text-headline font-semibold">{t('booking.title')}</h1>
          <p className="mt-1 measure text-muted">{t('booking.lede')}</p>
        </div>

        {quote.dataOrigin !== 'live' && (
          <p className="flex items-center gap-2 rounded-control bg-surface-muted px-3 py-2 text-body-sm">
            <FlaskConical aria-hidden className="size-4 shrink-0 text-info" />
            {t('booking.demoBanner')}
          </p>
        )}

        {passengers.map((p, i) => (
          <PassengerForm
            key={i}
            index={i}
            value={p}
            saved={travelers.data ?? []}
            issues={issues}
            onChange={(next) => setPassengers((list) => list.map((item, k) => (k === i ? next : item)))}
          />
        ))}

        <fieldset className="rounded-panel border border-border bg-surface p-4 sm:p-5">
          <legend className="px-1 font-sans text-body font-semibold [font-stretch:100%]">
            {t('booking.contact.title')}
          </legend>
          <p className="mb-4 text-caption text-muted">{t('booking.contact.lede')}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="contact-email">
                {t('booking.contact.email')}
              </label>
              <input
                id="contact-email"
                type="email"
                autoComplete="email"
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                aria-invalid={issues['contact.email'] ? true : undefined}
                className={`${field} ${issues['contact.email'] ? 'border-danger' : ''}`}
              />
              {issues['contact.email'] && (
                <p className="mt-1 text-caption text-danger">{issues['contact.email']}</p>
              )}
            </div>
            <div>
              <label className={label} htmlFor="contact-phone">
                {t('booking.contact.phone')}
              </label>
              <input
                id="contact-phone"
                type="tel"
                autoComplete="tel"
                value={contact.phone}
                onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                aria-invalid={issues['contact.phone'] ? true : undefined}
                className={`${field} ${issues['contact.phone'] ? 'border-danger' : ''}`}
              />
              {issues['contact.phone'] && (
                <p className="mt-1 text-caption text-danger">{issues['contact.phone']}</p>
              )}
            </div>
          </div>
        </fieldset>

        <fieldset className="rounded-panel border border-border bg-surface p-4 sm:p-5">
          <legend className="px-1 font-sans text-body font-semibold [font-stretch:100%]">
            {t('booking.payment.title')}
          </legend>
          <p className="mb-4 flex items-center gap-2 text-caption text-muted">
            <Lock aria-hidden className="size-4 shrink-0" />
            {t('booking.payment.demoNotice')}
          </p>
          <div className="sm:max-w-sm">
            <label className={label} htmlFor="holder">
              {t('booking.payment.holder')}
            </label>
            <input
              id="holder"
              autoComplete="cc-name"
              value={holderName}
              onChange={(e) => setHolderName(e.target.value)}
              aria-invalid={issues['payment.holderName'] ? true : undefined}
              className={`${field} ${issues['payment.holderName'] ? 'border-danger' : ''}`}
            />
            {issues['payment.holderName'] && (
              <p className="mt-1 text-caption text-danger">{issues['payment.holderName']}</p>
            )}
          </div>
        </fieldset>

        <label className="flex items-start gap-3 text-body-sm">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mt-1 size-4 shrink-0 accent-(--primary)"
          />
          <span>{t('booking.terms.label')}</span>
        </label>

        {formError && (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-control bg-surface-muted px-3 py-2 text-body-sm text-danger"
          >
            <AlertTriangle aria-hidden className="mt-0.5 size-4 shrink-0" />
            {formError}
          </p>
        )}

        <Button type="submit" size="lg" busy={createBooking.isPending} disabled={expired}>
          {createBooking.isPending ? t('booking.submitting') : t('booking.submit')}
        </Button>
        {expired && <p className="text-body-sm text-warning">{t('booking.expired')}</p>}
      </form>

      <aside className="lg:sticky lg:top-20 lg:self-start">
        <section
          aria-labelledby="summary-heading"
          className="space-y-4 rounded-panel border border-border bg-surface p-4"
        >
          <h2 id="summary-heading" className="font-sans text-body font-semibold [font-stretch:100%]">
            {t('booking.summary.title')}
          </h2>
          {quote.offer.journeys.map((j: (typeof quote.offer.journeys)[number]) => (
            <JourneyLine key={j.id} journey={j} showDate />
          ))}
          <PriceBreakdown price={quote.offer.price} />
          <p className="text-caption text-muted">
            {t('booking.summary.checked', { time: localTime(quote.checkedAt) })}
          </p>
          <p className="text-caption text-muted">
            {t('booking.summary.expires', { time: localTime(quote.expiresAt) })}
          </p>
        </section>
      </aside>
    </div>
  );
};
