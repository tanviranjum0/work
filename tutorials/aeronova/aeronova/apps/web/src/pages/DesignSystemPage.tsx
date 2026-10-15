import { Button } from '../components/ui/Button';

/**
 * Development-only reference for the token system (registered only when
 * import.meta.env.DEV). Useful for checking both themes side by side.
 */
const swatches = [
  'bg',
  'surface',
  'surface-muted',
  'fg',
  'muted',
  'border',
  'control-border',
  'primary',
  'course',
  'warning',
  'success',
  'danger',
  'info',
] as const;

const typeScale = [
  ['text-display font-display font-semibold', 'Display: Dhaka to London'],
  ['text-headline font-display font-semibold', 'Headline: 247 itineraries'],
  ['text-title font-semibold', 'Title: Outbound, Fri 20 Dec'],
  ['text-body', 'Body: Refund rules depend on the fare you choose.'],
  ['text-body-sm text-muted', 'Body small: Price checked just now'],
  ['text-caption text-muted', 'Caption: Operated by a partner airline'],
  ['text-title tabular font-display font-semibold', 'Numeric: 06:20 → 15:40  8h 55m  $742.10'],
  ['font-mono text-body-sm', 'Mono: DEMO-7QK2XP'],
] as const;

export const DesignSystemPage = () => (
  <div className="content-width space-y-12 py-12">
    <h1 className="text-headline font-semibold">Design tokens</h1>

    <section className="space-y-4" aria-labelledby="ds-colour">
      <h2 id="ds-colour" className="text-title font-semibold">
        Colour
      </h2>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {swatches.map((name) => (
          <li key={name} className="overflow-hidden rounded-panel border border-border bg-surface">
            <div className="h-14" style={{ background: `var(--${name})` }} />
            <p className="px-3 py-2 text-caption">{name}</p>
          </li>
        ))}
      </ul>
    </section>

    <section className="space-y-4" aria-labelledby="ds-type">
      <h2 id="ds-type" className="text-title font-semibold">
        Type
      </h2>
      <div className="space-y-3">
        {typeScale.map(([cls, text]) => (
          <p key={text} className={cls}>
            {text}
          </p>
        ))}
      </div>
    </section>

    <section className="space-y-4" aria-labelledby="ds-actions">
      <h2 id="ds-actions" className="text-title font-semibold">
        Actions
      </h2>
      <div className="flex flex-wrap items-center gap-3">
        <Button>Search flights</Button>
        <Button variant="secondary">Compare</Button>
        <Button variant="ghost">Clear filters</Button>
        <Button busy>Checking price</Button>
        <Button size="lg">Continue to travellers</Button>
      </div>
    </section>

    <section className="space-y-4" aria-labelledby="ds-surfaces">
      <h2 id="ds-surfaces" className="text-title font-semibold">
        Surfaces and radius
      </h2>
      <div className="flex flex-wrap gap-4">
        <div className="rounded-control border border-control-border bg-surface px-4 py-3 text-body-sm">
          Control 6px
        </div>
        <div className="rounded-panel border border-border bg-surface px-5 py-4 text-body-sm">Panel 10px</div>
        <div className="rounded-sheet bg-surface px-6 py-5 text-body-sm shadow-float">
          Sheet 16px, floating
        </div>
      </div>
    </section>
  </div>
);
