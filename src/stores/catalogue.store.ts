import { create } from "zustand";

interface CatalogueStore {
  filtersSearchTerms: Record<string, string>;
  setFilterSearchTerm: (filterName: string, searchTerm: string) => void;
}

export const useCatalogueStore = create<CatalogueStore>((set) => ({
  filtersSearchTerms: {},
  setFilterSearchTerm: (filterName, searchTerm) =>
    set((state) => ({
      filtersSearchTerms: {
        ...state.filtersSearchTerms,
        [filterName]: searchTerm,
      },
    })),
}));
