/**
 * Decorative hero backdrop: the Earth's limb, rendered in the surface colour so
 * the search band below appears to sit on the horizon, and a great-circle
 * course drawn in magenta with waypoints placed on the route itself.
 * Pure SVG, no map API, no data claims. Draws once; static under reduced motion.
 */
type Point = readonly [number, number];

const P0: Point = [880, 392];
const P1: Point = [990, 210];
const P2: Point = [1180, 150];
const P3: Point = [1330, 196];

const bezier = (t: number): Point => {
  const u = 1 - t;
  const x = u ** 3 * P0[0] + 3 * u ** 2 * t * P1[0] + 3 * u * t ** 2 * P2[0] + t ** 3 * P3[0];
  const y = u ** 3 * P0[1] + 3 * u ** 2 * t * P1[1] + 3 * u * t ** 2 * P2[1] + t ** 3 * P3[1];
  return [Math.round(x), Math.round(y)];
};

const WAYPOINTS = [0.3, 0.55, 0.8].map(bezier);
const COURSE = `M${P0.join(' ')} C ${P1.join(' ')}, ${P2.join(' ')}, ${P3.join(' ')}`;
const LIMB = 'M-120 480 Q 720 290 1560 480';
const MERIDIANS = [-560, -300, -80, 120, 320, 540].map(
  (dx) => `M${720 + dx} 500 Q ${720 + dx * 0.72} 420 ${720 + dx * 0.55} 380`,
);

export const CourseLine = ({ className = '' }: { className?: string }) => (
  <svg
    viewBox="0 0 1440 480"
    preserveAspectRatio="xMaxYMax slice"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <defs>
      <linearGradient id="atmosphere" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="var(--horizon-glow)" stopOpacity="0" />
        <stop offset="100%" stopColor="var(--horizon-glow)" stopOpacity="0.85" />
      </linearGradient>
      <linearGradient id="meridian-fade" gradientUnits="userSpaceOnUse" x1="0" y1="390" x2="0" y2="478">
        <stop offset="0%" stopColor="var(--border)" stopOpacity="1" />
        <stop offset="100%" stopColor="var(--border)" stopOpacity="0" />
      </linearGradient>
      <clipPath id="earth">
        <path d={`${LIMB} L1560 500 L-120 500 Z`} />
      </clipPath>
    </defs>

    <rect x="0" y="300" width="1440" height="180" fill="url(#atmosphere)" />
    <path d={`${LIMB} L1560 500 L-120 500 Z`} fill="var(--surface)" />
    <g clipPath="url(#earth)" fill="none" stroke="url(#meridian-fade)" strokeWidth="1">
      {MERIDIANS.map((d) => (
        <path key={d} d={d} />
      ))}
    </g>
    <path d={LIMB} fill="none" stroke="var(--control-border)" strokeWidth="1.25" />

    <path
      className="course-draw"
      d={COURSE}
      fill="none"
      stroke="var(--course)"
      strokeWidth="2.25"
      strokeLinecap="round"
      pathLength={1}
    />
    {WAYPOINTS.map(([cx, cy], i) => (
      <path
        key={cx}
        className="course-waypoint"
        // Timed to appear as the drawing line reaches each waypoint.
        style={{ animationDelay: `${0.8 + i * 0.35}s` }}
        d={`M${cx} ${cy - 4} L${cx + 4} ${cy} L${cx} ${cy + 4} L${cx - 4} ${cy} Z`}
        fill="var(--bg)"
        stroke="var(--course)"
        strokeWidth="1.5"
      />
    ))}
    <circle cx={P0[0]} cy={P0[1]} r="5.5" fill="var(--fg)" />
    <path
      d={`M${P3[0]} ${P3[1] - 9} L${P3[0] + 9} ${P3[1]} L${P3[0]} ${P3[1] + 9} L${P3[0] - 9} ${P3[1]} Z`}
      fill="var(--fg)"
    />
  </svg>
);
