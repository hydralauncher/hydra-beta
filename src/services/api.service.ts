import ky from "ky";
import { getCookie, setCookie } from "typescript-cookie";

import { IS_BROWSER } from "@/constants";

export const ACCESS_TOKEN_EXPIRATION_OFFSET_IN_MS = 1000 * 60 * 5;

export const calculateTokenExpirationTimestamp = (expiresIn: number) => {
  return Date.now() + expiresIn * 1000;
};

const API_URL = import.meta.env.PUBLIC_API_URL;

const refreshToken = async () => {
  if (IS_BROWSER) {
    const tokenExpirationTimestamp = getCookie("tokenExpirationTimestamp");

    if (tokenExpirationTimestamp) {
      if (
        Number(tokenExpirationTimestamp) <
        Date.now() - ACCESS_TOKEN_EXPIRATION_OFFSET_IN_MS
      ) {
        const { expiresIn } = await ky
          .post(`${API_URL}/auth/refresh`, {
            credentials: "include",
          })
          .json<{ expiresIn: number }>();

        setCookie(
          "tokenExpirationTimestamp",
          calculateTokenExpirationTimestamp(expiresIn).toString()
        );
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
