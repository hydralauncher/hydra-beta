import { useCallback, useEffect } from "react";
import { SIDEBAR_SIZES, useSidebarStore } from "../stores/sidebar.store";

export function useSidebar() {
  const {
    isResizing,
    isCollapsed,
    currentWidth,
    stopResizing: stopResizingStore,
    startResizing: startResizingStore,
    setIsCollapsed,
    setCurrentWidth,
    sidebarSizes,
  } = useSidebarStore();

  const handleResize = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;

      if (e.clientX < SIDEBAR_SIZES.MIN / 2) {
        setIsCollapsed(true);
      } else if (e.clientX > SIDEBAR_SIZES.MIN) {
        setIsCollapsed(false);
      }

      const newWidth = Math.min(
        Math.max(e.clientX, SIDEBAR_SIZES.MIN),
        SIDEBAR_SIZES.MAX
      );
      setCurrentWidth(newWidth);
    },
    [isResizing, setIsCollapsed, setCurrentWidth]
  );

  const startResizing = useCallback(() => {
    startResizingStore();
    document.body.classList.add("sidebar-resizing");
  }, [startResizingStore]);

  const stopResizing = useCallback(() => {
    stopResizingStore();
    document.body.classList.remove("sidebar-resizing");
  }, [stopResizingStore]);

  useEffect(() => {
    if (!isResizing) return;

    document.addEventListener("mousemove", handleResize);
    document.addEventListener("mouseup", stopResizing);

    return () => {
      document.removeEventListener("mousemove", handleResize);
      document.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing, handleResize, stopResizing]);

  return {
    isResizing,
    isCollapsed,
    currentWidth,
    startResizing,
    stopResizing,
    setIsCollapsed,
    setCurrentWidth,
    sidebarSizes,
  };
}
