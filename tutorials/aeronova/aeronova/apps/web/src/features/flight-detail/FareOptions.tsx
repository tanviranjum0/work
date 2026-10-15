import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import type { RankedOffer } from '@aeronova/shared';
import { bagLabel, conditionLabel, money0 } from '../search/components/flight-labels';

/** Fare families for one itinerary, as a radio group of comparable cards. */
export const FareOptions = ({
  fares,
  selectedId,
  onSelect,
  locale = 'en',
}: {
  fares: readonly RankedOffer[];
  selectedId: string;
  onSelect: (offerId: string) => void;
  locale?: string;
}) => {
  const { t } = useTranslation();
  const sorted = [...fares].sort(
    (a, b) => a.offer.price.customerTotal.amountMinor - b.offer.price.customerTotal.amountMinor,
  );
  const cheapest = sorted[0]?.offer.price.customerTotal.amountMinor ?? 0;

  return (
    <fieldset>
      <legend className="sr-only">{t('detail.chooseFare')}</legend>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {sorted.map(({ offer }) => {
          const selected = offer.id === selectedId;
          const delta = offer.price.customerTotal.amountMinor - cheapest;
          return (
            <label
              key={offer.id}
              className={`relative flex cursor-pointer flex-col rounded-panel border bg-surface p-4 transition-[border-color,box-shadow] duration-(--duration-fast) has-focus-visible:outline-2 has-focus-visible:outline-primary ${
                selected
                  ? 'border-course shadow-[0_0_0_1px_var(--course)]'
                  : 'border-border hover:border-control-border'
              }`}
            >
              <input
                type="radio"
                name="fare"
                value={offer.id}
                checked={selected}
                onChange={() => onSelect(offer.id)}
                className="sr-only"
              />
              <span className="flex items-start justify-between gap-2">
                <span className="font-semibold">
                  {offer.fareFamily.status === 'provided' ? offer.fareFamily.value : t('results.notProvided')}
                </span>
                {selected && (
                  <span className="flex items-center gap-1 text-caption font-semibold text-course">
                    <Check aria-hidden className="size-3.5" />
                    {t('detail.selected')}
                  </span>
                )}
              </span>
              <span className="mt-1 font-display text-title font-semibold tabular [font-stretch:110%]">
                {money0(offer.price.customerTotal, locale)}
              </span>
              <span className="text-caption text-muted tabular">
                {delta > 0
                  ? `+${money0({ amountMinor: delta, currency: offer.price.currency }, locale)}`
                  : '\u00a0'}
              </span>
              <dl className="mt-3 space-y-1.5 border-t border-border pt-3 text-body-sm">
                {(
                  [
                    [t('results.cabinBagLabel'), bagLabel(t, offer.baggage.cabin, 'cabin')],
                    [t('results.checkedBagLabel'), bagLabel(t, offer.baggage.checked, 'checked')],
                    [t('results.refundRules'), conditionLabel(t, offer.conditions.refund, 'refund', locale)],
                    [t('results.changeRules'), conditionLabel(t, offer.conditions.change, 'change', locale)],
                  ] as const
                ).map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-caption text-muted">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
};
