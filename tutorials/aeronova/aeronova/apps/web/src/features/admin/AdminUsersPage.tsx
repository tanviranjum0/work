import { useTranslation } from 'react-i18next';
import { useAdminUsers } from './admin-queries';

export const AdminUsersPage = () => {
  const { t } = useTranslation();
  const users = useAdminUsers(100);

  return (
    <div>
      <h2 className="text-title font-semibold">{t('admin.users.title')}</h2>
      <p className="mt-1 measure text-muted">{t('admin.users.lede')}</p>

      {users.isError && <p className="mt-4 text-danger">{t('admin.loadFailed')}</p>}
      {users.data?.length === 0 && <p className="mt-4 text-muted">{t('admin.empty')}</p>}

      {users.data && users.data.length > 0 && (
        <div className="mt-4 overflow-x-auto rounded-panel border border-border">
          <table className="w-full text-body-sm">
            <thead>
              <tr className="border-b border-border bg-surface-muted text-left">
                <th scope="col" className="px-3 py-2 font-semibold">
                  {t('admin.users.email')}
                </th>
                <th scope="col" className="px-3 py-2 font-semibold">
                  {t('admin.users.name')}
                </th>
                <th scope="col" className="px-3 py-2 font-semibold">
                  {t('admin.users.roles')}
                </th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">
                  {t('admin.users.joined')}
                </th>
              </tr>
            </thead>
            <tbody>
              {users.data.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-b-0">
                  <td className="px-3 py-2">{u.email}</td>
                  <td className="px-3 py-2">{u.displayName}</td>
                  <td className="px-3 py-2">{u.roles.join(', ')}</td>
                  <td className="px-3 py-2 text-right tabular">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
