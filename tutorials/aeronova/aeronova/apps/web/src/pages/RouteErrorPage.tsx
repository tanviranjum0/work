import { isRouteErrorResponse, useRouteError } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { ApiClientError } from '../services/api-client';
import { NotFoundPage } from './NotFoundPage';

/** Last-resort boundary. Shows a support reference, never an exception message or stack. */
export const RouteErrorPage = () => {
  const { t } = useTranslation();
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 404) return <NotFoundPage />;

  const reference = error instanceof ApiClientError ? error.requestId : undefined;
  return (
    <section role="alert" className="content-width flex flex-1 flex-col justify-center gap-4 py-24">
      <h1 className="text-headline font-semibold">{t('errors.routeTitle')}</h1>
      <p className="measure text-muted">{t('errors.routeBody')}</p>
      {reference && (
        <code className="w-fit rounded-control bg-surface-muted px-2 py-1 font-mono text-body-sm">
          {reference}
        </code>
      )}
      <Button className="w-fit" onClick={() => window.location.reload()}>
        {t('errors.reload')}
      </Button>
    </section>
  );
};
