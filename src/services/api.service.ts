import ky from "ky";
import { fetch } from "@tauri-apps/plugin-http";

import { IS_BROWSER, IS_DESKTOP } from "@/constants";
import { useAuthStore, type Auth } from "@/stores/auth.store";

export const ACCESS_TOKEN_EXPIRATION_OFFSET_IN_MS = 1000 * 60 * 5;

export const calculateTokenExpirationTimestamp = (expiresIn: number) => {
  return Date.now() + expiresIn * 1000;
};

const API_URL = "https://api-staging.hydralauncher.gg";

export const refreshToken = async (auth: Auth) => {
  const response = await ky.post(`${API_URL}/auth/refresh`, {
    json: {
      refreshToken: auth.refreshToken,
    },
    fetch: IS_DESKTOP ? fetch : undefined,
  });

  const data = await response.json<Pick<Auth, "accessToken" | "expiresIn">>();

  if (IS_BROWSER) {
    const { setAuth } = useAuthStore.getState();

    setAuth({
      ...auth,
      accessToken: data.accessToken,
      expiresIn: data.expiresIn,
    });
  }

  return data;
};

const setAccessToken = async (request: Request) => {
  if (IS_BROWSER) {
    const auth = useAuthStore.getState().auth;
    if (auth) {
      request.headers.set("Authorization", `Bearer ${auth.accessToken}`);

      if (
        auth.tokenExpirationTimestamp &&
        auth?.tokenExpirationTimestamp <
          Date.now() - ACCESS_TOKEN_EXPIRATION_OFFSET_IN_MS
      ) {
        const data = await refreshToken(auth);
        request.headers.set("Authorization", `Bearer ${data.accessToken}`);
      } else {
        request.headers.set("Authorization", `Bearer ${auth.accessToken}`);
      }
    }
  }
};

export const api = ky.create({
  prefixUrl: API_URL,
  fetch: IS_DESKTOP ? fetch : undefined,
  hooks: {
    beforeRequest: [setAccessToken],
  },
});
