import { useTranslation } from 'react-i18next';
import { useHealth } from '../../lib/use-health';

export const SiteFooter = () => {
  const { t } = useTranslation();
  const { data } = useHealth();
  const simulated = data !== undefined && data.mode !== 'production';

  return (
    <footer className="mt-auto border-t border-border">
      <div className="content-width grid gap-3 py-8 text-caption text-muted md:grid-cols-[1fr_auto] md:items-end">
        <div className="measure space-y-1.5">
          {simulated && <p>{t('footer.disclaimer')}</p>}
          <p>{t('footer.positioning')}</p>
        </div>
        <p className="tabular">{t('footer.copyright', { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
};
