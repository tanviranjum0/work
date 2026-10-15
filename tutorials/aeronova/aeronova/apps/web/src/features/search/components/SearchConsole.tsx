import { useCallback, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeftRight, Plus, Search, X } from 'lucide-react';
import {
  CABIN_CLASSES,
  CURRENCY_CODES,
  MAX_MULTI_CITY_JOURNEYS,
  todayInTimeZone,
  type CabinClass,
  type CurrencyCode,
} from '@aeronova/shared';
import { Button } from '../../../components/ui/Button';
import { paramsFromDraft, type SearchDraft } from '../search-url';
import type { validateDraft as ValidateDraft } from '../search-validation';
import { AirportCombobox } from './AirportCombobox';
import { PassengerPicker } from './PassengerPicker';

const TRIP_TYPES: SearchDraft['tripType'][] = ['round_trip', 'one_way', 'multi_city'];

const fieldClass =
  'mt-1 h-12 w-full rounded-control border bg-surface px-3 text-body font-semibold text-fg tabular focus:outline-2 focus:outline-offset-0 focus:outline-primary';

interface Props {
  readonly initial: SearchDraft;
  /** Called after navigation, e.g. to collapse the console on the results page. */
  readonly onSubmitted?: () => void;
}

export const SearchConsole = ({ initial, onSubmitted }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [draft, setDraft] = useState<SearchDraft>(initial);
  const [submitted, setSubmitted] = useState(false);
  const [swapTurns, setSwapTurns] = useState(0);

  // Validation is loaded on first interaction so it stays out of the landing page's initial bundle.
  const [validate, setValidate] = useState<typeof ValidateDraft | null>(null);
  const loadValidator = useCallback(async () => {
    const mod = await import('../search-validation');
    setValidate(() => mod.validateDraft);
    return mod.validateDraft;
  }, []);
  const errors = submitted && validate ? validate(draft).errors : {};
  const errorCount = Object.keys(errors).length;
  // Earliest calendar day anywhere: never blocks a date still valid at the departure airport.
  const today = todayInTimeZone('Etc/GMT+12');

  const update = (patch: Partial<SearchDraft>) => setDraft((d) => ({ ...d, ...patch }));
  const updateJourney = (i: number, patch: Partial<SearchDraft['journeys'][number]>) =>
    setDraft((d) => ({ ...d, journeys: d.journeys.map((j, k) => (k === i ? { ...j, ...patch } : j)) }));

  const setTripType = (tripType: SearchDraft['tripType']) =>
    setDraft((d) => {
      const first = d.journeys[0] ?? { origin: '', destination: '', departureDate: '' };
      if (tripType !== 'multi_city') return { ...d, tripType, journeys: [first] };
      if (d.journeys.length >= 2) return { ...d, tripType };
      // Seed the second flight from where the first one lands.
      return {
        ...d,
        tripType,
        journeys: [first, { origin: first.destination, destination: '', departureDate: '' }],
      };
    });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const run = validate ?? (await loadValidator());
    if (!run(draft).ok) return;
    navigate(`/search?${paramsFromDraft(draft).toString()}`);
    onSubmitted?.();
  };

  const err = (key: string) => errors[key];
  const isMulti = draft.tripType === 'multi_city';

  return (
    <form
      onSubmit={(e) => void onSubmit(e)}
      onFocusCapture={() => {
        if (!validate) void loadValidator();
      }}
      noValidate
      aria-label={t('home.searchHeading')}
      className="space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <fieldset className="flex rounded-control bg-surface-muted p-1">
          <legend className="sr-only">{t('search.tripType.label')}</legend>
          {TRIP_TYPES.map((type) => (
            <label
              key={type}
              className="cursor-pointer rounded-[4px] px-3 py-1.5 text-body-sm font-semibold text-muted transition-colors has-checked:bg-surface has-checked:text-fg has-checked:shadow-sm has-focus-visible:outline-2 has-focus-visible:outline-primary"
            >
              <input
                type="radio"
                name="tripType"
                className="sr-only"
                checked={draft.tripType === type}
                onChange={() => setTripType(type)}
              />
              {t(`search.tripType.${type}`)}
            </label>
          ))}
        </fieldset>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-body-sm">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={draft.directOnly}
              onChange={(e) => update({ directOnly: e.target.checked })}
              className="size-4 accent-(--primary)"
            />
            {t('search.directOnly')}
          </label>
          <label className="flex items-center gap-2">
            <span className="text-muted">{t('search.currency')}</span>
            <select
              value={draft.currency}
              onChange={(e) => update({ currency: e.target.value as CurrencyCode })}
              className="h-8 rounded-control border border-control-border bg-surface px-2 font-semibold"
            >
              {CURRENCY_CODES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="space-y-3">
        {draft.journeys.map((j, i) => (
          <fieldset
            key={i}
            className="grid grid-cols-2 gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_minmax(0,0.75fr)_minmax(0,0.75fr)] md:items-start"
          >
            <legend className={isMulti ? 'mb-1 text-caption font-semibold text-muted' : 'sr-only'}>
              {t('search.flight', { n: i + 1 })}
            </legend>
            <AirportCombobox
              className="col-span-2 md:col-span-1"
              label={t('search.from')}
              value={j.origin}
              onChange={(origin) => updateJourney(i, { origin })}
              error={err(`journeys.${i}.origin`)}
            />
            <button
              type="button"
              aria-label={t('search.swap')}
              onClick={() => {
                updateJourney(i, { origin: j.destination, destination: j.origin });
                setSwapTurns((n) => n + 1);
              }}
              className="col-span-2 grid size-10 place-items-center place-self-center rounded-full border md:col-span-1 border-control-border bg-surface text-fg hover:bg-surface-muted md:mt-6"
            >
              <span
                aria-hidden
                className="grid place-items-center transition-transform duration-(--duration-base) ease-(--ease-out)"
                style={{ transform: `rotate(${swapTurns * 180}deg)` }}
              >
                <ArrowLeftRight className="size-4 rotate-90 md:rotate-0" />
              </span>
            </button>
            <AirportCombobox
              className="col-span-2 md:col-span-1"
              label={t('search.to')}
              value={j.destination}
              onChange={(destination) => updateJourney(i, { destination })}
              error={err(`journeys.${i}.destination`)}
            />
            <div className={draft.tripType === 'one_way' ? 'col-span-2 md:col-span-1' : ''}>
              <label className="block text-caption font-semibold text-muted" htmlFor={`depart-${i}`}>
                {t('search.depart')}
              </label>
              <input
                id={`depart-${i}`}
                type="date"
                min={today}
                value={j.departureDate}
                onChange={(e) => updateJourney(i, { departureDate: e.target.value })}
                aria-invalid={err(`journeys.${i}.departureDate`) ? true : undefined}
                aria-describedby={err(`journeys.${i}.departureDate`) ? `depart-${i}-error` : undefined}
                className={`${fieldClass} ${err(`journeys.${i}.departureDate`) ? 'border-danger' : 'border-control-border'}`}
              />
              {err(`journeys.${i}.departureDate`) && (
                <p id={`depart-${i}-error`} className="mt-1 text-caption text-danger">
                  {err(`journeys.${i}.departureDate`)}
                </p>
              )}
            </div>
            {draft.tripType === 'round_trip' ? (
              <div>
                <label className="block text-caption font-semibold text-muted" htmlFor="return-date">
                  {t('search.return')}
                </label>
                <input
                  id="return-date"
                  type="date"
                  min={j.departureDate || today}
                  value={draft.returnDate}
                  onChange={(e) => update({ returnDate: e.target.value })}
                  aria-invalid={err('returnDate') ? true : undefined}
                  aria-describedby={err('returnDate') ? 'return-date-error' : undefined}
                  className={`${fieldClass} ${err('returnDate') ? 'border-danger' : 'border-control-border'}`}
                />
                {err('returnDate') && (
                  <p id="return-date-error" className="mt-1 text-caption text-danger">
                    {err('returnDate')}
                  </p>
                )}
              </div>
            ) : isMulti && draft.journeys.length > 2 ? (
              <button
                type="button"
                onClick={() => setDraft((d) => ({ ...d, journeys: d.journeys.filter((_, k) => k !== i) }))}
                aria-label={t('search.removeFlight', { n: i + 1 })}
                className="flex h-12 items-center gap-2 self-end rounded-control px-3 text-body-sm text-muted hover:bg-surface-muted hover:text-fg md:mt-6"
              >
                <X aria-hidden className="size-4" />
              </button>
            ) : (
              <div className="hidden md:block" />
            )}
          </fieldset>
        ))}
        {isMulti && draft.journeys.length < MAX_MULTI_CITY_JOURNEYS && (
          <button
            type="button"
            onClick={() =>
              setDraft((d) => {
                const last = d.journeys[d.journeys.length - 1];
                return {
                  ...d,
                  journeys: [
                    ...d.journeys,
                    { origin: last?.destination ?? '', destination: '', departureDate: '' },
                  ],
                };
              })
            }
            className="flex items-center gap-2 rounded-control px-2 py-1.5 font-semibold text-primary hover:bg-surface-muted"
          >
            <Plus aria-hidden className="size-4" />
            {t('search.addFlight')}
          </button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-[minmax(0,15rem)_minmax(0,13rem)_1fr_auto] md:items-end">
        <PassengerPicker
          value={{ adults: draft.adults, children: draft.children, infants: draft.infants }}
          onChange={(p) => update(p)}
          error={err('passengers.infants') ?? err('passengers.adults')}
        />
        <div>
          <label htmlFor="cabin" className="block text-caption font-semibold text-muted">
            {t('search.cabin')}
          </label>
          <select
            id="cabin"
            value={draft.cabin}
            onChange={(e) => update({ cabin: e.target.value as CabinClass })}
            className={`${fieldClass} border-control-border`}
          >
            {CABIN_CLASSES.map((c) => (
              <option key={c} value={c}>
                {t(`search.cabins.${c}`)}
              </option>
            ))}
          </select>
        </div>
        <Button
          type="submit"
          size="lg"
          className="h-12 sm:col-span-2 md:col-span-1 md:col-start-4 md:min-w-44"
        >
          <Search aria-hidden className="size-4" />
          {t('search.submit')}
        </Button>
      </div>
      <p role="alert" className="text-body-sm text-danger empty:hidden">
        {errorCount > 0 ? t('search.fixErrors', { count: errorCount }) : ''}
      </p>
    </form>
  );
};
