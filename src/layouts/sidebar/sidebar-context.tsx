import { createContext, useEffect, useMemo, useState } from "react";

interface SidebarContext {
  isResizing: boolean;
  isCollapsed: boolean;
  currentWidth: number;
  stopResizing: () => void;
  startResizing: () => void;
  setIsCollapsed: (isCollapsed: boolean) => void;
  setCurrentWidth: (currentWidth: number) => void;
  sidebarSizes: {
    MIN: number;
    MAX: number;
    DEFAULT: number;
    COLLAPSED: number;
  };
}

const SIDEBAR_SIZES = {
  MIN: 250,
  MAX: 400,
  DEFAULT: 300,
  COLLAPSED: 72,
} as const;

export const SidebarContext = createContext<SidebarContext>({
  isResizing: false,
  isCollapsed: false,
  stopResizing: () => {},
  startResizing: () => {},
  setIsCollapsed: () => {},
  setCurrentWidth: () => {},
  sidebarSizes: SIDEBAR_SIZES,
  currentWidth: SIDEBAR_SIZES.DEFAULT,
});

export function SidebarProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [currentWidth, setCurrentWidth] = useState<number>(
    SIDEBAR_SIZES.DEFAULT
  );

  const startResizing = () => {
    setIsResizing(true);
    document.body.classList.add("sidebar-resizing");
  };

  const stopResizing = () => {
    setIsResizing(false);
    document.body.classList.remove("sidebar-resizing");
  };

  const handleResize = (e: MouseEvent) => {
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
  };

  useEffect(() => {
    if (!isResizing) return;

    document.addEventListener("mousemove", handleResize);
    document.addEventListener("mouseup", stopResizing);

    return () => {
      document.removeEventListener("mousemove", handleResize);
      document.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing]);

  const contextValue = useMemo(
    () => ({
      isResizing,
      isCollapsed,
      currentWidth,
      stopResizing,
      startResizing,
      setIsCollapsed,
      setCurrentWidth,
      sidebarSizes: SIDEBAR_SIZES,
    }),
    [isCollapsed, currentWidth, isResizing]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      {children}
    </SidebarContext.Provider>
  );
}
