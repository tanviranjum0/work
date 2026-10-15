import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { formatWallDate } from '../search/format';
import { useSavedSearchMutations, useSavedSearches } from './account-queries';

export const SavedSearchesPage = () => {
  const { t } = useTranslation();
  const searches = useSavedSearches();
  const { remove } = useSavedSearchMutations();

  return (
    <section aria-labelledby="searches-heading">
      <h2 id="searches-heading" className="text-title font-semibold">
        {t('account.searches.title')}
      </h2>
      <p className="mt-1 measure text-body-sm text-muted">{t('account.searches.lede')}</p>

      <ul className="mt-6 space-y-2">
        {searches.data?.map((saved) => (
          <li
            key={saved.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-panel border border-border bg-surface px-4 py-3"
          >
            <div className="min-w-0">
              <p className="truncate font-semibold">{saved.label}</p>
              <p className="text-caption text-muted tabular">
                {saved.params.from && saved.params.to ? `${saved.params.from}–${saved.params.to}, ` : ''}
                {t('account.searches.saved', { date: formatWallDate(saved.createdAt.slice(0, 10)) })}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Link
                to={`/search?${new URLSearchParams(saved.params as Record<string, string>).toString()}`}
                className="rounded-control px-3 py-2 text-body-sm font-semibold text-primary hover:bg-surface-muted"
              >
                {t('account.searches.open')}
              </Link>
              <Button variant="ghost" onClick={() => remove.mutate(saved.id)}>
                <Trash2 aria-hidden className="size-4" />
                {t('account.searches.delete')}
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {searches.data?.length === 0 && (
        <div className="mt-6 rounded-panel border border-dashed border-control-border px-6 py-10 text-center">
          <p className="font-semibold">{t('account.searches.empty')}</p>
          <p className="mt-1 text-body-sm text-muted">{t('account.searches.emptyBody')}</p>
        </div>
      )}
    </section>
  );
};
