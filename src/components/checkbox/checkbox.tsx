import { Check } from "@phosphor-icons/react";
import React from "react";
import "./checkbox.scss";

export interface CheckboxProps {
  id?: string;
  label?: string;
  checked?: boolean;
  block?: boolean;
  onChange?: (checked: boolean) => void;
}

export const Checkbox = ({ label, ...props }: CheckboxProps) => {
  const generatedId = React.useId();
  const id = props.id ?? generatedId;

  const [isChecked, setIsChecked] = React.useState(props.checked);

  return (
    <div
      className={`checkbox 
        ${props.block ? "checkbox--block" : ""} 
        ${props.block && isChecked ? "checkbox--block--active" : ""}`}
    >
      <button // NOSONAR
        id={id}
        className={`checkbox__input ${
          isChecked ? "checkbox__input--checked" : ""
        }`}
        onClick={() => setIsChecked(!isChecked)}
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
