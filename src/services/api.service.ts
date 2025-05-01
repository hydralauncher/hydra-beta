import ky, { BeforeRequestHook } from "ky";
import { getCookie, setCookie } from "typescript-cookie";

import { IS_BROWSER, IS_DESKTOP } from "@/constants";
import { Keytar } from "./keytar.service";

export const ACCESS_TOKEN_EXPIRATION_OFFSET_IN_MS = 1000 * 60 * 5;

export const calculateTokenExpirationTimestamp = (expiresIn: number) => {
  return Date.now() + expiresIn * 1000;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const accessTokenKeytar = new Keytar("access-token");
const refreshTokenKeytar = new Keytar("refresh-token");

const getRefreshTokenBody = async () => {
  if (IS_DESKTOP) {
    const accessToken = await accessTokenKeytar.getPassword();
    const refreshToken = await refreshTokenKeytar.getPassword();

    return { accessToken, refreshToken };
  }

  return null;
};

const refreshToken: BeforeRequestHook = async (request) => {
  if (IS_BROWSER) {
    const tokenExpirationTimestamp = getCookie("tokenExpirationTimestamp");

    if (tokenExpirationTimestamp) {
      if (
        Number(tokenExpirationTimestamp) <
        Date.now() - ACCESS_TOKEN_EXPIRATION_OFFSET_IN_MS
      ) {
        const { expiresIn, accessToken, refreshToken } = await ky
          .post(`${API_URL}/auth/refresh`, {
            credentials: "include",
            json: await getRefreshTokenBody(),
          })
          .json<{
            expiresIn: number;
            accessToken: string;
            refreshToken: string;
          }>();

        setCookie(
          "tokenExpirationTimestamp",
          calculateTokenExpirationTimestamp(expiresIn).toString()
        );

        if (IS_DESKTOP) {
          await Promise.all([
            accessTokenKeytar.savePassword(accessToken),
            refreshTokenKeytar.savePassword(refreshToken),
          ]);
        }

        request.headers.set("Authorization", `Bearer ${accessToken}`);
      } else if (IS_DESKTOP) {
        const accessToken = await accessTokenKeytar.getPassword();

        request.headers.set("Authorization", `Bearer ${accessToken}`);
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
