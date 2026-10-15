import { useId, useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, ChevronDown, Luggage, Moon, RefreshCcw } from 'lucide-react';
import type { OfferBadge, RankedOffer } from '@aeronova/shared';
import { codeshareOperators, MAX_COMPARE, type ItineraryGroup } from '../results-model';
import { bagLabel, conditionLabel, money0 } from './flight-labels';
import { AirlineMark } from './AirlineMark';
import { JourneyLine } from './JourneyLine';
import { JourneyTimeline } from './JourneyTimeline';
import { PriceBreakdown } from './PriceBreakdown';

const BADGE_STYLE: Record<OfferBadge, string> = {
  best_overall: 'border-course text-course',
  cheapest: 'border-success text-success',
  fastest: 'border-info text-info',
  best_value: 'border-control-border text-fg',
};

const insightList = (r: RankedOffer) => {
  const m = r.metrics;
  return [
    m.hasSelfTransfer === 'yes' && ({ key: 'selfTransfer', Icon: Luggage } as const),
    m.hasAirportChange && ({ key: 'airportChange', Icon: AlertTriangle } as const),
    m.hasTightConnection && ({ key: 'tight', Icon: AlertTriangle } as const),
    m.hasOvernightLayover && ({ key: 'overnight', Icon: Moon } as const),
    m.hasRedEye && ({ key: 'redEye', Icon: Moon } as const),
    m.hasLongConnection && ({ key: 'long', Icon: RefreshCcw } as const),
  ].filter((x) => x !== false);
};

interface Props {
  /** Target of the "View fares" link (the flight detail page). */
  readonly detailHref: string;
  readonly compared: boolean;
  /** False when the comparison is full and this card isn't in it. */
  readonly canCompare: boolean;
  readonly onToggleCompare: (itineraryKey: string, on: boolean) => void;
  readonly group: ItineraryGroup;
  /** Total travellers in the search; a per-adult price is shown when there is more than one. */
  readonly travellers: number;
  readonly locale?: string;
}

export const ResultCard = ({
  group,
  travellers,
  detailHref,
  compared,
  canCompare,
  onToggleCompare,
  locale = 'en',
}: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const detailsId = useId();
  const { lead } = group;
  const { offer } = lead;
  const carriers = [
    ...new Map(
      offer.journeys.flatMap((j) => j.segments.map((s) => [s.marketingCarrier.code, s.marketingCarrier])),
    ).values(),
  ];
  const operators = codeshareOperators(offer);
  const flightNumbers = offer.journeys
    .flatMap((j) => j.segments.map((s) => `${s.marketingCarrier.code} ${s.marketingFlightNumber}`))
    .join(', ');
  const adultLine =
    offer.price.perPassenger.status === 'provided'
      ? offer.price.perPassenger.value.find((l) => l.passengerType === 'adult')
      : undefined;
  const insights = insightList(lead);
  const multiJourney = offer.journeys.length > 1;
  const headingId = `${detailsId}-heading`;

  return (
    <article
      tabIndex={-1}
      aria-labelledby={headingId}
      className="rounded-panel border border-border bg-surface transition-[border-color] duration-(--duration-fast) hover:border-control-border"
    >
      <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_13rem] lg:gap-6">
        <div className="min-w-0 space-y-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <div className="flex -space-x-1.5">
              {carriers.slice(0, 2).map((c) => (
                <AirlineMark key={c.code} carrier={c} />
              ))}
            </div>
            <div className="min-w-0">
              <h3
                id={headingId}
                className="truncate font-sans text-body-sm font-semibold [font-stretch:100%]"
              >
                {carriers.map((c) => c.name).join(' + ')}
              </h3>
              <p className="truncate text-caption text-muted tabular">{flightNumbers}</p>
              {operators.length > 0 && (
                <p className="text-caption text-fg">
                  {t('results.operatedBy', { name: operators.join(', ') })}
                </p>
              )}
            </div>
            {lead.badges.length > 0 && (
              <ul className="ml-auto flex flex-wrap gap-1.5" aria-label={t('results.highlights')}>
                {lead.badges.map((b) => (
                  <li
                    key={b}
                    className={`rounded-full border px-2 py-0.5 text-caption font-semibold ${BADGE_STYLE[b]}`}
                  >
                    {t(`results.badges.${b}`)}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-3">
            {offer.journeys.map((j) => (
              <JourneyLine key={j.id} journey={j} showDate={multiJourney} />
            ))}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-caption text-muted">
            <span className="flex items-center gap-1.5">
              <Luggage aria-hidden className="size-3.5" />
              {bagLabel(t, offer.baggage.checked, 'checked')}
            </span>
            <span>{conditionLabel(t, offer.conditions.refund, 'refund', locale)}</span>
            {insights.map(({ key, Icon }) => (
              <span key={key} className="flex items-center gap-1.5 text-warning">
                <Icon aria-hidden className="size-3.5" />
                {t(`results.insights.${key}`)}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-row items-end justify-between gap-3 border-t border-border pt-4 lg:flex-col lg:items-end lg:justify-start lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
          <div className="lg:text-right">
            <p className="font-display text-headline font-semibold tabular [font-stretch:112%]">
              {money0(offer.price.customerTotal, locale)}
            </p>
            <p className="text-caption text-muted">
              {travellers > 1 && adultLine
                ? t('results.perTraveller', { price: money0(adultLine.unitTotal, locale) })
                : t('results.total')}
            </p>
            <p className="mt-1 text-caption text-muted">
              {offer.fareFamily.status === 'provided' ? offer.fareFamily.value : t('results.notProvided')}
              {group.fares.length > 1 && (
                <>
                  {', '}
                  {t('results.fareOptions', { count: group.fares.length })}
                </>
              )}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 lg:mt-auto lg:w-full">
            <Link
              to={detailHref}
              aria-describedby={headingId}
              className="inline-flex h-10 items-center justify-center rounded-control bg-primary px-4 text-body-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover lg:w-full"
            >
              {t('results.viewFares')}
            </Link>
            <div className="flex items-center gap-1 lg:w-full lg:justify-between">
              <label
                className={`flex items-center gap-1.5 rounded-control px-2 py-1.5 text-body-sm ${
                  canCompare || compared ? 'cursor-pointer hover:bg-surface-muted' : 'text-muted'
                }`}
                title={canCompare || compared ? undefined : t('results.compareLimit', { max: MAX_COMPARE })}
              >
                <input
                  type="checkbox"
                  checked={compared}
                  disabled={!canCompare && !compared}
                  aria-describedby={headingId}
                  onChange={(e) => onToggleCompare(offer.itineraryKey, e.target.checked)}
                  className="size-4 accent-(--primary)"
                />
                {t('results.compareAdd')}
              </label>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={detailsId}
                aria-describedby={headingId}
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-1 rounded-control px-2 py-1.5 text-body-sm font-semibold whitespace-nowrap text-primary hover:bg-surface-muted"
              >
                {open ? t('results.hideDetails') : t('results.details')}
                <ChevronDown
                  aria-hidden
                  className={`size-4 transition-transform duration-(--duration-base) ${open ? 'rotate-180' : ''}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div id={detailsId} hidden={!open} className="border-t border-border px-4 py-5 sm:px-5">
        {open && (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div className="space-y-6">
              {offer.journeys.map((j, i) => (
                <section
                  key={j.id}
                  aria-label={t('results.routeLabel', {
                    from: j.origin.iataCode,
                    to: j.destination.iataCode,
                  })}
                >
                  {multiJourney && (
                    <h4 className="mb-3 font-sans text-body-sm font-semibold [font-stretch:100%]">
                      {t('search.flight', { n: i + 1 })}:{' '}
                      {t('results.routeLabel', { from: j.origin.iataCode, to: j.destination.iataCode })}
                    </h4>
                  )}
                  <JourneyTimeline journey={j} />
                </section>
              ))}
            </div>
            <div className="space-y-5">
              <dl className="space-y-1.5 text-body-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">{t('results.fare')}</dt>
                  <dd className="text-right font-semibold">
                    {offer.fareFamily.status === 'provided'
                      ? offer.fareFamily.value
                      : t('results.notProvided')}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">{t('results.checkedBagLabel')}</dt>
                  <dd className="text-right">{bagLabel(t, offer.baggage.checked, 'checked')}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">{t('results.cabinBagLabel')}</dt>
                  <dd className="text-right">{bagLabel(t, offer.baggage.cabin, 'cabin')}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">{t('results.refundRules')}</dt>
                  <dd className="text-right">
                    {conditionLabel(t, offer.conditions.refund, 'refund', locale)}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">{t('results.changeRules')}</dt>
                  <dd className="text-right">
                    {conditionLabel(t, offer.conditions.change, 'change', locale)}
                  </dd>
                </div>
              </dl>
              <PriceBreakdown price={offer.price} locale={locale} />
              {group.lowestPriceMinor < offer.price.customerTotal.amountMinor && (
                <p className="text-caption text-muted">
                  {t('results.fareFrom', {
                    price: money0(
                      { amountMinor: group.lowestPriceMinor, currency: offer.price.currency },
                      locale,
                    ),
                  })}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
