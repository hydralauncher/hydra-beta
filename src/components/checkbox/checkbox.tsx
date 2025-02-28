import { Check } from "@phosphor-icons/react";
import React from "react";
import "./checkbox.scss";

export interface CheckboxProps {
  id?: string;
  label?: string;
  checked?: boolean;
  block?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

export const Checkbox = ({ label, ...props }: CheckboxProps) => {
  const generatedId = React.useId();
  const id = props.id ?? generatedId;

  const [isChecked, setIsChecked] = React.useState(props.checked);

  const handleChange = (checked: boolean) => {
    setIsChecked(checked);
    props.onChange?.(checked);
  };

  return (
    <div
      className={`checkbox 
        ${props.block ? "checkbox--block" : ""} 
        ${props.block && isChecked ? "checkbox--block--active" : ""}
        ${props.disabled ? "checkbox--disabled" : ""}`}
    >
      <button // NOSONAR
        id={id}
        disabled={props.disabled}
        className={`checkbox__input ${
          isChecked ? "checkbox__input--checked" : ""
        }`}
        onClick={() => handleChange(!isChecked)}
        role="checkbox"
        aria-checked={isChecked}
        aria-labelledby={label ? `${id}-label` : undefined}
      >
        {isChecked && <Check className="checkbox__input__icon" size={14} />}
      </button>

      {label && (
        <label className="checkbox__label" id={`${id}-label`} htmlFor={id}>
          {label}
        </label>
      )}
    </div>
  );
};
