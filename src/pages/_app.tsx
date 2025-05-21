import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { Sidebar } from "@/layouts/sidebar/sidebar";
import { useCallback, useEffect } from "react";
import { IS_DESKTOP } from "@/constants";
import { Keytar, api } from "@/services";
import type { Auth, CatalogueGameModel } from "@/types";
import { setCookie } from "typescript-cookie";
import { DexieService } from "@/services/dexie.service";

const queryClient = new QueryClient();

function GameSyncProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { data: profileGames } = useQuery<CatalogueGameModel[]>({
    queryKey: ["profile-games"],
    queryFn: () => api.get("profile/games", { credentials: "include" }).json(),
  });

  const syncProfileLibrary = useCallback(async () => {
    if (!profileGames) return;

    console.log("profileGames", profileGames);

    try {
      const db = DexieService.getInstance();

      await db.transaction("rw", db.games, async () => {
        const localGames = await db.games.toArray();
        const addedGameList = [];
        const updatedGameList = [];
        const remoteGameIds = new Set();

        const localGamesMap = new Map(
          localGames.map((game) => [
            game.objectId,
            { id: game.id, updatedAt: game.updatedAt },
          ])
        );

        for (const remoteGame of profileGames) {
          remoteGameIds.add(remoteGame.objectId);

          const localGame = localGamesMap.get(remoteGame.objectId);

          if (!localGame) {
            addedGameList.push(remoteGame);
          } else if (
            new Date(remoteGame.updatedAt).getTime() >
            new Date(localGame.updatedAt).getTime()
          ) {
            remoteGame.id = localGame.id;
            updatedGameList.push(remoteGame);
          }
        }

        // eu nao sei como eh no launcher prod, mas vou assumir que devo remover os jogos que nao estao mais na api
        const gameIdsToRemove = localGames
          .filter((game) => !remoteGameIds.has(game.objectId))
          .map((game) => game.id);

        if (addedGameList.length > 0)
          await db.games.bulkAdd(addedGameList);

        if (updatedGameList.length > 0)
          await db.games.bulkPut(updatedGameList);

        if (gameIdsToRemove.length > 0)
          await db.games.bulkDelete(gameIdsToRemove);
      });
    } catch (error) {
      console.error("Erro ao sincronizar jogos:", error);
    }
  }, [profileGames]);

  useEffect(() => {
    syncProfileLibrary();
  }, [profileGames, syncProfileLibrary]);

  return <>{children}</>;
}

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
      <GameSyncProvider>
        <Sidebar />
        <Component {...pageProps} />
      </GameSyncProvider>
    </QueryClientProvider>
  );
}
