import clsx from "clsx";

export interface DividerProps {
  orientation?: "horizontal" | "vertical";
  color?: string;
}

export function Divider({
  orientation = "horizontal",
  color,
}: Readonly<DividerProps>) {
  return (
    <div className="divider-container">
      <div
        className={clsx("divider", {
          [`divider--${orientation}`]: true,
        })}
        style={{ backgroundColor: color }}
      />
    </div>
  );
}
