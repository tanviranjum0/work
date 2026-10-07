import { forwardRef, useId, useState } from "react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

const errorText = (error) => (typeof error === "string" ? error : error?.message);

/**
 * Labelled input. Works with react-hook-form (`{...register("name")}`) because it forwards
 * its ref; error and hint text are wired to the control with aria-describedby.
 */
export const Input = forwardRef(function Input(
  { label, error, hint, icon, type = "text", className = "", id, action, ...props },
  ref,
) {
  const generated = useId();
  const inputId = id || generated;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;
  const [reveal, setReveal] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="qr-field">
      {label && (
        <label className="qr-label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className="qr-input-wrap">
        {icon && <span className="qr-input-icon">{icon}</span>}
        <input
          ref={ref}
          id={inputId}
          type={isPassword && reveal ? "text" : type}
          className={`qr-input ${icon ? "qr-input--with-icon" : ""} ${isPassword || action ? "qr-input--with-action" : ""} ${className}`}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={describedBy}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="qr-input-action"
            onClick={() => setReveal((value) => !value)}
            aria-label={reveal ? "Hide password" : "Show password"}
          >
            {reveal ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
        {!isPassword && action}
      </div>
      {error ? (
        <p className="qr-error" id={`${inputId}-error`} role="alert">
          <AlertCircle size={15} style={{ marginTop: 2, flex: "none" }} />
          {errorText(error)}
        </p>
      ) : (
        hint && (
          <p className="qr-hint" id={`${inputId}-hint`}>
            {hint}
          </p>
        )
      )}
    </div>
  );
});

export const Select = forwardRef(function Select({ label, error, options = [], id, ...props }, ref) {
  const generated = useId();
  const selectId = id || generated;
  return (
    <div className="qr-field">
      {label && (
        <label className="qr-label" htmlFor={selectId}>
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className="qr-select"
        aria-invalid={error ? "true" : undefined}
        {...props}
      >
        {options.map((option) => {
          const item = typeof option === "string" ? { value: option, label: option } : option;
          return (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          );
        })}
      </select>
      {error && (
        <p className="qr-error" role="alert">
          {errorText(error)}
        </p>
      )}
    </div>
  );
});

export const Textarea = forwardRef(function Textarea({ label, error, id, ...props }, ref) {
  const generated = useId();
  const areaId = id || generated;
  return (
    <div className="qr-field">
      {label && (
        <label className="qr-label" htmlFor={areaId}>
          {label}
        </label>
      )}
      <textarea ref={ref} id={areaId} className="qr-textarea" aria-invalid={error ? "true" : undefined} {...props} />
      {error && (
        <p className="qr-error" role="alert">
          {errorText(error)}
        </p>
      )}
    </div>
  );
});
