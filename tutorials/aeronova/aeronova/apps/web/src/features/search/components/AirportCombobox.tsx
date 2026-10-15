import { useId, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, Clock3, Plane } from 'lucide-react';
import type { LocationSuggestion } from '@aeronova/shared';
import {
  AIRPORT_QUERY_MIN_CHARS,
  readRecentAirports,
  rememberAirport,
  useAirportSuggestions,
} from '../search-queries';

export interface AirportComboboxProps {
  readonly label: string;
  readonly value: string; // IATA airport or city code
  readonly onChange: (code: string) => void;
  readonly error?: string | undefined;
  readonly className?: string;
}

const describe = (s: LocationSuggestion) => (s.kind === 'city' ? s.name : `${s.cityName}, ${s.countryName}`);

/**
 * WAI-ARIA 1.2 combobox with a listbox popup. Keyboard: ↑/↓ move, Enter
 * selects, Escape closes (then clears), Tab accepts the highlighted option.
 * Selection state lives in the parent as a code; the visible text is local.
 */
export const AirportCombobox = ({ label, value, onChange, error, className = '' }: AirportComboboxProps) => {
  const { t } = useTranslation();
  const id = useId();
  const listId = `${id}-list`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const inputRef = useRef<HTMLInputElement>(null);

  const [text, setText] = useState(value);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [picked, setPicked] = useState<LocationSuggestion | null>(null);

  // Keep the field in sync when the parent changes the code (swap, URL restore).
  const [syncedValue, setSyncedValue] = useState(value);
  if (value !== syncedValue) {
    setSyncedValue(value);
    if (value !== (picked?.code ?? '')) {
      setPicked(null);
      setText(value);
    }
  }

  const typing = text.trim().length >= AIRPORT_QUERY_MIN_CHARS && text !== (picked ? display(picked) : value);
  const query = useAirportSuggestions(typing ? text : '');
  const recent = useMemo(() => (open && !typing ? readRecentAirports() : []), [open, typing]);
  const options: readonly LocationSuggestion[] = typing ? (query.data ?? []) : recent;

  const select = (s: LocationSuggestion) => {
    setPicked(s);
    setText(display(s));
    setOpen(false);
    setActive(-1);
    rememberAirport(s);
    onChange(s.code);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setOpen(true);
        setActive((i) => (options.length ? (i + 1) % options.length : -1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setOpen(true);
        setActive((i) => (options.length ? (i <= 0 ? options.length - 1 : i - 1) : -1));
        break;
      case 'Enter': {
        const s = options[active];
        if (open && s) {
          e.preventDefault();
          select(s);
        }
        break;
      }
      case 'Tab': {
        const s = options[active];
        if (open && s) select(s);
        break;
      }
      case 'Escape':
        if (open) {
          e.preventDefault();
          setOpen(false);
        } else if (text) {
          e.preventDefault();
          setText('');
          setPicked(null);
          onChange('');
        }
        break;
    }
  };

  const status = !typing
    ? null
    : query.isError
      ? t('search.airportsError')
      : query.isFetching && !query.data
        ? t('search.airportsLoading')
        : query.data && query.data.length === 0
          ? t('search.airportsNone', { query: text.trim() })
          : null;

  const showPopup = open && (options.length > 0 || status !== null);
  const activeId = active >= 0 && options[active] ? `${id}-opt-${active}` : undefined;

  return (
    <div className={`relative ${className}`}>
      <label htmlFor={id} className="block text-caption font-semibold text-muted">
        {label}
      </label>
      <input
        ref={inputRef}
        id={id}
        type="text"
        role="combobox"
        aria-expanded={showPopup}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={activeId}
        aria-describedby={error ? errorId : hintId}
        aria-invalid={error ? true : undefined}
        autoComplete="off"
        spellCheck={false}
        placeholder={t('search.airportPlaceholder')}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setPicked(null);
          setOpen(true);
          setActive(-1);
          if (value) onChange('');
        }}
        onFocus={(e) => {
          e.currentTarget.select();
          setOpen(true);
        }}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
        className={`mt-1 h-12 w-full rounded-control border bg-surface px-3 text-body font-semibold text-fg placeholder:font-normal placeholder:text-muted focus:outline-2 focus:outline-offset-0 focus:outline-primary ${
          error ? 'border-danger' : 'border-control-border'
        }`}
      />
      <span id={hintId} className="sr-only">
        {t('search.airportHint')}
      </span>
      {error && (
        <p id={errorId} className="mt-1 text-caption text-danger">
          {error}
        </p>
      )}
      <div
        className={`absolute top-full left-0 z-(--z-overlay) mt-1 w-full min-w-[18rem] overflow-hidden rounded-panel border border-border bg-surface shadow-float ${
          showPopup ? '' : 'hidden'
        }`}
      >
        {!typing && options.length > 0 && (
          <p className="px-3 pt-2.5 pb-1 text-caption text-muted">{t('search.recent')}</p>
        )}
        <ul id={listId} role="listbox" aria-label={label} className="max-h-80 overflow-y-auto py-1">
          {options.map((s, i) => {
            const Icon = !typing ? Clock3 : s.kind === 'city' ? Building2 : Plane;
            return (
              <li
                key={`${s.kind}-${s.code}`}
                id={`${id}-opt-${i}`}
                role="option"
                aria-selected={i === active}
                // mousedown keeps focus in the input so blur doesn't close first
                onMouseDown={(e) => {
                  e.preventDefault();
                  select(s);
                }}
                onMouseMove={() => setActive(i)}
                className={`flex cursor-pointer items-center gap-3 px-3 py-2 ${i === active ? 'bg-surface-muted' : ''} ${
                  s.kind === 'airport' && typing && options[0]?.kind === 'city' ? 'pl-7' : ''
                }`}
              >
                <Icon aria-hidden className="size-4 shrink-0 text-muted" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-body-sm font-semibold">
                    {s.kind === 'city' ? describe(s) : s.name}
                  </span>
                  <span className="block truncate text-caption text-muted">
                    {s.kind === 'city' ? s.countryName : describe(s)}
                  </span>
                </span>
                <span className="tabular font-display text-body-sm font-semibold [font-stretch:112%]">
                  {s.code}
                </span>
              </li>
            );
          })}
        </ul>
        {status && (
          <p role="status" className="px-3 py-3 text-body-sm text-muted">
            {status}
          </p>
        )}
      </div>
    </div>
  );
};

function display(s: LocationSuggestion) {
  return `${s.cityName} (${s.code})`;
}
