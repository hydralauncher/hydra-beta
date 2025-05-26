import { CheckIcon } from "@phosphor-icons/react";
import { useId, useState } from "react";
import clsx from "clsx";

export interface CheckboxProps {
  id?: string;
  label?: string;
  checked?: boolean;
  block?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

export const Checkbox = ({ label, ...props }: CheckboxProps) => {
  const generatedId = useId();
  const id = props.id ?? generatedId;

  const isChecked = props.checked ?? false;

  const handleChange = (checked: boolean) => {
    props.onChange?.(checked);
  };

  const handleBlockClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!props.block) return;

    e.preventDefault();
    handleChange(!isChecked);
  };

  return (
    <button
      onClick={handleBlockClick}
      className={clsx("checkbox", {
        "checkbox--block": props.block,
        "checkbox--block--active": props.block && isChecked,
        "checkbox--disabled": props.disabled,
      })}
    >
      <button
        id={id}
        disabled={props.disabled}
        className={clsx("checkbox__input", {
          "checkbox__input--checked": isChecked,
        })}
        onClick={() => handleChange(!isChecked)}
        role="checkbox"
        aria-checked={isChecked}
        aria-labelledby={label ? `${id}-label` : undefined}
      >
        {isChecked && <CheckIcon className="checkbox__input__icon" size={14} />}
      </button>

      {label && (
        <label className="checkbox__label" id={`${id}-label`} htmlFor={id}>
          {label}
        </label>
      )}
    </button>
  );
};
