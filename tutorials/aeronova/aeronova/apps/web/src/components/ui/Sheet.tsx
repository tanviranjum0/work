import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface SheetProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly title: string;
  readonly closeLabel: string;
  readonly children: ReactNode;
  readonly footer?: ReactNode;
  /** `wide` is for tabular content such as comparisons. */
  readonly size?: 'default' | 'wide';
}

/**
 * Bottom sheet on a native <dialog>: the browser provides the focus trap,
 * Escape handling, inert background and top-layer stacking.
 */
export const Sheet = ({
  open,
  onClose,
  title,
  closeLabel,
  children,
  footer,
  size = 'default',
}: SheetProps) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal?.();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className={`sheet mt-auto mb-0 max-h-[88dvh] w-full max-w-none overflow-hidden rounded-t-sheet bg-surface p-0 text-fg shadow-float backdrop:bg-black/45 sm:mx-auto ${size === 'wide' ? 'lg:max-w-5xl' : 'sm:max-w-lg'}`}
    >
      <div className="flex max-h-[88dvh] flex-col">
        <header className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="font-sans text-title font-semibold [font-stretch:100%]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="grid size-9 place-items-center rounded-full hover:bg-surface-muted"
          >
            <X aria-hidden className="size-5" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <footer className="border-t border-border px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            {footer}
          </footer>
        )}
      </div>
    </dialog>
  );
};
