import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Copy, SearchX } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { ApiClientError } from '../../../services/api-client';

/** Route-shaped skeleton: the product's course line, drawn while fares load. */
export const SearchLoading = ({ from, to }: { from: string; to: string }) => {
  const { t } = useTranslation();
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setSlow(true), 6_000);
    return () => clearTimeout(id);
  }, []);
  return (
    <div aria-busy="true" className="space-y-4">
      <div className="rounded-panel border border-border bg-surface px-5 py-6">
        <div className="flex items-center gap-4">
          <span className="font-display text-headline font-semibold [font-stretch:112%]">{from}</span>
          <div className="relative h-px flex-1 overflow-hidden bg-border">
            <span className="search-sweep absolute inset-y-0 left-0 w-1/3 bg-course" />
          </div>
          <span className="font-display text-headline font-semibold [font-stretch:112%]">{to}</span>
        </div>
        <p role="status" className="mt-3 text-body-sm text-muted">
          {slow ? t('results.stillSearching') : t('results.searching')}
        </p>
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} className="rounded-panel border border-border bg-surface p-5" aria-hidden>
          <div className="flex items-center gap-3">
            <span className="skeleton size-10 rounded-control" />
            <span className="skeleton h-3 w-40 rounded" />
          </div>
          <div className="mt-5 flex items-center gap-6">
            <span className="skeleton h-7 w-16 rounded" />
            <span className="skeleton h-px flex-1" />
            <span className="skeleton h-7 w-16 rounded" />
            <span className="skeleton ml-6 hidden h-8 w-24 rounded sm:block" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const SearchError = ({ error, onRetry }: { error: unknown; onRetry: () => void }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const e = error instanceof ApiClientError ? error : undefined;
  const known = [
    'FLIGHT_PROVIDER_TIMEOUT',
    'FLIGHT_PROVIDER_UNAVAILABLE',
    'RATE_LIMITED',
    'NETWORK_ERROR',
    'TIMEOUT',
  ] as const;
  const code = known.find((k) => k === e?.code);
  // Validation errors come with a server message written for travellers.
  const message = code
    ? t(`results.error.${code}`)
    : e?.status === 400
      ? e.message
      : t('results.error.default');

  return (
    <div role="alert" className="rounded-panel border border-border bg-surface p-6">
      <h2 className="text-title font-semibold">{t('results.error.title')}</h2>
      <p className="mt-2 measure text-muted">{message}</p>
      {e?.issues.length ? (
        <ul className="mt-2 list-inside list-disc text-body-sm text-muted">
          {e.issues.map((i) => (
            <li key={i.path}>{i.message}</li>
          ))}
        </ul>
      ) : null}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {e?.status !== 400 && <Button onClick={onRetry}>{t('results.error.retry')}</Button>}
        {e?.requestId && (
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard?.writeText(e.requestId ?? '').then(() => setCopied(true));
            }}
            className="flex items-center gap-1.5 rounded-control px-2 py-1.5 text-body-sm text-muted hover:bg-surface-muted"
          >
            {copied ? <Check aria-hidden className="size-4" /> : <Copy aria-hidden className="size-4" />}
            {copied ? t('results.error.copied') : t('results.error.copy')}
            <code className="font-mono text-caption">{e.requestId.slice(0, 8)}</code>
          </button>
        )}
      </div>
    </div>
  );
};

export const EmptyState = ({
  title,
  body,
  actions,
}: {
  title: string;
  body: string;
  actions?: React.ReactNode;
}) => (
  <div className="rounded-panel border border-dashed border-control-border bg-surface px-6 py-10 text-center">
    <SearchX aria-hidden className="mx-auto size-8 text-muted" />
    <h2 className="mt-3 text-title font-semibold">{title}</h2>
    <p className="mx-auto mt-1 measure text-muted">{body}</p>
    {actions && <div className="mt-5 flex flex-wrap justify-center gap-2">{actions}</div>}
  </div>
);
