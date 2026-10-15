import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { BookmarkCheck, BookmarkPlus } from 'lucide-react';
import { SAVED_SEARCH_PARAM_KEYS, type PlaceSummary } from '@aeronova/shared';
import { cityOf } from '../search/places';
import { useAuth } from '../auth/auth-context';
import { useSavedSearchMutations } from './account-queries';

/** Keeps only the parameters that describe the search itself: no filters, no sort. */
const searchParamsOnly = (params: URLSearchParams): Record<string, string> => {
  const out: Record<string, string> = {};
  for (const key of SAVED_SEARCH_PARAM_KEYS) {
    const value = params.get(key);
    if (value) out[key] = value;
  }
  return out;
};

export const SaveSearchButton = ({
  places,
}: {
  places?: Readonly<Record<string, PlaceSummary>> | undefined;
}) => {
  const { t } = useTranslation();
  const { isSignedIn } = useAuth();
  const [params] = useSearchParams();
  const { create } = useSavedSearchMutations();
  const [savedId, setSavedId] = useState<string | null>(null);

  if (!isSignedIn) {
    const next = `/search?${params.toString()}`;
    return (
      <Link
        to={`/signin?next=${encodeURIComponent(next)}`}
        className="flex items-center gap-2 rounded-control px-3 py-2 text-body-sm font-semibold text-primary hover:bg-surface-muted"
      >
        <BookmarkPlus aria-hidden className="size-4" />
        {t('account.saveSearch.signedOut')}
      </Link>
    );
  }

  if (savedId) {
    return (
      <p className="flex items-center gap-2 px-3 py-2 text-body-sm text-success">
        <BookmarkCheck aria-hidden className="size-4" />
        {t('account.saveSearch.saved')}
      </p>
    );
  }

  const label = () => {
    const from = params.get('from');
    const to = params.get('to');
    return from && to ? `${cityOf(places, from)} – ${cityOf(places, to)}` : t('results.multiTitle');
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={create.isPending}
        onClick={() =>
          create.mutate(
            { label: label(), params: searchParamsOnly(params) },
            { onSuccess: (saved) => setSavedId(saved.id) },
          )
        }
        className="flex items-center gap-2 rounded-control px-3 py-2 text-body-sm font-semibold text-primary hover:bg-surface-muted disabled:opacity-60"
      >
        <BookmarkPlus aria-hidden className="size-4" />
        {t('account.saveSearch.action')}
      </button>
      {create.isError && (
        <p role="alert" className="text-caption text-danger">
          {t('account.saveSearch.failed')}
        </p>
      )}
    </div>
  );
};
