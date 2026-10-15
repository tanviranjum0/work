import { useTranslation } from 'react-i18next';
import type { RankedOffer } from '@aeronova/shared';
import { formatDuration } from '../format';
import { maxStopsPerJourney } from '../results-model';
import { money0 } from './flight-labels';

/** Best by `score`; ties go to the cheaper fare, so a pricier fare of the same flights never wins. */
export const pick = (list: readonly RankedOffer[], score: (r: RankedOffer) => number) =>
  [...list].sort(
    (a, b) =>
      score(a) - score(b) ||
      a.offer.price.customerTotal.amountMinor - b.offer.price.customerTotal.amountMinor ||
      a.offer.id.localeCompare(b.offer.id),
  )[0];

/**
 * "At a glance": the three offers that answer the common questions, with the
 * trade-off between them stated in plain numbers from this result set.
 */
export const IntelligencePanel = ({
  ranked,
  locale = 'en',
}: {
  ranked: readonly RankedOffer[];
  locale?: string;
}) => {
  const { t } = useTranslation();
  if (ranked.length === 0) return null;
  const price = (r: RankedOffer) => r.offer.price.customerTotal.amountMinor;
  const best = pick(ranked, (r) => -r.score);
  const cheapest = pick(ranked, price);
  const fastest = pick(ranked, (r) => r.metrics.totalTravelMinutes);
  if (!best || !cheapest || !fastest) return null;

  const rows = [
    { label: t('results.intel.bestOverall'), r: best, accent: 'text-course' },
    { label: t('results.intel.cheapest'), r: cheapest, accent: 'text-success' },
    { label: t('results.intel.fastest'), r: fastest, accent: 'text-info' },
  ];

  const sameItinerary = cheapest.offer.itineraryKey === fastest.offer.itineraryKey;
  const extraMinutes = cheapest.metrics.totalTravelMinutes - fastest.metrics.totalTravelMinutes;
  const pctCheaper = Math.round(((price(fastest) - price(cheapest)) / price(fastest)) * 100);
  const cur = cheapest.offer.price.currency;

  return (
    <section aria-labelledby="intel-heading" className="rounded-panel border border-border bg-surface p-4">
      <h2 id="intel-heading" className="mb-3 font-sans text-body-sm font-semibold [font-stretch:100%]">
        {t('results.intel.heading')}
      </h2>
      <dl className="divide-y divide-border">
        {rows.map(({ label, r, accent }) => (
          <div key={label} className="py-2.5 first:pt-0">
            <dt className={`text-caption font-semibold ${accent}`}>{label}</dt>
            <dd className="mt-0.5 flex items-baseline justify-between gap-2">
              <span className="font-display text-title font-semibold tabular [font-stretch:110%]">
                {money0(r.offer.price.customerTotal, locale)}
              </span>
              <span className="text-caption text-muted tabular">
                {formatDuration(r.metrics.totalTravelMinutes)},{' '}
                {t(r.offer.journeys.length > 1 ? 'results.stopsEachWay' : 'results.stopsCount', {
                  count: maxStopsPerJourney(r),
                })}
              </span>
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 border-t border-border pt-3 text-body-sm">
        {sameItinerary || extraMinutes <= 0
          ? t('results.intel.sameOption')
          : pctCheaper > 0
            ? t('results.intel.tradeCheaper', { percent: pctCheaper, extra: formatDuration(extraMinutes) })
            : t('results.intel.tradeFaster', {
                saved: formatDuration(extraMinutes),
                price: money0({ amountMinor: price(fastest) - price(cheapest), currency: cur }, locale),
              })}
      </p>
      <p className="mt-3 text-caption text-muted">{t('results.intel.scoreNote')}</p>
    </section>
  );
};
