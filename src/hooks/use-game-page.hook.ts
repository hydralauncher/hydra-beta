import { ShopAssets } from "@/pages/game/[id]/[slug]";
import { api } from "@/services/api.service";
import { HowLongToBeatCategory } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useGamePage(objectId: string, shop: string) {
  const { data: howLongToBeat } = useQuery<HowLongToBeatCategory[]>({
    queryKey: ["howLongToBeat", shop, objectId],
    queryFn: () =>
      api
        .get(`games/how-long-to-beat?objectId=${objectId}&shop=${shop}`)
        .json(),
    initialData: [],
  });

  const { data: achievements } = useQuery<
    { name: string; displayName: string; description: string; icon: string }[]
  >({
    queryKey: ["achievements", shop, objectId],
    queryFn: () =>
      api.get(`games/achievements?objectId=${objectId}&shop=${shop}`).json(),
    initialData: [],
  });

  const { data: profileGame } = useQuery<
    | ({
        playTimeInSeconds: number;
        lastTimePlayed: string | null;
        isFavorite: boolean;
      } & ShopAssets)
    | null
  >({
    queryKey: ["game-page", shop, objectId],
    queryFn: () => api.get(`profile/games/${shop}/${objectId}`).json(),
    initialData: null,
  });

  const { mutate: toggleFavorite } = useMutation({
    mutationFn: async (isFavorite: boolean) => {
      if (!isFavorite) {
        await api.put(`profile/games/${shop}/${objectId}/unfavorite`).json();
      } else {
        await api.put(`profile/games/${shop}/${objectId}/favorite`).json();
      }
    },
  });

  return { howLongToBeat, achievements, profileGame, toggleFavorite };
}
