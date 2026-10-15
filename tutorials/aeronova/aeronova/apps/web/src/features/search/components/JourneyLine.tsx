import { useTranslation } from 'react-i18next';
import type { FlightJourney } from '@aeronova/shared';
import { dayOffsetLabel, formatDuration, formatWallDate, formatWallTime } from '../format';

/**
 * The compact journey row: departure and arrival dominate, with duration and
 * stops drawn as a route line between them. Stop markers sit on the line.
 */
export const JourneyLine = ({ journey, showDate }: { journey: FlightJourney; showDate: boolean }) => {
  const { t } = useTranslation();
  const first = journey.segments[0];
  const last = journey.segments[journey.segments.length - 1];
  if (!first || !last) return null;
  const stops = journey.layovers.length + journey.segments.reduce((n, s) => n + s.technicalStops.length, 0);
  const offset = dayOffsetLabel(first.departure.local, last.arrival.local);
  const stopCodes = [
    ...journey.layovers.map((l) => l.airport.iataCode),
    ...journey.segments.flatMap((s) => s.technicalStops.map((ts) => ts.airport.iataCode)),
  ];

  return (
    <div className="grid grid-cols-[auto_minmax(4.5rem,1fr)_auto] items-center gap-3 sm:gap-5">
      <div>
        {showDate && <p className="text-caption text-muted">{formatWallDate(first.departure.local)}</p>}
        <p className="font-display text-title font-semibold tabular [font-stretch:112%] sm:text-[1.5rem]">
          {formatWallTime(first.departure.local)}
        </p>
        <p className="text-body-sm font-semibold text-muted tabular">{first.origin.iataCode}</p>
      </div>

      <div className="text-center">
        <p className="text-caption text-muted tabular">{formatDuration(journey.totalDurationMinutes)}</p>
        <div className="relative my-1.5 h-px bg-control-border" aria-hidden>
          <span className="absolute top-1/2 left-0 size-1.5 -translate-y-1/2 rounded-full bg-control-border" />
          {stopCodes.map((code, i) => (
            <span
              key={`${code}-${i}`}
              className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface bg-fg"
              style={{ left: `${((i + 1) / (stopCodes.length + 1)) * 100}%` }}
            />
          ))}
          <span className="absolute top-1/2 right-0 size-0 -translate-y-1/2 border-y-[4px] border-l-[6px] border-y-transparent border-l-control-border" />
        </div>
        <p className={`text-caption tabular ${stops === 0 ? 'text-success' : 'text-muted'}`}>
          {t('results.stopsCount', { count: stops })}
          {stops > 0 && (
            <span className="text-muted"> {t('results.via', { codes: stopCodes.join(', ') })}</span>
          )}
        </p>
      </div>

      <div className="text-right">
        {showDate && <p className="text-caption text-muted">{formatWallDate(last.arrival.local)}</p>}
        <p className="font-display text-title font-semibold tabular [font-stretch:112%] sm:text-[1.5rem]">
          {formatWallTime(last.arrival.local)}
          {offset && (
            <sup className="ml-0.5 text-caption font-semibold text-warning">
              <span className="sr-only">{t('results.arrivesNextDay', { offset })}</span>
              <span aria-hidden>{offset}</span>
            </sup>
          )}
        </p>
        <p className="text-body-sm font-semibold text-muted tabular">{last.destination.iataCode}</p>
      </div>
    </div>
  );
};
