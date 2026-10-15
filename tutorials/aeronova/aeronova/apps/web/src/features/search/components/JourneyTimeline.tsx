import { useTranslation } from 'react-i18next';
import { AlertTriangle, Luggage } from 'lucide-react';
import { DEFAULT_INSIGHT_THRESHOLDS, type FlightJourney } from '@aeronova/shared';
import { dayOffsetLabel, formatDuration, formatWallDate, formatWallTime } from '../format';

/** Vertical detail timeline: departure, flight, layover, arrival. */
export const JourneyTimeline = ({ journey }: { journey: FlightJourney }) => {
  const { t } = useTranslation();
  return (
    <ol className="relative space-y-0">
      {journey.segments.map((s, i) => {
        const layover = journey.layovers.find((l) => l.afterSegmentId === s.id);
        const offset = dayOffsetLabel(s.departure.local, s.arrival.local);
        const operator = s.operatingCarrier.status === 'provided' ? s.operatingCarrier.value : null;
        const terminal = (tm: typeof s.origin.terminal) =>
          tm.status === 'provided' ? `, ${t('results.terminal', { t: tm.value })}` : '';
        return (
          <li key={s.id}>
            <div className="grid grid-cols-[3.25rem_1rem_1fr] gap-x-3">
              <p className="pt-0.5 text-right font-semibold tabular">{formatWallTime(s.departure.local)}</p>
              <span className="relative flex justify-center" aria-hidden>
                <span className="mt-1.5 size-2.5 rounded-full border-2 border-fg bg-surface" />
                <span className="absolute top-4 bottom-0 w-px bg-control-border" />
              </span>
              <div className="pb-3">
                <p className="font-semibold">
                  {s.origin.iataCode}
                  <span className="ml-2 font-normal text-muted">
                    {formatWallDate(s.departure.local)}
                    {terminal(s.origin.terminal)}
                  </span>
                </p>
              </div>

              <p className="text-right text-caption text-muted tabular">
                {formatDuration(s.durationMinutes)}
              </p>
              <span className="flex justify-center" aria-hidden>
                <span className="w-px bg-control-border" />
              </span>
              <div className="space-y-0.5 pb-3 text-body-sm text-muted">
                <p className="text-fg">
                  {s.marketingCarrier.name} {s.marketingCarrier.code} {s.marketingFlightNumber}
                </p>
                {operator && operator.code !== s.marketingCarrier.code && (
                  <p>{t('results.operatedBy', { name: operator.name })}</p>
                )}
                <p>
                  {t(`search.cabins.${s.cabin}`)}
                  {s.aircraft.status === 'provided' &&
                    `, ${s.aircraft.value.name.status === 'provided' ? s.aircraft.value.name.value : s.aircraft.value.code}`}
                </p>
                {s.technicalStops.map((ts) => (
                  <p key={ts.airport.iataCode}>
                    {t('results.technicalStop', { airport: ts.airport.iataCode })}
                    {ts.durationMinutes.status === 'provided' &&
                      ` (${formatDuration(ts.durationMinutes.value)})`}
                  </p>
                ))}
              </div>

              <p className="text-right font-semibold tabular">
                {formatWallTime(s.arrival.local)}
                {offset && <sup className="ml-0.5 text-caption text-warning">{offset}</sup>}
              </p>
              <span className="relative flex justify-center" aria-hidden>
                <span className="mt-1.5 size-2.5 rounded-full bg-fg" />
                {layover && (
                  <span className="absolute top-4 bottom-0 w-px border-l border-dashed border-control-border" />
                )}
              </span>
              <div className={layover ? 'pb-3' : ''}>
                <p className="font-semibold">
                  {s.destination.iataCode}
                  <span className="ml-2 font-normal text-muted">
                    {formatWallDate(s.arrival.local)}
                    {terminal(s.destination.terminal)}
                  </span>
                </p>
              </div>
            </div>

            {layover && (
              <div className="grid grid-cols-[3.25rem_1rem_1fr] gap-x-3">
                <span />
                <span className="flex justify-center" aria-hidden>
                  <span className="w-px border-l border-dashed border-control-border" />
                </span>
                <div className="mb-3 space-y-1 rounded-control bg-surface-muted px-3 py-2 text-body-sm">
                  <p className="font-semibold">
                    {t('results.layover', {
                      duration: formatDuration(layover.durationMinutes),
                      airport: layover.airport.iataCode,
                    })}
                  </p>
                  {layover.durationMinutes < DEFAULT_INSIGHT_THRESHOLDS.tightConnectionMinutes && (
                    <p className="flex items-center gap-1.5 text-warning">
                      <AlertTriangle aria-hidden className="size-3.5" />
                      {t('results.insights.tight')}
                    </p>
                  )}
                  {layover.requiresAirportChange && (
                    <p className="flex items-center gap-1.5 text-warning">
                      <AlertTriangle aria-hidden className="size-3.5" />
                      {t('results.insights.airportChange')}: {layover.airport.iataCode} →{' '}
                      {journey.segments[i + 1]?.origin.iataCode}
                    </p>
                  )}
                  {layover.requiresTerminalChange.status === 'provided' &&
                    layover.requiresTerminalChange.value && (
                      <p className="text-muted">{t('results.insights.terminalChange')}</p>
                    )}
                  {layover.selfTransfer.status === 'provided' && layover.selfTransfer.value && (
                    <p className="flex items-center gap-1.5 text-warning">
                      <Luggage aria-hidden className="size-3.5" />
                      {t('results.insights.selfTransfer')}
                    </p>
                  )}
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
};
