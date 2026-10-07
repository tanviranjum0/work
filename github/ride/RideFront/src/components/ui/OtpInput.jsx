import { useRef } from "react";

/**
 * Six boxes for a one-time code. Supports typing, backspace, arrow keys, paste, and the
 * browser / password-manager "one-time-code" autofill (iOS and Android).
 */
export default function OtpInput({
  value = "",
  onChange,
  onComplete,
  length = 6,
  invalid = false,
  autoFocus = true,
  label = "Verification code",
}) {
  const refs = useRef([]);
  const digits = Array.from({ length }, (_, index) => value[index] || "");

  const commit = (next) => {
    const clean = next.replace(/\D/g, "").slice(0, length);
    onChange?.(clean);
    if (clean.length === length) onComplete?.(clean);
  };

  const focusAt = (index) => refs.current[Math.max(0, Math.min(length - 1, index))]?.focus();

  const handleChange = (index, event) => {
    const typed = event.target.value.replace(/\D/g, "");
    if (!typed) return;
    // Autofill and paste deliver several digits into one box.
    const next = (value.slice(0, index) + typed + value.slice(index + typed.length)).slice(0, length);
    commit(next);
    focusAt(Math.min(index + typed.length, length - 1));
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      if (digits[index]) commit(value.slice(0, index) + value.slice(index + 1));
      else if (index > 0) {
        commit(value.slice(0, index - 1) + value.slice(index));
        focusAt(index - 1);
      }
    } else if (event.key === "ArrowLeft") focusAt(index - 1);
    else if (event.key === "ArrowRight") focusAt(index + 1);
  };

  return (
    <div className="qr-otp" role="group" aria-label={label} data-invalid={invalid || undefined}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(node) => (refs.current[index] = node)}
          value={digit}
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          pattern="[0-9]*"
          maxLength={length}
          autoFocus={autoFocus && index === 0}
          aria-label={`Digit ${index + 1} of ${length}`}
          onChange={(event) => handleChange(index, event)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onFocus={(event) => event.target.select()}
          onPaste={(event) => {
            event.preventDefault();
            commit(event.clipboardData.getData("text"));
          }}
        />
      ))}
    </div>
  );
}
