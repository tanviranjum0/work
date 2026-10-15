import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import type { RankedOffer } from '@aeronova/shared';
import { formatDuration, formatWallDate, formatWallTime } from '../format';
import { maxStopsPerJourney } from '../results-model';
import { bagLabel, conditionLabel, money0 } from './flight-labels';

interface Column {
  readonly lead: RankedOffer;
  readonly href: string;
}

type Row = {
  readonly key: string;
  readonly label: string;
  readonly cell: (r: RankedOffer) => React.ReactNode;
  /** Lower is better; omitted rows have no winner. */
  readonly score?: (r: RankedOffer) => number | null;
};

const carriers = (r: RankedOffer) =>
  [...new Set(r.offer.journeys.flatMap((j) => j.segments.map((s) => s.marketingCarrier.name)))].join(' + ');

/**
 * Side-by-side comparison. A row's winner is marked with text as well as
 * colour, and only when the values actually differ.
 */
export const ComparePanel = ({
  columns,
  onRemove,
  locale = 'en',
}: {
  columns: readonly Column[];
  onRemove: (itineraryKey: string) => void;
  locale?: string;
}) => {
  const { t } = useTranslation();
  const bagScore = (r: RankedOffer) =>
    r.metrics.checkedBagIncluded === 'yes' ? 0 : r.metrics.checkedBagIncluded === 'no' ? 1 : null;

  const rows: Row[] = [
    {
      key: 'price',
      label: t('compare.rows.price'),
      cell: (r) => (
        <span className="font-display text-title font-semibold [font-stretch:110%]">
          {money0(r.offer.price.customerTotal, locale)}
        </span>
      ),
      score: (r) => r.offer.price.customerTotal.amountMinor,
    },
    {
      key: 'duration',
      label: t('compare.rows.duration'),
      cell: (r) => formatDuration(r.metrics.totalTravelMinutes),
      score: (r) => r.metrics.totalTravelMinutes,
    },
    {
      key: 'stops',
      label: t('compare.rows.stops'),
      cell: (r) =>
        t(r.offer.journeys.length > 1 ? 'results.stopsEachWay' : 'results.stopsCount', {
          count: maxStopsPerJourney(r),
        }),
      score: maxStopsPerJourney,
    },
    {
      key: 'departure',
      label: t('compare.rows.departure'),
      cell: (r) =>
        r.offer.journeys.map((j) => {
          const s = j.segments[0];
          return s ? (
            <span key={j.id} className="block">
              {formatWallTime(s.departure.local)}{' '}
              <span className="text-muted">{formatWallDate(s.departure.local)}</span>
            </span>
          ) : null;
        }),
    },
    {
      key: 'arrival',
      label: t('compare.rows.arrival'),
      cell: (r) =>
        r.offer.journeys.map((j) => {
          const s = j.segments[j.segments.length - 1];
          return s ? (
            <span key={j.id} className="block">
              {formatWallTime(s.arrival.local)}{' '}
              <span className="text-muted">{formatWallDate(s.arrival.local)}</span>
            </span>
          ) : null;
        }),
    },
    {
      key: 'bag',
      label: t('compare.rows.checkedBag'),
      cell: (r) => bagLabel(t, r.offer.baggage.checked, 'checked'),
      score: bagScore,
    },
    {
      key: 'refund',
      label: t('compare.rows.refund'),
      cell: (r) => conditionLabel(t, r.offer.conditions.refund, 'refund', locale),
    },
    {
      key: 'change',
      label: t('compare.rows.change'),
      cell: (r) => conditionLabel(t, r.offer.conditions.change, 'change', locale),
    },
    {
      key: 'fare',
      label: t('compare.rows.fare'),
      cell: (r) =>
        r.offer.fareFamily.status === 'provided' ? r.offer.fareFamily.value : t('results.notProvided'),
    },
  ];

  const winnersFor = (row: Row): Set<string> => {
    if (!row.score) return new Set();
    const scored = columns
      .map((c) => ({ key: c.lead.offer.itineraryKey, v: row.score?.(c.lead) ?? null }))
      .filter((x): x is { key: string; v: number } => x.v !== null);
    if (scored.length < 2) return new Set();
    const best = Math.min(...scored.map((x) => x.v));
    if (scored.every((x) => x.v === best)) return new Set();
    return new Set(scored.filter((x) => x.v === best).map((x) => x.key));
  };

  return (
    <div className="-mx-5 overflow-x-auto px-5">
      <table className="w-full min-w-[34rem] border-separate border-spacing-0 text-body-sm">
        <caption className="sr-only">{t('compare.title', { count: columns.length })}</caption>
        <thead>
          <tr>
            <td className="sticky left-0 z-10 w-32 bg-surface" />
            {columns.map((c) => (
              <th
                key={c.lead.offer.itineraryKey}
                scope="col"
                className="min-w-40 px-3 pb-3 text-left align-top font-normal"
              >
                <div className="flex items-start justify-between gap-2">
                  <span>
                    <span className="block font-semibold">{carriers(c.lead)}</span>
                    <span className="block text-caption text-muted tabular">
                      {c.lead.offer.journeys
                        .flatMap((j) =>
                          j.segments.map(
                            (seg) => `${seg.marketingCarrier.code} ${seg.marketingFlightNumber}`,
                          ),
                        )
                        .join(', ')}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemove(c.lead.offer.itineraryKey)}
                    aria-label={t('compare.remove', { name: carriers(c.lead) })}
                    className="grid size-7 shrink-0 place-items-center rounded-full text-muted hover:bg-surface-muted hover:text-fg"
                  >
                    <X aria-hidden className="size-4" />
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const winners = winnersFor(row);
            return (
              <tr key={row.key}>
                <th
                  scope="row"
                  className="sticky left-0 z-10 border-t border-border bg-surface py-2.5 pr-3 text-left align-top font-normal text-muted"
                >
                  {row.label}
                </th>
                {columns.map((c) => {
                  const win = winners.has(c.lead.offer.itineraryKey);
                  return (
                    <td
                      key={c.lead.offer.itineraryKey}
                      className={`border-t border-border px-3 py-2.5 align-top tabular ${win ? 'bg-surface-muted' : ''}`}
                    >
                      {row.cell(c.lead)}
                      {win && (
                        <span className="mt-1 block w-fit rounded-full border border-success px-1.5 text-caption font-semibold text-success">
                          {t('compare.best')}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
          <tr>
            <td className="sticky left-0 bg-surface" />
            {columns.map((c) => (
              <td key={c.lead.offer.itineraryKey} className="px-3 pt-3">
                <Link
                  to={c.href}
                  className="inline-flex h-9 items-center rounded-control bg-primary px-3 font-semibold text-on-primary hover:bg-primary-hover"
                >
                  {t('compare.view')}
                </Link>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
