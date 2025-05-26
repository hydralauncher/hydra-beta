import { create } from "zustand";

interface CatalogueStore {
  filtersSearchTerms: Record<string, string>;
  openedFilters: Record<string, boolean>;
  setFilterSearchTerm: (filterName: string, searchTerm: string) => void;
  setOpenedFilter: (filterName: string, isOpen: boolean) => void;
}

export const useCatalogueStore = create<CatalogueStore>((set) => ({
  filtersSearchTerms: {},
  openedFilters: {},
  setFilterSearchTerm: (filterName, searchTerm) =>
    set((state) => ({
      filtersSearchTerms: {
        ...state.filtersSearchTerms,
        [filterName]: searchTerm,
      },
    })),
  setOpenedFilter: (filterName, isOpen) =>
    set((state) => ({
      openedFilters: {
        ...state.openedFilters,
        [filterName]: isOpen,
      },
    })),
}));
