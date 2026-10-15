import { useTranslation } from 'react-i18next';
import { needsAttention, type BookingState } from '@aeronova/shared';

export const StateBadge = ({ state }: { state: BookingState }) => {
  const { t } = useTranslation();
  const tone = needsAttention(state)
    ? 'border-warning text-warning'
    : state === 'TICKETED' || state === 'BOOKING_CONFIRMED'
      ? 'border-success text-success'
      : state === 'CANCELLED' || state === 'FAILED'
        ? 'border-muted text-muted'
        : 'border-info text-info';
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-caption font-semibold ${tone}`}>
      {t(`trips.states.${state}`)}
    </span>
  );
};
