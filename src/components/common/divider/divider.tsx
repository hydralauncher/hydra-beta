import clsx from "clsx";

export interface DividerProps {
  orientation?: "horizontal" | "vertical";
  color?: string;
  gap?: 0 | 4 | 8 | 16 | 24 | 32;
  isCollapsed?: boolean;
}

export function Divider({
  orientation = "horizontal",
  color,
  isCollapsed = false,
  gap = 0,
}: Readonly<DividerProps>) {
  return (
    <div
      data-gap={gap}
      className={clsx("divider-container", {
        "divider-container--collapsed": isCollapsed,
      })}
    >
      <div
        className={clsx("divider", {
          [`divider--${orientation}`]: true,
        })}
        style={{ backgroundColor: color }}
      />
    </div>
  );
}
