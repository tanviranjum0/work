import { NavLink, Outlet } from 'react-router';
import { useTranslation } from 'react-i18next';

const tab = ({ isActive }: { isActive: boolean }) =>
  `rounded-control px-3 py-2 text-body-sm font-semibold ${
    isActive ? 'bg-surface-muted text-fg' : 'text-muted hover:text-fg'
  }`;

export const AccountLayout = () => {
  const { t } = useTranslation();
  return (
    <div className="content-width py-8">
      <h1 className="text-headline font-semibold">{t('account.title')}</h1>
      <div className="mt-6 grid gap-8 lg:grid-cols-[13rem_minmax(0,1fr)]">
        <nav aria-label={t('account.title')} className="flex gap-1 overflow-x-auto lg:flex-col">
          <NavLink to="/account" end className={tab}>
            {t('account.nav.profile')}
          </NavLink>
          <NavLink to="/account/travelers" className={tab}>
            {t('account.nav.travelers')}
          </NavLink>
          <NavLink to="/account/searches" className={tab}>
            {t('account.nav.searches')}
          </NavLink>
        </nav>
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
