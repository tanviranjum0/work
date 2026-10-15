/** The mark is a course line ending at a waypoint: the product's one signature motif. */
export const BrandMark = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
    <path
      d="M6 23 C 11 12, 21 9, 26 9"
      fill="none"
      stroke="var(--course)"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    <path d="M26 5.5 29.5 9 26 12.5 22.5 9Z" fill="currentColor" />
    <circle cx="6" cy="23" r="2.6" fill="currentColor" />
  </svg>
);
