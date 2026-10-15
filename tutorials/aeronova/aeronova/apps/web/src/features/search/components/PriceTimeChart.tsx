import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import type { OfferBadge } from '@aeronova/shared';
import { formatDuration } from '../format';
import { efficientOptions, niceTicks } from '../price-time';
import type { ItineraryGroup } from '../results-model';
import { itineraryAnchor } from '../results-model';
import { money0 } from './flight-labels';

const W = 260;
const H = 180;
const PAD = { top: 10, right: 12, bottom: 30, left: 48 };

const BADGE_FILL: Partial<Record<OfferBadge, string>> = {
  best_overall: 'var(--course)',
  cheapest: 'var(--success)',
  fastest: 'var(--info)',
};

/**
 * Price against total travel time for the itineraries currently shown.
 * The line joins options that nothing else here beats on both counts.
 * Points link to their result cards; a table carries the same data.
 */
interface Props {
  readonly groups: readonly ItineraryGroup[];
  readonly locale?: string;
  /** Called before scrolling to a card, e.g. to close a sheet that covers it. */
  readonly onPointSelect?: () => void;
}

const focusCard = (anchor: string) => {
  const el = document.getElementById(anchor);
  if (!el) return;
  el.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    block: 'start',
  });
  el.querySelector<HTMLElement>('article')?.focus({ preventScroll: true });
};

export const PriceTimeChart = ({ groups, locale = 'en', onPointSelect }: Props) => {
  const { t } = useTranslation();
  const id = useId();
  const firstGroup = groups[0];
  if (!firstGroup || groups.length < 2) return null;

  const currency = firstGroup.lead.offer.price.currency;
  const points = groups.map((g) => ({
    id: g.lead.offer.itineraryKey,
    minutes: g.lead.metrics.totalTravelMinutes,
    priceMinor: g.lowestPriceMinor,
    group: g,
    label: g.lead.offer.journeys[0]?.segments[0]?.marketingCarrier.name ?? '',
  }));
  const frontier = efficientOptions(points);
  const frontierIds = new Set(frontier.map((p) => p.id));

  const minutes = points.map((p) => p.minutes);
  const prices = points.map((p) => p.priceMinor);
  const xTicks = niceTicks(Math.min(...minutes), Math.max(...minutes), 3, 60);
  const priceStep = 10 ** Math.max(2, Math.floor(Math.log10(Math.max(...prices) - Math.min(...prices) || 1)));
  const yTicks = niceTicks(Math.min(...prices), Math.max(...prices), 3, priceStep);
  // niceTicks always returns at least one value.
  const [x0 = 0, x1 = x0] = [xTicks[0], xTicks.at(-1)];
  const [y0 = 0, y1 = y0] = [yTicks[0], yTicks.at(-1)];
  const x = (m: number) => PAD.left + ((m - x0) / (x1 - x0 || 1)) * (W - PAD.left - PAD.right);
  const y = (p: number) => H - PAD.bottom - ((p - y0) / (y1 - y0 || 1)) * (H - PAD.top - PAD.bottom);
  const price = (minor: number) => money0({ amountMinor: minor, currency }, locale);

  return (
    <figure aria-labelledby={`${id}-title`} className="rounded-panel border border-border bg-surface p-4">
      <h2 id={`${id}-title`} className="font-sans text-body-sm font-semibold [font-stretch:100%]">
        {t('results.chart.title')}
      </h2>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-2 w-full overflow-visible"
        role="group"
        aria-label={t('results.chart.title')}
      >
        {yTicks.map((v) => (
          <g key={`y${v}`} aria-hidden>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(v)} y2={y(v)} stroke="var(--border)" />
            <text
              x={PAD.left - 6}
              y={y(v)}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-muted text-[10px] tabular"
            >
              {price(v)}
            </text>
          </g>
        ))}
        {xTicks.map((v) => (
          <text
            key={`x${v}`}
            aria-hidden
            x={x(v)}
            y={H - PAD.bottom + 16}
            textAnchor="middle"
            className="fill-muted text-[10px] tabular"
          >
            {formatDuration(v)}
          </text>
        ))}
        <polyline
          aria-hidden
          points={frontier.map((p) => `${x(p.minutes)},${y(p.priceMinor)}`).join(' ')}
          fill="none"
          stroke="var(--control-border)"
          strokeWidth="1.25"
          strokeDasharray="3 3"
        />
        {points.map((p) => {
          const badge = p.group.lead.badges.find((b) => BADGE_FILL[b]);
          const efficient = frontierIds.has(p.id);
          return (
            <a
              key={p.id}
              href={`#${itineraryAnchor(p.id)}`}
              aria-label={t('results.chart.point', {
                airline: p.label,
                price: price(p.priceMinor),
                duration: formatDuration(p.minutes),
              })}
              className="group outline-none"
              onClick={(e) => {
                e.preventDefault();
                onPointSelect?.();
                // Let a closing sheet release the page before scrolling.
                requestAnimationFrame(() => focusCard(itineraryAnchor(p.id)));
              }}
            >
              <circle
                cx={x(p.minutes)}
                cy={y(p.priceMinor)}
                r={efficient ? 5.5 : 4}
                fill={badge ? BADGE_FILL[badge] : efficient ? 'var(--fg)' : 'var(--surface)'}
                stroke={badge ? 'var(--surface)' : 'var(--fg)'}
                strokeWidth="1.5"
              />
              <circle
                cx={x(p.minutes)}
                cy={y(p.priceMinor)}
                r="9"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2"
                className="opacity-0 group-hover:opacity-60 group-focus-visible:opacity-100"
              />
            </a>
          );
        })}
      </svg>
      <figcaption className="mt-1 space-y-1 text-caption text-muted">
        <p>{t('results.chart.axes')}</p>
        <p>{t('results.chart.frontier')}</p>
      </figcaption>
      <details className="mt-2 text-caption">
        <summary className="cursor-pointer font-semibold text-primary">{t('results.chart.table')}</summary>
        <table className="mt-2 w-full tabular">
          <thead>
            <tr className="text-left text-muted">
              <th scope="col" className="font-semibold">
                {t('results.airlines')}
              </th>
              <th scope="col" className="text-right font-semibold">
                {t('results.chart.time')}
              </th>
              <th scope="col" className="text-right font-semibold">
                {t('results.chart.price')}
              </th>
            </tr>
          </thead>
          <tbody>
            {[...points]
              .sort((a, b) => a.minutes - b.minutes)
              .map((p) => (
                <tr key={p.id}>
                  <th scope="row" className="py-0.5 text-left font-normal">
                    {p.label}
                    {frontierIds.has(p.id) && (
                      <span className="sr-only"> ({t('results.chart.efficient')})</span>
                    )}
                  </th>
                  <td className="text-right">{formatDuration(p.minutes)}</td>
                  <td className="text-right">{price(p.priceMinor)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
};
