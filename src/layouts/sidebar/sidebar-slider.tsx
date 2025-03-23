import clsx from "clsx";
import { useContext } from "react";
import { SidebarContext } from "./sidebar-context";
import "./sidebar.scss";

export function SidebarSlider() {
  const { startResizing, isResizing, currentWidth, sidebarSizes } =
    useContext(SidebarContext);

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
