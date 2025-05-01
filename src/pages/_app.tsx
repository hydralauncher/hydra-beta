import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Sidebar } from "@/layouts/sidebar/sidebar";
import { useCallback, useEffect } from "react";
import { IS_DESKTOP } from "@/constants";
import { Keytar } from "@/services";
import type { Auth } from "@/types";
import { setCookie } from "typescript-cookie";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const importLegacyAuth = useCallback(async () => {
    if (IS_DESKTOP) {
      const accessTokenKeytar = new Keytar("access-token");
      const refreshTokenKeytar = new Keytar("refresh-token");

      if (await refreshTokenKeytar.getPassword()) {
        return;
      }

      import("@tauri-apps/api/core").then(async ({ invoke }) => {
        const auth = await invoke<Auth | null>("get_legacy_auth");

        if (!auth) {
          return;
        }

        const { accessToken, refreshToken, tokenExpirationTimestamp } = auth;

        await Promise.all([
          accessTokenKeytar.savePassword(accessToken),
          refreshTokenKeytar.savePassword(refreshToken),
        ]);

        setCookie("tokenExpirationTimestamp", tokenExpirationTimestamp);
      });
    }
  }, []);

  useEffect(() => {
    importLegacyAuth();
  }, [importLegacyAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <Sidebar />
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}
