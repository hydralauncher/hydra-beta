import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface Auth {
  accessToken: string;
  refreshToken: string;
  tokenExpirationTimestamp: number;
}

export interface AuthState {
  auth: Auth | null;
  setAuth: (auth: Auth) => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      auth: null,
      setAuth: (auth) => set({ auth }),
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
