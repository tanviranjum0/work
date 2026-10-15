import { useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Minus, Plus } from 'lucide-react';
import { MAX_PASSENGERS_PER_BOOKING } from '@aeronova/shared';

export interface PassengerCountsValue {
  readonly adults: number;
  readonly children: number;
  readonly infants: number;
}

interface Props {
  readonly value: PassengerCountsValue;
  readonly onChange: (v: PassengerCountsValue) => void;
  readonly error?: string | undefined;
}

type Kind = keyof PassengerCountsValue;

/** The steppers prevent impossible combinations instead of reporting them afterwards. */
export const limitsFor = (v: PassengerCountsValue, kind: Kind) => {
  const total = v.adults + v.children + v.infants;
  const room = MAX_PASSENGERS_PER_BOOKING - total;
  switch (kind) {
    case 'adults':
      return { min: Math.max(1, v.infants), max: v.adults + room };
    case 'children':
      return { min: 0, max: v.children + room };
    case 'infants':
      return { min: 0, max: Math.min(v.adults, v.infants + room) };
  }
};

export const PassengerPicker = ({ value, onChange, error }: Props) => {
  const { t } = useTranslation();
  const id = useId();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const total = value.adults + value.children + value.infants;

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open]);

  const rows: { kind: Kind; label: string; hint: string }[] = [
    { kind: 'adults', label: t('search.adults'), hint: t('search.adultsHint') },
    { kind: 'children', label: t('search.children'), hint: t('search.childrenHint') },
    { kind: 'infants', label: t('search.infants'), hint: t('search.infantsHint') },
  ];

  return (
    <div
      ref={rootRef}
      className="relative"
      onKeyDown={(e) => {
        if (e.key === 'Escape' && open) {
          e.stopPropagation();
          setOpen(false);
          buttonRef.current?.focus();
        }
      }}
    >
      <span id={`${id}-label`} className="block text-caption font-semibold text-muted">
        {t('search.travellers')}
      </span>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        aria-labelledby={`${id}-label ${id}-value`}
        onClick={() => setOpen((o) => !o)}
        className={`mt-1 flex h-12 w-full items-center justify-between gap-2 rounded-control border bg-surface px-3 text-left text-body font-semibold ${
          error ? 'border-danger' : 'border-control-border'
        }`}
      >
        <span id={`${id}-value`}>{t('search.travellerSummary', { count: total })}</span>
        <ChevronDown
          aria-hidden
          className={`size-4 text-muted transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {error && <p className="mt-1 text-caption text-danger">{error}</p>}

      <div
        id={`${id}-panel`}
        hidden={!open}
        className="absolute top-full right-0 z-(--z-overlay) mt-1 w-[min(22rem,calc(100vw-2rem))] rounded-panel border border-border bg-surface p-4 shadow-float"
      >
        <ul className="space-y-3">
          {rows.map(({ kind, label, hint }) => {
            const { min, max } = limitsFor(value, kind);
            const n = value[kind];
            return (
              <li key={kind} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-body-sm font-semibold" id={`${id}-${kind}`}>
                    {label}
                  </p>
                  <p className="text-caption text-muted">{hint}</p>
                </div>
                <div className="flex items-center gap-2" role="group" aria-labelledby={`${id}-${kind}`}>
                  <button
                    type="button"
                    aria-label={t('search.decrease', { label: label.toLowerCase() })}
                    disabled={n <= min}
                    onClick={() => onChange({ ...value, [kind]: n - 1 })}
                    className="grid size-9 place-items-center rounded-full border border-control-border text-fg hover:bg-surface-muted disabled:opacity-35"
                  >
                    <Minus aria-hidden className="size-4" />
                  </button>
                  <output aria-live="polite" className="w-6 text-center tabular font-semibold">
                    {n}
                  </output>
                  <button
                    type="button"
                    aria-label={t('search.increase', { label: label.toLowerCase() })}
                    disabled={n >= max}
                    onClick={() => onChange({ ...value, [kind]: n + 1 })}
                    className="grid size-9 place-items-center rounded-full border border-control-border text-fg hover:bg-surface-muted disabled:opacity-35"
                  >
                    <Plus aria-hidden className="size-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 space-y-1 border-t border-border pt-3 text-caption text-muted">
          {value.infants >= value.adults && <p>{t('search.infantRule')}</p>}
          {total >= MAX_PASSENGERS_PER_BOOKING && <p>{t('search.partyRule')}</p>}
        </div>
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              buttonRef.current?.focus();
            }}
            className="rounded-control px-3 py-1.5 font-semibold text-primary hover:bg-surface-muted"
          >
            {t('search.done')}
          </button>
        </div>
      </div>
    </div>
  );
};
