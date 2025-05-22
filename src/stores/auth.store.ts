import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { levelStorage } from "./level-storage";

export interface AuthState {
  tokenExpirationTimestamp: number;
  setTokenExpirationTimestamp: (tokenExpirationTimestamp: number) => void;
  clearAuth: () => void;

  /** ⚠️ Access token – only used in desktop mode. */
  accessToken?: string;

  /** ⚠️ Refresh token – only used in desktop mode. */
  refreshToken?: string;

  /** ⚠️ Set access token – only used in desktop mode. */
  setAccessToken: (accessToken: string) => void;

  /** ⚠️ Set refresh token – only used in desktop mode. */
  setRefreshToken: (refreshToken: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      tokenExpirationTimestamp: 0,
      setTokenExpirationTimestamp: (tokenExpirationTimestamp) =>
        set({ tokenExpirationTimestamp }),
      setAccessToken: (accessToken) => set({ accessToken }),
      setRefreshToken: (refreshToken) => set({ refreshToken }),
      clearAuth: () =>
        set({
          tokenExpirationTimestamp: 0,
          accessToken: undefined,
          refreshToken: undefined,
        }),
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => levelStorage),
    }
  )
);
