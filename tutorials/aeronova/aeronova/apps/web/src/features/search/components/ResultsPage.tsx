import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Columns3, SlidersHorizontal } from 'lucide-react';
import { addDays, toCalendarDate, type FlightSearchInput } from '@aeronova/shared';
import { Button } from '../../../components/ui/Button';
import { Sheet } from '../../../components/ui/Sheet';
import { useFlightSearch } from '../search-queries';
import { draftFromParams, paramsFromDraft, type SearchDraft } from '../search-url';
import { validateDraft } from '../search-validation';
import {
  activeFilterCount,
  computeFacets,
  filtersFromParams,
  NO_FILTERS,
  PRIORITY_PRESETS,
  itineraryAnchor,
  priorityFromParams,
  shapeResults,
  SORT_KEYS,
  sortFromParams,
  writeFilters,
  type PriorityKey,
  type ResultFilters,
  type SortKey,
  compareFromParams,
  MAX_COMPARE,
  writeCompare,
} from '../results-model';
import { SaveSearchButton } from '../../account/SaveSearchButton';
import { FilterPanel } from './FilterPanel';
import { FlexibleDates } from './FlexibleDates';
import { IntelligencePanel } from './IntelligencePanel';
import { PriceTimeChart } from './PriceTimeChart';
import { ResultCard } from './ResultCard';
import { ComparePanel } from './ComparePanel';
import { SearchConsole } from './SearchConsole';
import { EmptyState, SearchError, SearchLoading } from './SearchStates';
import { SearchSummary } from './SearchSummary';

const shiftDates = (draft: SearchDraft, days: number): string => {
  const move = (d: string) => (d ? addDays(toCalendarDate(d), days) : d);
  return paramsFromDraft({
    ...draft,
    journeys: draft.journeys.map((j) => ({ ...j, departureDate: move(j.departureDate) })),
    returnDate: move(draft.returnDate),
  }).toString();
};

export const ResultsPage = () => {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const [editing, setEditing] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const paramKey = params.toString();
  // eslint-disable-next-line react-hooks/exhaustive-deps -- params identity changes on every render; the string is the real dependency
  const draft = useMemo(() => draftFromParams(params), [paramKey]);
  const validation = useMemo(() => validateDraft(draft), [draft]);
  const search = useFlightSearch(draft, validation.ok);
  const filters = filtersFromParams(params);
  const compareKeys = compareFromParams(params);
  const [compareOpen, setCompareOpen] = useState(false);
  const sort = sortFromParams(params);
  const priority = priorityFromParams(params);

  // A new search (URL change) closes the editor.
  const [editedKey, setEditedKey] = useState(paramKey);
  if (editedKey !== paramKey) {
    setEditedKey(paramKey);
    setEditing(false);
  }

  const update = (mutate: (p: URLSearchParams) => URLSearchParams) =>
    // flushSync keeps controlled inputs from flickering back while the URL updates.
    setParams((p) => mutate(new URLSearchParams(p)), {
      replace: true,
      preventScrollReset: true,
      flushSync: true,
    });
  const setFilters = (f: ResultFilters) => update((p) => writeFilters(p, f));
  const setSort = (s: SortKey) =>
    update((p) => {
      if (s === 'recommended') p.delete('sort');
      else p.set('sort', s);
      return p;
    });
  const toggleCompare = (key: string, on: boolean) => {
    const others = compareKeys.filter((k) => k !== key);
    const next = on ? [...others, key] : others;
    if (next.length < 2) setCompareOpen(false);
    update((p) => writeCompare(p, next));
  };
  const setPriority = (k: PriorityKey) =>
    update((p) => {
      if (k === 'balanced') p.delete('priority');
      else p.set('priority', k);
      p.delete('sort');
      return p;
    });

  const data = search.data;
  const shaped = useMemo(
    () => (data ? shapeResults(data, { filters, sort, priority }) : undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- filters/sort/priority are derived from paramKey
    [data, paramKey],
  );
  const facets = useMemo(() => (data ? computeFacets(data.offers) : undefined), [data]);
  const detailHref = (offerId: string) =>
    data ? `/flights/${encodeURIComponent(data.searchId)}/${encodeURIComponent(offerId)}?${paramKey}` : '#';
  // Compared itineraries stay comparable even when a filter hides them.
  const compared = compareKeys.flatMap((key) => {
    const visible = shaped?.groups.find((g) => g.lead.offer.itineraryKey === key)?.lead;
    const lead =
      visible ??
      [...(shaped?.ranked ?? [])]
        .filter((r) => r.offer.itineraryKey === key)
        .sort((a, b) => a.offer.price.customerTotal.amountMinor - b.offer.price.customerTotal.amountMinor)[0];
    return lead ? [{ lead, href: detailHref(lead.offer.id) }] : [];
  });
  const filterCount = activeFilterCount(filters);
  const travellers = draft.adults + draft.children + draft.infants;
  const [firstJourney] = draft.journeys;
  const lastJourney = draft.journeys[draft.journeys.length - 1];

  if (!validation.ok) {
    return (
      <div className="content-width space-y-6 py-8">
        <EmptyState title={t('results.invalid.title')} body={t('results.invalid.body')} />
        <div className="rounded-panel border border-border bg-surface p-4 sm:p-6">
          <SearchConsole initial={draft} />
        </div>
      </div>
    );
  }
  const query: FlightSearchInput = validation.input;

  const filterUi = facets && (
    <FilterPanel facets={facets} filters={filters} currency={query.currency} onChange={setFilters} />
  );

  return (
    <div className="flex-1 pb-24 lg:pb-12">
      <div className="border-b border-border bg-surface">
        <div className="content-width space-y-4 py-5">
          <SearchSummary
            query={query}
            places={data?.places}
            editing={editing}
            onToggleEdit={() => setEditing((e) => !e)}
          />
          <SaveSearchButton places={data?.places} />
          <div id="edit-search" hidden={!editing}>
            {editing && (
              <SearchConsole key={paramKey} initial={draft} onSubmitted={() => setEditing(false)} />
            )}
          </div>
        </div>
      </div>

      <div className="content-width grid gap-6 pt-6 lg:grid-cols-[15.5rem_minmax(0,1fr)] xl:grid-cols-[15.5rem_minmax(0,1fr)_17rem]">
        <aside aria-label={t('results.filters')} className="hidden lg:block">
          <div className="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto pr-1">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-sans text-body font-semibold [font-stretch:100%]">
                {t('results.filters')}
              </h2>
              {filterCount > 0 && (
                <button
                  type="button"
                  onClick={() => setFilters(NO_FILTERS)}
                  className="text-body-sm font-semibold text-primary"
                >
                  {t('results.clearFilters')}
                </button>
              )}
            </div>
            {filterUi}
          </div>
        </aside>

        <section aria-labelledby="results-heading" className="min-w-0 space-y-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2
                id="results-heading"
                className="font-sans text-body font-semibold [font-stretch:100%]"
                aria-live="polite"
              >
                {shaped &&
                  (shaped.groups.length === shaped.totalItineraries
                    ? t('results.count', { count: shaped.totalItineraries })
                    : t('results.countFiltered', {
                        shown: shaped.groups.length,
                        total: shaped.totalItineraries,
                      }))}
              </h2>
              <label className="flex items-center gap-2 text-body-sm">
                <span className="text-muted">{t('results.sort')}</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="h-9 rounded-control border border-control-border bg-surface px-2 font-semibold"
                >
                  {SORT_KEYS.map((k) => (
                    <option key={k} value={k}>
                      {t(`results.sorts.${k}`)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <fieldset className="flex flex-wrap items-center gap-2">
              <legend className="sr-only">{t('results.priority')}</legend>
              <span aria-hidden className="mr-1 text-body-sm text-muted">
                {t('results.priority')}
              </span>
              {(Object.keys(PRIORITY_PRESETS) as PriorityKey[]).map((k) => (
                <label
                  key={k}
                  className="cursor-pointer rounded-full border border-border px-3 py-1 text-body-sm transition-colors hover:border-control-border has-checked:border-fg has-checked:bg-fg has-checked:text-bg has-focus-visible:outline-2 has-focus-visible:outline-primary"
                >
                  <input
                    type="radio"
                    name="priority"
                    className="sr-only"
                    checked={priority === k}
                    onChange={() => setPriority(k)}
                  />
                  {t(`results.priorities.${k}`)}
                </label>
              ))}
            </fieldset>
          </div>

          <FlexibleDates draft={draft} enabled={search.isSuccess} />

          {data && (data.dataOrigin !== 'live' || data.conversion === 'demo_rates' || data.truncated) && (
            <div className="space-y-1 rounded-control bg-surface-muted px-3 py-2 text-caption text-fg">
              {data.dataOrigin === 'demo' && <p>{t('results.demoData')}</p>}
              {data.dataOrigin === 'sandbox' && <p>{t('results.sandboxData')}</p>}
              {data.conversion === 'demo_rates' && <p>{t('results.demoRates')}</p>}
              {data.truncated && (
                <p>{t('results.truncated', { shown: data.offers.length, total: data.totalOffers })}</p>
              )}
            </div>
          )}

          {search.isPending && (
            <SearchLoading from={firstJourney?.origin ?? ''} to={lastJourney?.destination ?? ''} />
          )}
          {search.isError && <SearchError error={search.error} onRetry={() => void search.refetch()} />}

          {shaped && data && data.offers.length === 0 && (
            <EmptyState
              title={t('results.empty.title')}
              body={t('results.empty.body')}
              actions={
                <>
                  <Link
                    className="rounded-control border border-control-border px-3 py-2 text-body-sm font-semibold hover:bg-surface-muted"
                    to={`/search?${shiftDates(draft, -1)}`}
                  >
                    {t('results.empty.dayBefore')}
                  </Link>
                  <Link
                    className="rounded-control border border-control-border px-3 py-2 text-body-sm font-semibold hover:bg-surface-muted"
                    to={`/search?${shiftDates(draft, 1)}`}
                  >
                    {t('results.empty.dayAfter')}
                  </Link>
                  {draft.directOnly && (
                    <Link
                      className="rounded-control border border-control-border px-3 py-2 text-body-sm font-semibold hover:bg-surface-muted"
                      to={`/search?${paramsFromDraft({ ...draft, directOnly: false }).toString()}`}
                    >
                      {t('results.empty.allowStops')}
                    </Link>
                  )}
                </>
              }
            />
          )}

          {shaped && data && data.offers.length > 0 && shaped.groups.length === 0 && (
            <EmptyState
              title={t('results.filteredEmpty.title')}
              body={t('results.filteredEmpty.body', { count: shaped.totalItineraries })}
              actions={
                <Button variant="secondary" onClick={() => setFilters(NO_FILTERS)}>
                  {t('results.clearFilters')}
                </Button>
              }
            />
          )}

          {shaped && shaped.groups.length > 0 && (
            <>
              <ol className="space-y-3">
                {shaped.groups.map((g) => (
                  <li
                    key={g.lead.offer.itineraryKey}
                    id={itineraryAnchor(g.lead.offer.itineraryKey)}
                    className="scroll-mt-24"
                  >
                    <ResultCard
                      group={g}
                      travellers={travellers}
                      detailHref={detailHref(g.lead.offer.id)}
                      compared={compareKeys.includes(g.lead.offer.itineraryKey)}
                      canCompare={compareKeys.length < MAX_COMPARE}
                      onToggleCompare={toggleCompare}
                    />
                  </li>
                ))}
              </ol>
              <p className="text-caption text-muted">{t('results.priceNote')}</p>
            </>
          )}
        </section>

        <aside className="hidden xl:block" aria-label={t('results.intel.heading')}>
          <div className="sticky top-20 space-y-3">
            {shaped && shaped.ranked.length > 0 && <IntelligencePanel ranked={shaped.ranked} />}
            {shaped && <PriceTimeChart groups={shaped.groups} />}
            {priority !== 'balanced' && (
              <p className="text-caption text-muted">{t('results.priorityHint')}</p>
            )}
          </div>
        </aside>
      </div>

      {facets && (
        <>
          <div
            className={`fixed inset-x-0 bottom-0 z-(--z-sticky) flex gap-3 border-t border-border bg-bg/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-sm lg:inset-x-auto lg:bottom-5 lg:left-1/2 lg:-translate-x-1/2 lg:rounded-panel lg:border lg:bg-surface lg:p-2 lg:shadow-float ${
              compared.length ? '' : 'lg:hidden'
            }`}
          >
            <Button variant="secondary" className="flex-1 lg:hidden" onClick={() => setSheetOpen(true)}>
              <SlidersHorizontal aria-hidden className="size-4" />
              {filterCount > 0 ? t('results.filtersWithCount', { count: filterCount }) : t('results.filters')}
            </Button>
            {compared.length > 0 && (
              <>
                <Button
                  variant={compared.length >= 2 ? 'primary' : 'secondary'}
                  className="flex-1 lg:flex-none"
                  disabled={compared.length < 2}
                  title={compared.length < 2 ? t('compare.hint') : undefined}
                  onClick={() => setCompareOpen(true)}
                >
                  <Columns3 aria-hidden className="size-4" />
                  {t('compare.open', { count: compared.length })}
                </Button>
                <Button
                  variant="ghost"
                  className="hidden lg:inline-flex"
                  onClick={() => update((p) => writeCompare(p, []))}
                >
                  {t('compare.clear')}
                </Button>
              </>
            )}
          </div>
          {compared.length >= 2 && (
            <Sheet
              open={compareOpen}
              onClose={() => setCompareOpen(false)}
              title={t('compare.title', { count: compared.length })}
              closeLabel={t('search.closeEdit')}
              size="wide"
            >
              <ComparePanel columns={compared} onRemove={(key) => toggleCompare(key, false)} />
            </Sheet>
          )}
          <Sheet
            open={sheetOpen}
            onClose={() => setSheetOpen(false)}
            title={t('results.filters')}
            closeLabel={t('search.closeEdit')}
            footer={
              <div className="flex items-center gap-3">
                {filterCount > 0 && (
                  <Button variant="ghost" onClick={() => setFilters(NO_FILTERS)}>
                    {t('results.clearFilters')}
                  </Button>
                )}
                <Button className="flex-1" onClick={() => setSheetOpen(false)}>
                  {t('results.showResults', { count: shaped?.groups.length ?? 0 })}
                </Button>
              </div>
            }
          >
            {filterUi}
            {shaped && shaped.ranked.length > 0 && (
              <div className="mt-4">
                <IntelligencePanel ranked={shaped.ranked} />
                <div className="mt-4">
                  <PriceTimeChart groups={shaped.groups} onPointSelect={() => setSheetOpen(false)} />
                </div>
              </div>
            )}
          </Sheet>
        </>
      )}
    </div>
  );
};
