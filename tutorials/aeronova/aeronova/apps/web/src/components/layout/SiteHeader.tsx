import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { BrandMark } from '../brand/BrandMark';
import { AccountMenu } from './AccountMenu';
import { ThemeToggle } from './ThemeToggle';

/**
 * Primary navigation items are added only when their pages exist, so the
 * header never contains dead links.
 */
export const SiteHeader = () => {
  const { t } = useTranslation();
  return (
    <header className="sticky top-0 z-(--z-header) border-b border-border bg-bg/90 backdrop-blur-sm supports-[backdrop-filter]:bg-bg/75">
      <div className="content-width flex h-16 items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center gap-2.5 rounded-control text-fg"
          aria-label={t('brand.home')}
        >
          <BrandMark className="size-7" />
          <span className="font-display text-title font-semibold [font-stretch:118%]">{t('brand.name')}</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <AccountMenu />
        </div>
      </div>
    </header>
  );
};
