import clsx from "clsx";
import { Tooltip } from "../tooltip/tooltip";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  inputSize?: "default" | "icon";
  onClick?: () => void;
  ref?: React.Ref<HTMLInputElement>;
  collapsed?: boolean;
}

export function Input({
  type = "text",
  placeholder = "Placeholder",
  label,
  hint,
  error = false,
  disabled = false,
  iconLeft,
  iconRight,
  inputSize = "default",
  onClick,
  ref,
  collapsed,
  ...props
}: Readonly<InputProps>) {
  return (
    <div className="input-container">
      {label && (
        <label htmlFor="input" className="input-label">
          {label}
        </label>
      )}
      <Tooltip
        content={placeholder}
        showArrow={false}
        position="right"
        active={collapsed}
      >
        <button
          type="button"
          onClick={onClick}
          className={clsx("input-wrapper", {
            "input-wrapper--icon": inputSize === "icon",
          })}
        >
          <input
            id="input"
            ref={ref}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            data-icon-left={iconLeft ? "true" : undefined}
            data-icon-right={iconRight ? "true" : undefined}
            data-icon={inputSize === "icon" ? "true" : undefined}
            className={`input ${error ? "input--error" : ""} ${
              disabled ? "input--disabled" : ""
            }`}
            {...props}
          />
          {iconLeft && (
            <div className="input-icon input-icon--left">{iconLeft}</div>
          )}
          {iconRight && (
            <div className="input-icon input-icon--right">{iconRight}</div>
          )}
        </button>
        {hint && (
          <p className={clsx("input-hint", { "input-hint--error": error })}>
            {hint}
          </p>
        )}
      </Tooltip>
    </div>
  );
}
