import { useTranslation } from 'react-i18next';
import { GENDERS, TRAVELER_TITLES, type SavedTraveler } from '@aeronova/shared';

export interface PassengerFormValues {
  type: 'adult' | 'child' | 'infant';
  title: string;
  givenName: string;
  middleName: string;
  familyName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  passportNumber: string;
  passportCountry: string;
  passportExpiry: string;
  loyaltyNumber: string;
}

export const emptyPassenger = (type: PassengerFormValues['type']): PassengerFormValues => ({
  type,
  title: '',
  givenName: '',
  middleName: '',
  familyName: '',
  dateOfBirth: '',
  gender: '',
  nationality: '',
  passportNumber: '',
  passportCountry: '',
  passportExpiry: '',
  loyaltyNumber: '',
});

export const fromSavedTraveler = (
  t: SavedTraveler,
  type: PassengerFormValues['type'],
): PassengerFormValues => ({
  ...emptyPassenger(type),
  title: t.title ?? '',
  givenName: t.givenName,
  middleName: t.middleName ?? '',
  familyName: t.familyName,
  dateOfBirth: t.dateOfBirth,
  gender: t.gender ?? '',
  nationality: t.nationality ?? '',
});

/** Only sends a travel document when one was actually entered. */
export const toPassengerPayload = (v: PassengerFormValues) => ({
  type: v.type,
  title: v.title || null,
  givenName: v.givenName.trim(),
  middleName: v.middleName.trim() || null,
  familyName: v.familyName.trim(),
  dateOfBirth: v.dateOfBirth,
  gender: v.gender || null,
  nationality: v.nationality.trim().toUpperCase() || null,
  travelDocument: v.passportNumber.trim()
    ? {
        type: 'passport' as const,
        number: v.passportNumber.trim().toUpperCase(),
        issuingCountry: v.passportCountry.trim().toUpperCase(),
        expiryDate: v.passportExpiry,
      }
    : null,
  loyaltyNumber: v.loyaltyNumber.trim() || null,
});

const label = 'block text-caption font-semibold text-muted';
const field =
  'mt-1 h-11 w-full rounded-control border border-control-border bg-surface px-3 text-body text-fg focus:outline-2 focus:outline-offset-0 focus:outline-primary';

/**
 * Defined at module scope on purpose: a component declared inside the parent's
 * render is a new type on every keystroke, so React remounts the input and the
 * field loses focus after one character.
 */
const TextField = ({
  id,
  labelText,
  value,
  onChange,
  error,
  type = 'text',
  autoComplete,
}: {
  id: string;
  labelText: string;
  value: string;
  onChange: (next: string) => void;
  error?: string | undefined;
  type?: string;
  autoComplete?: string;
}) => (
  <div>
    <label className={label} htmlFor={id}>
      {labelText}
    </label>
    <input
      id={id}
      type={type}
      autoComplete={autoComplete}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${id}-error` : undefined}
      className={`${field} ${error ? 'border-danger' : ''}`}
    />
    {error && (
      <p id={`${id}-error`} className="mt-1 text-caption text-danger">
        {error}
      </p>
    )}
  </div>
);

interface Props {
  readonly index: number;
  readonly value: PassengerFormValues;
  readonly saved: readonly SavedTraveler[];
  readonly onChange: (next: PassengerFormValues) => void;
  readonly issues: Readonly<Record<string, string>>;
}

export const PassengerForm = ({ index, value, saved, onChange, issues }: Props) => {
  const { t } = useTranslation();
  const id = (name: string) => `p${index}-${name}`;
  const set = (patch: Partial<PassengerFormValues>) => onChange({ ...value, ...patch });
  const error = (name: string) => issues[`passengers.${index}.${name}`];

  return (
    <fieldset className="rounded-panel border border-border bg-surface p-4 sm:p-5">
      <legend className="px-1 font-sans text-body font-semibold [font-stretch:100%]">
        {t(`booking.passengerTitles.${value.type}`, { n: index + 1 })}
      </legend>

      {saved.length > 0 && (
        <div className="mb-4">
          <label className={label} htmlFor={id('saved')}>
            {t('booking.form.useSaved')}
          </label>
          <select
            id={id('saved')}
            className={field}
            value=""
            onChange={(e) => {
              const picked = saved.find((s) => s.id === e.target.value);
              if (picked) onChange(fromSavedTraveler(picked, value.type));
            }}
          >
            <option value="">{t('booking.form.choose')}</option>
            {saved.map((s) => (
              <option key={s.id} value={s.id}>
                {[s.givenName, s.familyName].join(' ')}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor={id('title')}>
            {t('booking.form.title')}
          </label>
          <select
            id={id('title')}
            className={field}
            value={value.title}
            onChange={(e) => set({ title: e.target.value })}
          >
            <option value="">{t('booking.form.none')}</option>
            {TRAVELER_TITLES.map((v) => (
              <option key={v} value={v}>
                {v.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        <TextField
          id={id('dateOfBirth')}
          value={value.dateOfBirth}
          onChange={(v) => set({ dateOfBirth: v })}
          error={error('dateOfBirth')}
          labelText={t('booking.form.dateOfBirth')}
          type="date"
          autoComplete="bday"
        />
        <TextField
          id={id('givenName')}
          value={value.givenName}
          onChange={(v) => set({ givenName: v })}
          error={error('givenName')}
          labelText={t('booking.form.givenName')}
          autoComplete="given-name"
        />
        <TextField
          id={id('familyName')}
          value={value.familyName}
          onChange={(v) => set({ familyName: v })}
          error={error('familyName')}
          labelText={t('booking.form.familyName')}
          autoComplete="family-name"
        />
        <TextField
          id={id('middleName')}
          value={value.middleName}
          onChange={(v) => set({ middleName: v })}
          error={error('middleName')}
          labelText={t('booking.form.middleName')}
        />
        <div>
          <label className={label} htmlFor={id('gender')}>
            {t('booking.form.gender')}
          </label>
          <select
            id={id('gender')}
            className={field}
            value={value.gender}
            onChange={(e) => set({ gender: e.target.value })}
          >
            <option value="">{t('booking.form.none')}</option>
            {GENDERS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <TextField
          id={id('nationality')}
          value={value.nationality}
          onChange={(v) => set({ nationality: v })}
          error={error('nationality')}
          labelText={t('booking.form.nationality')}
          autoComplete="country"
        />
        <TextField
          id={id('loyaltyNumber')}
          value={value.loyaltyNumber}
          onChange={(v) => set({ loyaltyNumber: v })}
          error={error('loyaltyNumber')}
          labelText={t('booking.form.loyalty')}
        />
        <TextField
          id={id('passportNumber')}
          value={value.passportNumber}
          onChange={(v) => set({ passportNumber: v })}
          error={error('passportNumber')}
          labelText={t('booking.form.passport')}
        />
        <TextField
          id={id('passportCountry')}
          value={value.passportCountry}
          onChange={(v) => set({ passportCountry: v })}
          error={error('passportCountry')}
          labelText={t('booking.form.passportCountry')}
        />
        <TextField
          id={id('passportExpiry')}
          value={value.passportExpiry}
          onChange={(v) => set({ passportExpiry: v })}
          error={error('passportExpiry')}
          labelText={t('booking.form.passportExpiry')}
          type="date"
        />
      </div>
      <p className="mt-3 text-caption text-muted">{t('booking.form.passportNote')}</p>
    </fieldset>
  );
};
