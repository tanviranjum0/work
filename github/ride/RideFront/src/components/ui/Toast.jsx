import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const ICONS = { success: CheckCircle2, error: AlertCircle, info: Info };

/**
 * App-wide, non-blocking notifications. Errors stay a little longer than successes and are
 * announced to screen readers (role="alert" vs "status").
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id) => setToasts((all) => all.filter((toast) => toast.id !== id)), []);

  const push = useCallback(
    (tone, message, options = {}) => {
      const id = ++nextId.current;
      const duration = options.duration ?? (tone === "error" ? 6500 : 4000);
      setToasts((all) => [...all.slice(-2), { id, tone, message, title: options.title }]);
      if (duration > 0) setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss],
  );

  const api = useMemo(
    () => ({
      success: (message, options) => push("success", message, options),
      error: (message, options) => push("error", message, options),
      info: (message, options) => push("info", message, options),
      dismiss,
    }),
    [push, dismiss],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="qr-toasts" aria-live="polite">
        {toasts.map((toast) => {
          const Icon = ICONS[toast.tone];
          return (
            <div
              key={toast.id}
              className={`qr-toast qr-toast--${toast.tone}`}
              role={toast.tone === "error" ? "alert" : "status"}
            >
              <Icon size={18} aria-hidden="true" />
              <div className="qr-toast-body">
                {toast.title && <strong>{toast.title}</strong>}
                {toast.message}
              </div>
              <button
                type="button"
                className="qr-input-action"
                style={{ position: "static", width: 28, height: 28 }}
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss notification"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const value = useContext(ToastContext);
  if (!value) throw new Error("useToast must be used inside <ToastProvider>");
  return value;
}
