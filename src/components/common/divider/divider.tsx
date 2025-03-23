import "./divider.scss";

export interface DividerProps {
  orientation?: "horizontal" | "vertical";
  color?: string;
}

export function Divider({
  orientation = "horizontal",
  color,
}: Readonly<DividerProps>) {
  return (
    <div
      className={`divider divider--${orientation}`}
      style={{ backgroundColor: color }}
    />
  );
}
