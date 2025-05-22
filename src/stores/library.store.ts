import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { levelStorage } from "./level-storage";

export interface Game {
  id: string;
  title: string;
}

export interface LibraryState {
  library: Game[];
  setLibrary: (library: Game[]) => void;
  clearLibrary: () => void;
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set) => ({
      library: [],
      setLibrary: (library) => set({ library }),
      clearLibrary: () => set({ library: [] }),
    }),
    {
      name: "library",
      storage: createJSONStorage(() => levelStorage),
    }
  )
);
