import { useSidebar } from "@/hooks/use-sidebar";
import clsx from "clsx";
import "./sidebar.scss";

export function SidebarSlider() {
  const { startResizing, isResizing, currentWidth, sidebarSizes } =
    useSidebar();

  return (
    <div // NOSONAR
      className={clsx("sidebar__slider", {
        resizing: isResizing,
      })}
      onMouseDown={startResizing}
      role="slider"
      aria-label="Resize sidebar"
      aria-valuenow={currentWidth}
      aria-valuemin={sidebarSizes.MIN}
      aria-valuemax={sidebarSizes.MAX}
      tabIndex={0}
    >
      <div className="sidebar__slider-trigger" />
    </div>
  );
}
