import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import {
  CABIN_CLASSES,
  CURRENCY_CODES,
  type CabinClass,
  type CurrencyCode,
  type UpdateProfileInput,
} from '@aeronova/shared';
import { Button } from '../../components/ui/Button';
import { apiClient } from '../../services/api-client';
import { useAuth } from '../auth/auth-context';

const field =
  'mt-1 h-11 w-full rounded-control border border-control-border bg-surface px-3 text-body text-fg';

export const ProfilePage = () => {
  const { t } = useTranslation();
  const { user, setUser } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [currency, setCurrency] = useState<CurrencyCode>(user?.preferences.currency ?? 'USD');
  const [cabin, setCabin] = useState<CabinClass>(user?.preferences.cabin ?? 'economy');
  const [maxStops, setMaxStops] = useState<string>(String(user?.preferences.maxStops ?? ''));
  const [saved, setSaved] = useState(false);

  const save = useMutation({
    mutationFn: (patch: UpdateProfileInput) => apiClient.updateMe(patch),
    onSuccess: (profile) => {
      setUser(profile);
      setSaved(true);
    },
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSaved(false);
    save.mutate({
      displayName: displayName.trim(),
      preferences: { currency, cabin, maxStops: maxStops === '' ? null : (Number(maxStops) as 0 | 1 | 2) },
    });
  };

  return (
    <section aria-labelledby="profile-heading" className="max-w-xl">
      <h2 id="profile-heading" className="text-title font-semibold">
        {t('account.profile.title')}
      </h2>
      <p className="mt-1 measure text-body-sm text-muted">{t('account.profile.lede')}</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="display-name" className="block text-caption font-semibold text-muted">
            {t('account.profile.displayName')}
          </label>
          <input
            id="display-name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className={field}
          />
        </div>
        <div>
          <label htmlFor="account-email" className="block text-caption font-semibold text-muted">
            {t('account.profile.email')}
          </label>
          <input
            id="account-email"
            value={user?.email ?? ''}
            readOnly
            disabled
            className={`${field} text-muted`}
          />
          <p className="mt-1 text-caption text-muted">{t('account.profile.emailNote')}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="pref-currency" className="block text-caption font-semibold text-muted">
              {t('account.profile.currency')}
            </label>
            <select
              id="pref-currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className={field}
            >
              {CURRENCY_CODES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="pref-cabin" className="block text-caption font-semibold text-muted">
              {t('account.profile.cabin')}
            </label>
            <select
              id="pref-cabin"
              value={cabin}
              onChange={(e) => setCabin(e.target.value as CabinClass)}
              className={field}
            >
              {CABIN_CLASSES.map((c) => (
                <option key={c} value={c}>
                  {t(`search.cabins.${c}`)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="pref-stops" className="block text-caption font-semibold text-muted">
              {t('account.profile.maxStops')}
            </label>
            <select
              id="pref-stops"
              value={maxStops}
              onChange={(e) => setMaxStops(e.target.value)}
              className={field}
            >
              <option value="">{t('account.profile.anyStops')}</option>
              <option value="0">{t('account.profile.stops0')}</option>
              <option value="1">{t('account.profile.stops1')}</option>
              <option value="2">{t('account.profile.stops2')}</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" busy={save.isPending}>
            {t('account.profile.save')}
          </Button>
          <p role="status" className="text-body-sm text-success empty:hidden">
            {saved ? t('account.profile.saved') : ''}
          </p>
          {save.isError && (
            <p role="alert" className="text-body-sm text-danger">
              {t('account.profile.saveFailed')}
            </p>
          )}
        </div>
      </form>
    </section>
  );
};
