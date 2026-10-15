import type { CarrierRef } from '@aeronova/shared';

/**
 * Local, dependency-free carrier mark. Airline logos are trademarks and remote
 * logo hosts are unreliable, so the product uses a neutral code tile until a
 * licensed logo set is added (see docs/ARCHITECTURE.md).
 */
export const AirlineMark = ({ carrier, size = 'md' }: { carrier: CarrierRef; size?: 'sm' | 'md' }) => (
  <span
    aria-hidden
    className={`grid shrink-0 place-items-center rounded-control border border-border bg-surface-muted font-display font-semibold tabular text-fg [font-stretch:110%] ${
      size === 'sm' ? 'size-7 text-[0.6875rem]' : 'size-10 text-caption'
    }`}
  >
    {carrier.code}
  </span>
);
