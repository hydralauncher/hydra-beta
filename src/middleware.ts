import { defineMiddleware } from "astro:middleware";
import {
  ACCESS_TOKEN_EXPIRATION_OFFSET_IN_MS,
  calculateTokenExpirationTimestamp,
  refreshToken,
} from "./services";
import type { Auth } from "./stores/auth.store";

const getAccessToken = async (
  authCookie: Auth
): Promise<{ accessToken: string; expiresIn: number }> => {
  if (
    authCookie.tokenExpirationTimestamp &&
    authCookie.tokenExpirationTimestamp <
      Date.now() - ACCESS_TOKEN_EXPIRATION_OFFSET_IN_MS
  ) {
    const { accessToken, expiresIn } = await refreshToken(authCookie);

    return { accessToken, expiresIn };
  }

  return {
    accessToken: authCookie.accessToken,
    expiresIn: authCookie.expiresIn,
  };
};

export const onRequest = defineMiddleware(async (context, next) => {
  const authCookie = context.cookies.get("auth")?.json();

  if (authCookie) {
    const { state } = authCookie;

    if (state.auth) {
      const { accessToken, expiresIn } = await getAccessToken(state.auth);

      if (accessToken !== state.auth.accessToken) {
        context.cookies.set(
          "auth",
          JSON.stringify({
            state: {
              auth: {
                ...state.auth,
                accessToken,
                tokenExpirationTimestamp:
                  calculateTokenExpirationTimestamp(expiresIn),
              },
            },
            version: 0,
          }),
          {
            path: "/",
          }
        );
      }

      context.locals.accessToken = accessToken;
    }
  }

  return next();
});
