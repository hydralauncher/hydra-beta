import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SidebarStore {
  isCollapsed: boolean;
  searchTerm: string;
  isNotificationsOpen: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  setSearchTerm: (searchTerm: string) => void;
  setIsNotificationsOpen: (isNotificationsOpen: boolean) => void;
}

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      isCollapsed: true,
      searchTerm: "",
      isNotificationsOpen: false,
      setIsCollapsed: (isCollapsed) => set({ isCollapsed }),
      setSearchTerm: (searchTerm) => set({ searchTerm }),
      setIsNotificationsOpen: (isNotificationsOpen) =>
        set({ isNotificationsOpen }),
    }),
    {
      name: "sidebar-storage",
      partialize: (state) => ({ isCollapsed: state.isCollapsed }),
    }
  )
);
