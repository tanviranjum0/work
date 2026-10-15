import { useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { BOOKING_STATES, formatMoney, type BookingState } from '@aeronova/shared';
import { useAdminBookings } from './admin-queries';
import { StateBadge } from './StateBadge';

export const AdminBookingsPage = () => {
  const { t } = useTranslation();
  const [state, setState] = useState<BookingState | ''>('');
  const bookings = useAdminBookings({ limit: 100, ...(state ? { state } : {}) });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-title font-semibold">{t('admin.bookings.title')}</h2>
          <p className="mt-1 measure text-muted">{t('admin.bookings.lede')}</p>
        </div>
        <label className="text-body-sm">
          <span className="sr-only">{t('admin.bookings.state')}</span>
          <select
            value={state}
            onChange={(e) => setState(e.target.value as BookingState | '')}
            className="h-9 rounded-control border border-control-border bg-surface px-2"
          >
            <option value="">{t('admin.bookings.allStates')}</option>
            {BOOKING_STATES.map((s) => (
              <option key={s} value={s}>
                {t(`trips.states.${s}`)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {bookings.isError && <p className="mt-4 text-danger">{t('admin.loadFailed')}</p>}
      {bookings.data?.length === 0 && <p className="mt-4 text-muted">{t('admin.empty')}</p>}

      {bookings.data && bookings.data.length > 0 && (
        <div className="mt-4 overflow-x-auto rounded-panel border border-border">
          <table className="w-full text-body-sm">
            <thead>
              <tr className="border-b border-border bg-surface-muted text-left">
                <th scope="col" className="px-3 py-2 font-semibold">
                  {t('admin.bookings.reference')}
                </th>
                <th scope="col" className="px-3 py-2 font-semibold">
                  {t('admin.bookings.state')}
                </th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">
                  {t('admin.bookings.total')}
                </th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">
                  {t('admin.bookings.created')}
                </th>
                <th scope="col" className="px-3 py-2">
                  <span className="sr-only">{t('admin.bookings.view')}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.data.map((b) => (
                <tr key={b.id} className="border-b border-border last:border-b-0">
                  <td className="px-3 py-2 font-mono">{b.reference}</td>
                  <td className="px-3 py-2">
                    <StateBadge state={b.state} />
                  </td>
                  <td className="px-3 py-2 text-right tabular">{formatMoney(b.total)}</td>
                  <td className="px-3 py-2 text-right tabular">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Link
                      to={`/admin/bookings/${b.reference}`}
                      className="font-semibold text-primary underline"
                    >
                      {t('admin.bookings.view')}
                    </Link>
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
