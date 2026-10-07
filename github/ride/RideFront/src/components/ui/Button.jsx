import { forwardRef } from "react";
import { Link } from "react-router-dom";

const VARIANTS = {
  primary: "",
  secondary: "qr-btn--secondary",
  ghost: "qr-btn--ghost",
  dark: "qr-btn--dark",
  danger: "qr-btn--danger",
  "danger-solid": "qr-btn--danger-solid",
};

/**
 * The one button. Renders a router <Link> when `to` is given, otherwise a <button>.
 * `loading` disables the control and shows a spinner while keeping its width stable.
 */
const Button = forwardRef(function Button(
  {
    children,
    variant = "primary",
    size,
    to,
    href,
    icon,
    iconRight,
    loading = false,
    loadingText,
    auto = false,
    iconOnly = false,
    className = "",
    type = "button",
    disabled,
    ...props
  },
  ref,
) {
  const classes = [
    "qr-btn",
    VARIANTS[variant],
    size === "sm" && "qr-btn--sm",
    auto && "qr-btn--auto",
    iconOnly && "qr-btn--icon",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {loading ? <span className="qr-spinner" aria-hidden="true" /> : icon}
      {!iconOnly && <span>{loading && loadingText ? loadingText : children}</span>}
      {iconOnly && !loading && children}
      {!loading && iconRight}
    </>
  );

  if (to) {
    return (
      <Link ref={ref} to={to} className={classes} aria-disabled={disabled || undefined} {...props}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a ref={ref} href={href} className={classes} {...props}>
        {content}
      </a>
    );
  }
  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {content}
    </button>
  );
});

export default Button;
