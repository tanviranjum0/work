import { NavLink, Outlet } from 'react-router';
import { useTranslation } from 'react-i18next';

const tab = ({ isActive }: { isActive: boolean }) =>
  `rounded-control px-3 py-2 text-body-sm font-semibold ${
    isActive ? 'bg-surface-muted text-fg' : 'text-muted hover:text-fg'
  }`;

/** Read-only operational visibility for the ADMIN role. Mirrors AccountLayout's shape. */
export const AdminLayout = () => {
  const { t } = useTranslation();
  return (
    <div className="content-width py-8">
      <h1 className="text-headline font-semibold">{t('admin.title')}</h1>
      <div className="mt-6 grid gap-8 lg:grid-cols-[13rem_minmax(0,1fr)]">
        <nav aria-label={t('admin.title')} className="flex gap-1 overflow-x-auto lg:flex-col">
          <NavLink to="/admin" end className={tab}>
            {t('admin.nav.overview')}
          </NavLink>
          <NavLink to="/admin/users" className={tab}>
            {t('admin.nav.users')}
          </NavLink>
          <NavLink to="/admin/bookings" className={tab}>
            {t('admin.nav.bookings')}
          </NavLink>
          <NavLink to="/admin/audit-log" className={tab}>
            {t('admin.nav.auditLog')}
          </NavLink>
        </nav>
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
