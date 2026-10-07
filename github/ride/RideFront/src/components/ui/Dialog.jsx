import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import Button from "./Button";

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Accessible modal: focus is trapped inside, Escape closes it, focus returns to the
 * trigger, and the page behind does not scroll. `placement="bottom"` gives a sheet on phones.
 */
export function Dialog({ open, onClose, title, children, placement = "center", dismissible = true }) {
  const titleId = useId();
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = panelRef.current;
    (panel?.querySelector("[data-autofocus]") || panel?.querySelector(FOCUSABLE) || panel)?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape" && dismissible) {
        event.stopPropagation();
        onClose?.();
      } else if (event.key === "Tab" && panel) {
        const items = [...panel.querySelectorAll(FOCUSABLE)];
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previous?.focus?.();
    };
  }, [open, onClose, dismissible]);

  if (!open) return null;
  return createPortal(
    <div
      className={`qr-overlay ${placement === "bottom" ? "qr-overlay--bottom" : ""}`}
      onMouseDown={(event) => event.target === event.currentTarget && dismissible && onClose?.()}
    >
      <div
        ref={panelRef}
        className="qr-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
      >
        {title && <h2 id={titleId}>{title}</h2>}
        {children}
      </div>
    </div>,
    document.body,
  );
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  children,
  confirmLabel = "Confirm",
  cancelLabel = "Keep going",
  tone = "primary",
  loading = false,
  placement = "center",
}) {
  return (
    <Dialog open={open} onClose={onClose} title={title} placement={placement} dismissible={!loading}>
      {children && <div className="qr-dialog-text">{children}</div>}
      <div className="qr-dialog-actions">
        <Button
          variant={tone === "danger" ? "danger-solid" : "primary"}
          onClick={onConfirm}
          loading={loading}
          data-autofocus
        >
          {confirmLabel}
        </Button>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
      </div>
    </Dialog>
  );
}
