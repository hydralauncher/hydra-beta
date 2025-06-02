import { create } from "zustand";
import type { FilterKey } from "@/types";

export interface CatalogueState {
  title: string;
  take: number;
  skip: number;
  genres: string[];
  tags: number[];
  publishers: string[];
  developers: string[];
  downloadSourceFingerprints: string[];
  filtersSearchTerms: Record<FilterKey, string>;
  openedFilters: Record<FilterKey, boolean>;
}

export interface CatalogueActions {
  setTitle: (title: string) => void;
  setFilters: (filters: Partial<CatalogueState>) => void;
  setFilterSearchTerm: (filterKey: FilterKey, searchTerm: string) => void;
  setOpenedFilter: (filterKey: FilterKey, isOpen: boolean) => void;
  reset: () => void;
}

const initialState: CatalogueState = {
  title: "",
  take: 20,
  skip: 0,
  genres: [],
  tags: [],
  publishers: [],
  developers: [],
  downloadSourceFingerprints: [],
  filtersSearchTerms: {
    genres: "",
    userTags: "",
    developers: "",
    publishers: "",
    downloadSourceFingerprints: "",
  },
  openedFilters: {
    genres: true,
    userTags: true,
    developers: true,
    publishers: true,
    downloadSourceFingerprints: true,
  },
};

export const useCatalogueStore = create<CatalogueState & CatalogueActions>(
  (set) => ({
    ...initialState,

    setTitle: (title) => set({ title }),
    setFilters: (filters) => set(filters),
    setFilterSearchTerm: (filterKey, searchTerm) =>
      set((state) => ({
        filtersSearchTerms: {
          ...state.filtersSearchTerms,
          [filterKey]: searchTerm,
        },
      })),
    setOpenedFilter: (filterKey, isOpen) =>
      set((state) => ({
        openedFilters: {
          ...state.openedFilters,
          [filterKey]: isOpen,
        },
      })),
    reset: () => set(initialState),
  })
);
