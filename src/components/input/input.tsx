import "./input.scss";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
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
  ...props
}: Readonly<InputProps>) {
  return (
    <div className="input-container">
      {label && (
        <label htmlFor="input" className="input-label">
          {label}
        </label>
      )}
      <div className="input-wrapper">
        <input
          id="input"
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          data-icon-left={iconLeft ? "true" : undefined}
          data-icon-right={iconRight ? "true" : undefined}
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
      </div>
      {hint && (
        <p className={`input-hint ${error ? "input-hint--error" : ""}`}>
          {hint}
        </p>
      )}
    </div>
  );
}
