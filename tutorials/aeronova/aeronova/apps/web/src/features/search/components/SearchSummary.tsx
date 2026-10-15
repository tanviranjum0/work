import { useTranslation } from 'react-i18next';
import { Pencil } from 'lucide-react';
import type { FlightSearchInput, PlaceSummary } from '@aeronova/shared';
import { cityOf } from '../places';
import { formatWallDate } from '../format';

export const SearchSummary = ({
  query,
  editing,
  onToggleEdit,
  places,
}: {
  query: FlightSearchInput;
  places?: Readonly<Record<string, PlaceSummary>> | undefined;
  editing: boolean;
  onToggleEdit: () => void;
}) => {
  const { t } = useTranslation();
  const [first] = query.journeys;
  const pax = query.passengers.adults + query.passengers.children + query.passengers.infants;
  const title =
    query.tripType === 'multi_city'
      ? t('results.multiTitle')
      : t('results.title', { from: cityOf(places, first.origin), to: cityOf(places, first.destination) });
  const dates = query.journeys.map((j) => formatWallDate(j.departureDate));

  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-headline font-semibold">{title}</h1>
        <p className="mt-1 text-body-sm text-muted tabular">
          {query.tripType === 'multi_city'
            ? query.journeys.map((j) => `${j.origin}–${j.destination}`).join(', ')
            : `${first.origin}–${first.destination}, ${dates.join(' – ')}`}
          {', '}
          {t('search.summaryPassengers', { count: pax })}
          {', '}
          {t(`search.cabins.${query.cabin}`)}
          {query.directOnly && `, ${t('search.directOnly').toLowerCase()}`}
        </p>
      </div>
      <button
        type="button"
        aria-expanded={editing}
        aria-controls="edit-search"
        onClick={onToggleEdit}
        className="flex items-center gap-2 rounded-control border border-control-border bg-surface px-3 py-2 text-body-sm font-semibold hover:bg-surface-muted"
      >
        <Pencil aria-hidden className="size-4" />
        {editing ? t('search.closeEdit') : t('search.editSearch')}
      </button>
    </div>
  );
};
