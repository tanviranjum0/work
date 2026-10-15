import { useTranslation } from 'react-i18next';
import { FlaskConical, TriangleAlert } from 'lucide-react';
import { useHealth } from '../../lib/use-health';

/**
 * States plainly when the data on screen is not live. Rendered from what the
 * API reports, never from a frontend guess.
 */
export const ModeNotice = () => {
  const { t } = useTranslation();
  const { data, isError } = useHealth();

  if (isError) {
    return (
      <p role="status" className="flex items-center gap-2 bg-surface-muted px-4 py-2 text-caption text-fg">
        <TriangleAlert aria-hidden className="size-4 shrink-0 text-warning" />
        {t('mode.offline')}
      </p>
    );
  }
  if (!data || data.mode === 'production') return null;

  return (
    <p className="flex items-center gap-2 border-b border-border bg-surface-muted py-2 text-caption text-fg">
      <span className="content-width flex items-center gap-2">
        <FlaskConical aria-hidden className="size-4 shrink-0 text-info" />
        {t(data.mode === 'demo' ? 'mode.demo' : 'mode.test')}
      </span>
    </p>
  );
};
