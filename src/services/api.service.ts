import { IS_BROWSER, IS_DESKTOP } from "@/constants";
import { useAuthStore } from "@/stores";
import ky, { BeforeRequestHook } from "ky";

export const ACCESS_TOKEN_EXPIRATION_OFFSET_IN_MS = 1000 * 60 * 5;

export const calculateTokenExpirationTimestamp = (expiresIn: number) => {
  return Date.now() + expiresIn * 1000;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const refreshToken: BeforeRequestHook = async (request) => {
  if (IS_BROWSER) {
    const { tokenExpirationTimestamp, setTokenExpirationTimestamp, ...auth } =
      useAuthStore.getState();

    if (tokenExpirationTimestamp) {
      const isTokenExpired =
        Number(tokenExpirationTimestamp) <
        Date.now() - ACCESS_TOKEN_EXPIRATION_OFFSET_IN_MS;

      if (isTokenExpired) {
        const { expiresIn, accessToken, refreshToken } = await ky
          .post(`${API_URL}/auth/refresh`, {
            credentials: "include",
            json: IS_DESKTOP ? { refreshToken: auth.refreshToken } : undefined,
          })
          .json<{
            expiresIn: number;
            accessToken: string;
            refreshToken: string;
          }>();

        setTokenExpirationTimestamp(
          calculateTokenExpirationTimestamp(expiresIn)
        );

        if (IS_DESKTOP) {
          auth.setAccessToken(accessToken);
          auth.setRefreshToken(refreshToken);

          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      } else if (IS_DESKTOP) {
        request.headers.set("Authorization", `Bearer ${auth.accessToken}`);
      }
    }
  }
};

export const api = ky.create({
  prefixUrl: API_URL,
  hooks: {
    beforeRequest: [refreshToken],
  },
  credentials: "include",
});
