import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import cookiesStorage from "./cookie-storage";

export interface SidebarStore {
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

export const SIDEBAR_SIZES = {
  MIN: 250,
  MAX: 400,
  DEFAULT: 300,
  COLLAPSED: 72,
} as const;

export const useSidebarStore = create(
  persist<SidebarStore>(
    (set) => ({
      isResizing: false,
      isCollapsed: false,
      currentWidth: SIDEBAR_SIZES.DEFAULT,
      stopResizing: () => set({ isResizing: false }),
      startResizing: () => set({ isResizing: true }),
      setIsCollapsed: (isCollapsed) => set({ isCollapsed }),
      setCurrentWidth: (currentWidth) => set({ currentWidth }),
      sidebarSizes: SIDEBAR_SIZES,
    }),
    {
      name: "sidebar",
      storage: createJSONStorage(() => cookiesStorage),
    }
  )
);
