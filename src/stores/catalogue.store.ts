import { create } from "zustand";

export interface CatalogueState {
  title: string;
  take: number;
  skip: number;
  genres: string[];
  tags: number[];
  publishers: string[];
  developers: string[];
  downloadSourceFingerprints: string[];
}

export interface CatalogueActions {
  setTitle: (title: string) => void;
  setFilters: (filters: Partial<CatalogueState>) => void;
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
};

export const useCatalogueStore = create<CatalogueState & CatalogueActions>(
  (set) => ({
    ...initialState,

    setTitle: (title) => set({ title }),
    setFilters: (filters) => set(filters),
    reset: () => set(initialState),
  })
);
