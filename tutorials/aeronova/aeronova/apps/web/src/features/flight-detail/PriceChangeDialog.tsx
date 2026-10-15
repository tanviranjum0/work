import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { PricedQuote } from '@aeronova/shared';
import { Button } from '../../components/ui/Button';
import { money0 } from '../search/components/flight-labels';

/**
 * A price change is never applied silently. This modal must be answered:
 * accept the new price, or go back to choose another fare.
 */
export const PriceChangeDialog = ({
  quote,
  open,
  onAccept,
  onDecline,
  onClosed,
  locale = 'en',
}: {
  quote: PricedQuote;
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
  /** Runs after the browser has closed the dialog and restored focus, so it can move focus elsewhere. */
  onClosed?: () => void;
  locale?: string;
}) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal?.();
    if (!open && d.open) d.close();
  }, [open]);

  const now = quote.offer.price.customerTotal;
  const was = quote.previousTotal;
  const diff = { amountMinor: Math.abs(now.amountMinor - was.amountMinor), currency: now.currency };
  const up = now.amountMinor > was.amountMinor;

  return (
    <dialog
      ref={ref}
      aria-labelledby="price-change-title"
      aria-describedby="price-change-body"
      // Escape counts as "choose another fare": nothing is accepted by default.
      onClose={() => onClosed?.()}
      onCancel={(e) => {
        e.preventDefault();
        onDecline();
      }}
      className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-sheet bg-surface p-6 text-fg shadow-float backdrop:bg-black/50"
    >
      <h2 id="price-change-title" className="text-headline font-semibold">
        {t('detail.changed.title')}
      </h2>
      <p id="price-change-body" className="mt-2 text-muted">
        {t('detail.changed.body')}
      </p>
      <dl className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-panel border border-border p-3">
          <dt className="text-caption text-muted">{t('detail.changed.was')}</dt>
          <dd className="font-display text-title text-muted tabular line-through [font-stretch:110%]">
            {money0(was, locale)}
          </dd>
        </div>
        <div className="rounded-panel border border-warning p-3">
          <dt className="text-caption text-muted">{t('detail.changed.now')}</dt>
          <dd className="font-display text-title font-semibold tabular [font-stretch:110%]">
            {money0(now, locale)}
            <span className={`ml-1.5 text-caption ${up ? 'text-warning' : 'text-success'}`}>
              {up ? '+' : '−'}
              {money0(diff, locale)}
            </span>
          </dd>
        </div>
      </dl>
      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {/* Initial focus on the non-committal choice. */}
        <Button variant="secondary" onClick={onDecline} autoFocus>
          {t('detail.changed.decline')}
        </Button>
        <Button onClick={onAccept}>{t('detail.changed.accept', { price: money0(now, locale) })}</Button>
      </div>
    </dialog>
  );
};
