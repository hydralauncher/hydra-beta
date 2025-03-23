import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import cookiesStorage from "./cookie-storage";

export interface Auth {
  accessToken: string;
  refreshToken: string;
  featurebaseJwt: string;
  expiresIn: number;

  tokenExpirationTimestamp?: number;
}

export interface AuthState {
  auth: Auth | null;
  setAuth: (auth: Auth) => void;
  clearAuth: () => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      auth: null,
      setAuth: (auth) => {
        auth.tokenExpirationTimestamp = Date.now() + auth.expiresIn * 1000;
        set({ auth });
      },
      clearAuth: () => set({ auth: null }),
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => cookiesStorage),
    }
  )
);
