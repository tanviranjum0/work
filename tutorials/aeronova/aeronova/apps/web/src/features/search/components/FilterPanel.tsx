import { useId, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { CurrencyCode } from '@aeronova/shared';
import { formatDuration } from '../format';
import { TIME_WINDOWS, type Facets, type ResultFilters, type TimeWindow } from '../results-model';
import { money0 } from './flight-labels';

interface Props {
  readonly facets: Facets;
  readonly filters: ResultFilters;
  readonly currency: CurrencyCode;
  readonly onChange: (next: ResultFilters) => void;
  readonly locale?: string;
}

const Group = ({
  title,
  children,
  note,
}: {
  title: string;
  children: ReactNode;
  note?: string | undefined;
}) => (
  <fieldset className="space-y-2 border-t border-border py-4 first:border-t-0 first:pt-0">
    <legend className="float-left mb-2 w-full text-body-sm font-semibold">{title}</legend>
    <div className="clear-both space-y-2">{children}</div>
    {note && <p className="text-caption text-muted">{note}</p>}
  </fieldset>
);

const Check = ({
  label,
  checked,
  onChange,
  disabled = false,
  aside,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  aside?: ReactNode;
}) => (
  <label className={`flex items-center gap-2.5 text-body-sm ${disabled ? 'text-muted' : 'cursor-pointer'}`}>
    <input
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={(e) => onChange(e.target.checked)}
      className="size-4 shrink-0 accent-(--primary)"
    />
    <span className="flex-1">{label}</span>
    {aside && <span className="text-caption text-muted tabular">{aside}</span>}
  </label>
);

const toggle = <T,>(list: readonly T[], v: T, on: boolean): T[] =>
  on ? [...list, v] : list.filter((x) => x !== v);

export const FilterPanel = ({ facets, filters, currency, onChange, locale = 'en' }: Props) => {
  const { t } = useTranslation();
  const priceId = useId();
  const durationId = useId();
  const set = (patch: Partial<ResultFilters>) => onChange({ ...filters, ...patch });
  const [pMin, pMax] = facets.priceRange;
  const [dMin, dMax] = facets.durationRange;
  const priceStep = Math.max(100, Math.round((pMax - pMin) / 40 / 100) * 100);
  const priceValue = filters.maxPriceMinor ?? pMax;
  const durationValue = filters.maxDurationMinutes ?? dMax;

  return (
    <div>
      <Group title={t('results.stops')}>
        {([0, 1, 2] as const).map((n) => (
          <Check
            key={n}
            label={t(`results.stop${n}`)}
            checked={filters.stops.includes(n)}
            disabled={facets.stops[n] === 0}
            onChange={(on) => set({ stops: toggle(filters.stops, n, on) })}
            aside={facets.stops[n]}
          />
        ))}
      </Group>

      {pMax > pMin && (
        <Group title={t('results.maxPrice')}>
          <div className="flex items-baseline justify-between text-body-sm">
            <label htmlFor={priceId} className="sr-only">
              {t('results.maxPrice')}
            </label>
            <output htmlFor={priceId} className="font-semibold tabular">
              {filters.maxPriceMinor === null
                ? t('results.any')
                : money0({ amountMinor: priceValue, currency }, locale)}
            </output>
          </div>
          <input
            id={priceId}
            type="range"
            min={pMin}
            max={pMax}
            step={priceStep}
            value={priceValue}
            aria-valuetext={money0({ amountMinor: priceValue, currency }, locale)}
            onChange={(e) => {
              const v = Number(e.target.value);
              set({ maxPriceMinor: v >= pMax ? null : v });
            }}
            className="w-full accent-(--primary)"
          />
        </Group>
      )}

      {dMax > dMin && (
        <Group title={t('results.maxDuration')}>
          <output htmlFor={durationId} className="block text-body-sm font-semibold tabular">
            {filters.maxDurationMinutes === null ? t('results.any') : formatDuration(durationValue)}
          </output>
          <label htmlFor={durationId} className="sr-only">
            {t('results.maxDuration')}
          </label>
          <input
            id={durationId}
            type="range"
            min={dMin}
            max={dMax}
            step={15}
            value={durationValue}
            aria-valuetext={formatDuration(durationValue)}
            onChange={(e) => {
              const v = Number(e.target.value);
              set({ maxDurationMinutes: v >= dMax ? null : v });
            }}
            className="w-full accent-(--primary)"
          />
        </Group>
      )}

      <Group title={t('results.departure')}>
        {(Object.keys(TIME_WINDOWS) as TimeWindow[]).map((w) => (
          <Check
            key={w}
            label={t(`results.windows.${w}`)}
            checked={filters.departWindows.includes(w)}
            onChange={(on) => set({ departWindows: toggle(filters.departWindows, w, on) })}
          />
        ))}
      </Group>

      <Group
        title={t('results.fare')}
        note={
          [
            !facets.bagDataAvailable && t('results.noBagData'),
            !facets.refundDataAvailable && t('results.noRefundData'),
          ]
            .filter(Boolean)
            .join(' ') || undefined
        }
      >
        <Check
          label={t('results.checkedBag')}
          checked={filters.checkedBag}
          disabled={!facets.bagDataAvailable}
          onChange={(checkedBag) => set({ checkedBag })}
        />
        <Check
          label={t('results.refundable')}
          checked={filters.refundable}
          disabled={!facets.refundDataAvailable}
          onChange={(refundable) => set({ refundable })}
        />
      </Group>

      {(facets.anySelfTransfer || facets.anyAirportChange || facets.anyOvernight || facets.anyRedEye) && (
        <Group title={t('results.connections')}>
          {facets.anySelfTransfer && (
            <Check
              label={t('results.avoidSelfTransfer')}
              checked={filters.avoidSelfTransfer}
              onChange={(avoidSelfTransfer) => set({ avoidSelfTransfer })}
            />
          )}
          {facets.anyAirportChange && (
            <Check
              label={t('results.avoidAirportChange')}
              checked={filters.avoidAirportChange}
              onChange={(avoidAirportChange) => set({ avoidAirportChange })}
            />
          )}
          {facets.anyOvernight && (
            <Check
              label={t('results.avoidOvernight')}
              checked={filters.avoidOvernightLayover}
              onChange={(avoidOvernightLayover) => set({ avoidOvernightLayover })}
            />
          )}
          {facets.anyRedEye && (
            <Check
              label={t('results.avoidRedEye')}
              checked={filters.avoidRedEye}
              onChange={(avoidRedEye) => set({ avoidRedEye })}
            />
          )}
        </Group>
      )}

      {facets.airlines.length > 1 && (
        <Group title={t('results.airlines')}>
          {facets.airlines.map((a) => (
            <Check
              key={a.code}
              label={a.name}
              checked={filters.airlines.includes(a.code)}
              onChange={(on) => set({ airlines: toggle(filters.airlines, a.code, on) })}
              aside={money0({ amountMinor: a.minPriceMinor, currency }, locale)}
            />
          ))}
        </Group>
      )}
    </div>
  );
};
