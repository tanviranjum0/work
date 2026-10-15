import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { GENDERS, TRAVELER_TITLES, type SavedTraveler } from '@aeronova/shared';
import { Button } from '../../components/ui/Button';
import { ApiClientError } from '../../services/api-client';
import { useTravelerMutations, useTravelers } from './account-queries';

const field =
  'mt-1 h-11 w-full rounded-control border border-control-border bg-surface px-3 text-body text-fg';
const label = 'block text-caption font-semibold text-muted';

interface FormValues {
  title: string;
  givenName: string;
  middleName: string;
  familyName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
}

const emptyForm: FormValues = {
  title: '',
  givenName: '',
  middleName: '',
  familyName: '',
  dateOfBirth: '',
  gender: '',
  nationality: '',
};

const fullName = (t: SavedTraveler) => [t.givenName, t.middleName, t.familyName].filter(Boolean).join(' ');

const toForm = (t: SavedTraveler): FormValues => ({
  title: t.title ?? '',
  givenName: t.givenName,
  middleName: t.middleName ?? '',
  familyName: t.familyName,
  dateOfBirth: t.dateOfBirth,
  gender: t.gender ?? '',
  nationality: t.nationality ?? '',
});

const toPayload = (v: FormValues) => ({
  title: v.title || null,
  givenName: v.givenName.trim(),
  middleName: v.middleName.trim() || null,
  familyName: v.familyName.trim(),
  dateOfBirth: v.dateOfBirth,
  gender: v.gender || null,
  nationality: v.nationality.trim().toUpperCase() || null,
  loyaltyAccounts: [],
});

export const TravelersPage = () => {
  const { t } = useTranslation();
  const travelers = useTravelers();
  const { create, update, remove } = useTravelerMutations();
  const [editing, setEditing] = useState<SavedTraveler | 'new' | null>(null);
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null);

  const open = (traveler: SavedTraveler | 'new') => {
    setEditing(traveler);
    setForm(traveler === 'new' ? emptyForm : toForm(traveler));
    setError(null);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const body = toPayload(form);
    try {
      if (editing === 'new') await create.mutateAsync(body);
      else if (editing) await update.mutateAsync({ id: editing.id, body });
      setEditing(null);
    } catch (err) {
      // Field-level messages from the server are written for travellers.
      setError(
        err instanceof ApiClientError
          ? (err.issues[0]?.message ?? err.message)
          : t('account.travelers.failed'),
      );
    }
  };

  return (
    <section aria-labelledby="travelers-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="travelers-heading" className="text-title font-semibold">
            {t('account.travelers.title')}
          </h2>
          <p className="mt-1 measure text-body-sm text-muted">{t('account.travelers.lede')}</p>
        </div>
        {editing === null && (
          <Button onClick={() => open('new')}>
            <Plus aria-hidden className="size-4" />
            {t('account.travelers.add')}
          </Button>
        )}
      </div>

      {editing !== null && (
        <form
          onSubmit={(e) => void onSubmit(e)}
          noValidate
          className="mt-6 rounded-panel border border-border bg-surface p-4 sm:p-5"
        >
          <h3 className="font-sans text-body font-semibold [font-stretch:100%]">
            {t(editing === 'new' ? 'account.travelers.form.addTitle' : 'account.travelers.form.editTitle')}
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="tr-title">
                {t('account.travelers.form.title')}
              </label>
              <select
                id="tr-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={field}
              >
                <option value="">{t('account.travelers.form.none')}</option>
                {TRAVELER_TITLES.map((v) => (
                  <option key={v} value={v}>
                    {v.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={label} htmlFor="tr-dob">
                {t('account.travelers.form.dateOfBirth')}
              </label>
              <input
                id="tr-dob"
                type="date"
                required
                value={form.dateOfBirth}
                onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                className={`${field} tabular`}
              />
            </div>
            <div>
              <label className={label} htmlFor="tr-given">
                {t('account.travelers.form.givenName')}
              </label>
              <input
                id="tr-given"
                required
                autoComplete="given-name"
                value={form.givenName}
                onChange={(e) => setForm({ ...form, givenName: e.target.value })}
                className={field}
              />
            </div>
            <div>
              <label className={label} htmlFor="tr-family">
                {t('account.travelers.form.familyName')}
              </label>
              <input
                id="tr-family"
                required
                autoComplete="family-name"
                value={form.familyName}
                onChange={(e) => setForm({ ...form, familyName: e.target.value })}
                className={field}
              />
            </div>
            <div>
              <label className={label} htmlFor="tr-middle">
                {t('account.travelers.form.middleName')}
              </label>
              <input
                id="tr-middle"
                value={form.middleName}
                onChange={(e) => setForm({ ...form, middleName: e.target.value })}
                className={field}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={label} htmlFor="tr-gender">
                  {t('account.travelers.form.gender')}
                </label>
                <select
                  id="tr-gender"
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className={field}
                >
                  <option value="">{t('account.travelers.form.none')}</option>
                  {GENDERS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={label} htmlFor="tr-nat">
                  {t('account.travelers.form.nationality')}
                </label>
                <input
                  id="tr-nat"
                  maxLength={2}
                  value={form.nationality}
                  onChange={(e) => setForm({ ...form, nationality: e.target.value })}
                  className={`${field} uppercase`}
                />
              </div>
            </div>
          </div>

          {error && (
            <p role="alert" className="mt-3 text-body-sm text-danger">
              {error}
            </p>
          )}
          <div className="mt-4 flex gap-3">
            <Button type="submit" busy={create.isPending || update.isPending}>
              {t('account.travelers.form.save')}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
              {t('account.travelers.form.cancel')}
            </Button>
          </div>
        </form>
      )}

      <ul className="mt-6 space-y-2">
        {travelers.data?.map((traveler) => (
          <li
            key={traveler.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-panel border border-border bg-surface px-4 py-3"
          >
            <div>
              <p className="font-semibold">{fullName(traveler)}</p>
              <p className="text-caption text-muted tabular">
                {traveler.dateOfBirth}
                {traveler.nationality ? `, ${traveler.nationality}` : ''}
              </p>
            </div>
            {confirming === traveler.id ? (
              // Inline confirmation rather than a browser dialog: it stays inside the
              // page, is announced to screen readers, and keeps the traveller's name visible.
              <div
                role="group"
                aria-label={t('account.travelers.deleteConfirm', { name: fullName(traveler) })}
                className="flex flex-wrap items-center gap-2"
              >
                <p className="text-body-sm">
                  {t('account.travelers.deleteConfirm', { name: fullName(traveler) })}
                </p>
                <Button
                  variant="secondary"
                  busy={remove.isPending}
                  onClick={() => remove.mutate(traveler.id, { onSettled: () => setConfirming(null) })}
                >
                  {t('account.travelers.confirmDelete')}
                </Button>
                <Button variant="ghost" onClick={() => setConfirming(null)}>
                  {t('account.travelers.form.cancel')}
                </Button>
              </div>
            ) : (
              <div className="flex gap-1">
                <Button variant="ghost" onClick={() => open(traveler)}>
                  <Pencil aria-hidden className="size-4" />
                  {t('account.travelers.edit')}
                </Button>
                <Button variant="ghost" onClick={() => setConfirming(traveler.id)}>
                  <Trash2 aria-hidden className="size-4" />
                  {t('account.travelers.delete')}
                </Button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {travelers.data?.length === 0 && editing === null && (
        <div className="mt-6 rounded-panel border border-dashed border-control-border px-6 py-10 text-center">
          <p className="font-semibold">{t('account.travelers.empty')}</p>
          <p className="mt-1 text-body-sm text-muted">{t('account.travelers.emptyBody')}</p>
        </div>
      )}
    </section>
  );
};
