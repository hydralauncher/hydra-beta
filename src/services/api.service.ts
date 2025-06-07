import { IS_BROWSER } from "@/constants";
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
        const { expiresIn, accessToken } = await ky
          .post(`${API_URL}/auth/refresh`, {
            json: { refreshToken: auth.refreshToken },
          })
          .json<{
            expiresIn: number;
            accessToken: string;
          }>();

        setTokenExpirationTimestamp(
          calculateTokenExpirationTimestamp(expiresIn)
        );

        auth.setAccessToken(accessToken);

        request.headers.set("Authorization", `Bearer ${accessToken}`);
      } else {
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
});
