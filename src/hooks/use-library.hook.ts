import { api } from "@/services";
import { type Game, useLibraryStore } from "@/stores";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { useUser } from "@/hooks";
import { GameShop } from "@/types";

export function useLibrary() {
  const { setLibrary, library } = useLibraryStore();
  const { user } = useUser();

  const { data, refetch, isLoading } = useQuery<Game[]>({
    queryKey: ["library", user?.id],
    queryFn: () => api.get("profile/games").json(),
  });

  useEffect(() => {
    if (data) {
      setLibrary(data);
    }
  }, [data, setLibrary]);

  const toggleGameFavorite = useCallback(
    async (shop: GameShop, objectId: string) => {
      const game = library.find(
        (game) => game.objectId === objectId && game.shop === shop
      );

      if (!game) {
        return;
      }

      let newState = !game.isFavorite;

      try {
        if (game.isFavorite) {
          await api.put(`profile/games/${shop}/${objectId}/unfavorite`).json();
        } else {
          await api.put(`profile/games/${shop}/${objectId}/favorite`).json();
        }
      } catch (error) {
        console.error(error);
        newState = game.isFavorite;
      }

      setLibrary(
        library.map((game) =>
          game.objectId === objectId && game.shop === shop
            ? { ...game, isFavorite: newState }
            : game
        )
      );
    },
    [library, setLibrary]
  );

  return {
    library,
    isLoading,
    getLibrary: refetch,
    toggleGameFavorite,
  };
}
