import { useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { addDays, daysBetween, toCalendarDate, type FlexibleDateCell } from '@aeronova/shared';
import { formatWallDate } from '../format';
import { useFlexibleDates } from '../search-queries';
import { shiftSearchParams, type SearchDraft } from '../search-url';
import { money0 } from './flight-labels';

const cellClass =
  'flex min-w-[5rem] flex-1 flex-col items-center rounded-control border px-2 py-2 text-center transition-colors';

/**
 * Lowest fares for the same trip on nearby dates. Best-effort: while loading
 * it reserves its space, and if the service can't answer it disappears.
 */
export const FlexibleDates = ({
  draft,
  enabled,
  locale = 'en',
}: {
  draft: SearchDraft;
  enabled: boolean;
  locale?: string;
}) => {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const q = useFlexibleDates(draft, enabled);
  const listRef = useRef<HTMLOListElement>(null);

  // Centre "your dates" in the strip on narrow screens without scrolling the page.
  useEffect(() => {
    const list = listRef.current;
    const current = list?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!list || !current) return;
    list.scrollLeft = current.offsetLeft - (list.clientWidth - current.offsetWidth) / 2 - list.offsetLeft;
  }, [q.data]);

  if (q.isError || (q.data && !q.data.supported)) return null;

  const cells = q.data?.cells ?? [];
  const okTotals = cells.filter((c) => c.status === 'ok').map((c) => c.lowestTotal?.amountMinor ?? Infinity);
  const lowest = okTotals.length ? Math.min(...okTotals) : null;
  const first = draft.journeys[0];
  const nights =
    draft.tripType === 'round_trip' && first?.departureDate && draft.returnDate
      ? daysBetween(toCalendarDate(first.departureDate), toCalendarDate(draft.returnDate))
      : null;

  const statusText = (c: FlexibleDateCell) =>
    c.status === 'ok' && c.lowestTotal
      ? money0(c.lowestTotal, locale)
      : c.status === 'no_flights'
        ? t('results.flex.noFlights')
        : c.status === 'unavailable'
          ? t('results.flex.unavailable')
          : t('results.flex.outOfRange');

  return (
    <nav aria-label={t('results.flex.label')} aria-busy={q.isPending || undefined} className="space-y-1.5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <h2 className="font-sans text-body-sm font-semibold [font-stretch:100%]">
          {t('results.flex.label')}
        </h2>
        {nights !== null && (
          <p className="text-caption text-muted">{t('results.flex.sameLength', { count: nights })}</p>
        )}
      </div>
      <ol ref={listRef} className="relative -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {q.isPending
          ? Array.from({ length: 7 }, (_, i) => (
              <li key={i} aria-hidden className={`${cellClass} border-border`}>
                <span className="skeleton h-3 w-12 rounded" />
                <span className="skeleton mt-2 h-4 w-14 rounded" />
              </li>
            ))
          : cells.map((c) => {
              const date = c.departureDates[0] ?? '';
              const isCurrent = c.offsetDays === 0;
              const isLowest = c.status === 'ok' && c.lowestTotal?.amountMinor === lowest;
              const content = (
                <>
                  <span className="text-caption text-muted">{formatWallDate(date)}</span>
                  <span
                    className={`mt-0.5 text-body-sm tabular ${c.status === 'ok' ? 'font-semibold' : 'text-muted'} ${
                      isLowest ? 'text-success' : ''
                    }`}
                  >
                    {statusText(c)}
                  </span>
                  <span className="text-[0.6875rem] leading-tight text-muted">
                    {isCurrent ? t('results.flex.selected') : isLowest ? t('results.flex.lowest') : '\u00a0'}
                  </span>
                </>
              );
              const label = t('results.flex.cellLabel', {
                date: formatWallDate(date),
                status: `${statusText(c)}${isLowest ? `, ${t('results.flex.lowest').toLowerCase()}` : ''}`,
              });
              return (
                <li key={c.offsetDays} className="flex flex-1">
                  {isCurrent ? (
                    <span
                      aria-current="page"
                      aria-label={label}
                      className={`${cellClass} border-fg bg-surface`}
                    >
                      {content}
                    </span>
                  ) : c.status === 'out_of_range' ? (
                    <span aria-label={label} className={`${cellClass} border-transparent opacity-60`}>
                      {content}
                    </span>
                  ) : (
                    <Link
                      to={`/search?${shiftSearchParams(params, (d) => addDays(toCalendarDate(d), c.offsetDays)).toString()}`}
                      aria-label={label}
                      preventScrollReset
                      className={`${cellClass} border-border bg-surface hover:border-control-border`}
                    >
                      {content}
                    </Link>
                  )}
                </li>
              );
            })}
      </ol>
    </nav>
  );
};
