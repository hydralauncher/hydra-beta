import { create } from "zustand";
import {
  House,
  SquaresFour,
  DownloadSimple,
  Gear,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
export interface SidebarRoute {
  label: string;
  href: string;
  icon: Icon;
}

export interface SidebarStore {
  isCollapsed: boolean;
  routes: SidebarRoute[];
  searchTerm: string;
  isNotificationsOpen: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  setSearchTerm: (searchTerm: string) => void;
  setIsNotificationsOpen: (isNotificationsOpen: boolean) => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  isCollapsed: false,
  routes: [
    {
      label: "Home",
      href: "/",
      icon: House,
    },
    {
      label: "Catalogue",
      href: "/catalogue",
      icon: SquaresFour,
    },
    {
      label: "Downloads",
      href: "/downloads",
      icon: DownloadSimple,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Gear,
    },
  ],
  searchTerm: "",
  isNotificationsOpen: false,
  setIsCollapsed: (isCollapsed) => set({ isCollapsed }),
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setIsNotificationsOpen: (isNotificationsOpen) => set({ isNotificationsOpen }),
}));
