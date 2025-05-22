import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { levelStorage } from "./level-storage";

export interface User {
  id: string;
  displayName: string;
}

export interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user",
      storage: createJSONStorage(() => levelStorage),
    }
  )
);
