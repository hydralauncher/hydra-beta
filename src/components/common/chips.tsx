import { Typography } from "./typography";
import { XIcon } from "@phosphor-icons/react";

export interface ChipsProps {
  label: string;
  color: string;
  icon?: React.ReactNode;
  onRemove?: () => void;
}

export interface ColorDotProps {
  readonly color: string;
}

export function ColorDot({ color }: ColorDotProps) {
  return (
    <div className="chips__content__color" style={{ backgroundColor: color }} />
  );
}

export function Chips({ label, color, icon, onRemove }: Readonly<ChipsProps>) {
  return (
    <div className="chips">
      <div className="chips__content">
        {icon && <div className="chips__content__icon">{icon}</div>}

        {color && <ColorDot color={color} />}

        <Typography variant="body" className="chips__content__label">
          {label}
        </Typography>
      </div>

      <button className="chips__close-button" onClick={onRemove}>
        <XIcon size={14} />
      </button>
    </div>
  );
}
