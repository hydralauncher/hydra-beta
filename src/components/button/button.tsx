import { Spinner } from "@phosphor-icons/react";
import Link from "next/link";
import "./button.scss";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  children: React.ReactNode;
  icon?: React.ReactNode;
  href?: string;
  iconPosition?: "left" | "right";
  target?: "_blank" | "_self" | "_parent" | "_top";
}

const variants = {
  primary: "button--primary",
  secondary: "button--secondary",
  danger: "button--danger",
  link: "button--link",
};

const sizes = {
  icon: "button--icon",
  small: "button--small",
  medium: "button--medium",
  large: "button--large",
};

export function Button({
  loading = false,
  disabled = false,
  size = "medium",
  variant = "primary",
  iconPosition = "left",
  href,
  icon,
  onClick,
  children,
  target,
  "aria-label": ariaLabel,
}: Readonly<ButtonProps>) {
  return (
    <>
      {!href ? (
        <button
          type="button"
          onClick={onClick}
          disabled={disabled || loading}
          aria-busy={loading}
          aria-label={size === "icon" ? ariaLabel : undefined}
          className={`button ${variants[variant]} ${sizes[size]} ${
            disabled || loading ? "button--disabled" : ""
          }`}
        >
          {loading && (
            <div
              className={`button__icon-container--${iconPosition} button__icon-container`}
            >
              <Spinner size={20} className="button__loading-icon" />
            </div>
          )}

          {icon && !loading && (
            <div
              className={`button__icon-container--${iconPosition} button__icon-container`}
            >
              {icon}
            </div>
          )}

          {children && (!loading || typeof children === "string") && (
            <p className="button__text">{children}</p>
          )}
        </button>
      ) : (
        <Link
          href={href ?? ""}
          target={target}
          aria-label={size === "icon" ? ariaLabel : undefined}
          className={`button ${variants[variant]} ${sizes[size]} ${
            disabled ? "button--disabled" : ""
          }`}
        >
          {icon && (
            <div
              className={`button__icon-container--${iconPosition} button__icon-container`}
            >
              {icon}
            </div>
          )}

          {children && <p className="button__text">{children}</p>}
        </Link>
      )}
    </>
  );
}
