import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AUDIT_EVENT_TYPES, type AuditEventType } from '@aeronova/shared';
import { useAdminAuditLog } from './admin-queries';

const contextSummary = (context: Readonly<Record<string, string>>): string =>
  Object.entries(context)
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ');

export const AdminAuditLogPage = () => {
  const { t } = useTranslation();
  const [type, setType] = useState<AuditEventType | ''>('');
  const log = useAdminAuditLog({ limit: 100, ...(type ? { type } : {}) });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-title font-semibold">{t('admin.auditLog.title')}</h2>
          <p className="mt-1 measure text-muted">{t('admin.auditLog.lede')}</p>
        </div>
        <label className="text-body-sm">
          <span className="sr-only">{t('admin.auditLog.type')}</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as AuditEventType | '')}
            className="h-9 rounded-control border border-control-border bg-surface px-2"
          >
            <option value="">{t('admin.auditLog.allTypes')}</option>
            {AUDIT_EVENT_TYPES.map((eventType) => (
              <option key={eventType} value={eventType}>
                {t(`admin.auditLog.types.${eventType}`)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {log.isError && <p className="mt-4 text-danger">{t('admin.loadFailed')}</p>}
      {log.data?.length === 0 && <p className="mt-4 text-muted">{t('admin.empty')}</p>}

      {log.data && log.data.length > 0 && (
        <div className="mt-4 overflow-x-auto rounded-panel border border-border">
          <table className="w-full text-body-sm">
            <thead>
              <tr className="border-b border-border bg-surface-muted text-left">
                <th scope="col" className="px-3 py-2 font-semibold">
                  {t('admin.auditLog.when')}
                </th>
                <th scope="col" className="px-3 py-2 font-semibold">
                  {t('admin.auditLog.type')}
                </th>
                <th scope="col" className="px-3 py-2 font-semibold">
                  {t('admin.auditLog.actor')}
                </th>
                <th scope="col" className="px-3 py-2 font-semibold">
                  {t('admin.auditLog.details')}
                </th>
              </tr>
            </thead>
            <tbody>
              {log.data.map((event) => (
                <tr key={event.id} className="border-b border-border last:border-b-0">
                  <td className="px-3 py-2 whitespace-nowrap tabular">
                    {new Date(event.at).toLocaleString()}
                  </td>
                  <td className="px-3 py-2">{t(`admin.auditLog.types.${event.type}`)}</td>
                  <td className="px-3 py-2">{event.actorEmail ?? t('admin.auditLog.unknownActor')}</td>
                  <td className="px-3 py-2 text-muted">{contextSummary(event.context)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
