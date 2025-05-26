import { api } from "@/services/api.service";
import type {
  GameShop,
  HowLongToBeatCategory,
  SteamAchievement,
  UserGame,
} from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLibrary } from "./use-library.hook";
import { useEffect, useState } from "react";

export function useGamePage(shop: GameShop, objectId: string) {
  const [isFavorite, setIsFavorite] = useState(false);
  const { toggleGameFavorite } = useLibrary();

  const { data: howLongToBeat } = useQuery<HowLongToBeatCategory[]>({
    queryKey: ["howLongToBeat", shop, objectId],
    queryFn: () =>
      api
        .get(`games/how-long-to-beat?objectId=${objectId}&shop=${shop}`)
        .json(),
    initialData: [],
  });

  const { data: achievements } = useQuery<SteamAchievement[]>({
    queryKey: ["achievements", shop, objectId],
    queryFn: () =>
      api.get(`games/achievements?objectId=${objectId}&shop=${shop}`).json(),
    initialData: [],
  });

  const { data: profileGame } = useQuery<UserGame | null>({
    queryKey: ["game-page", shop, objectId],
    queryFn: () => api.get(`profile/games/${shop}/${objectId}`).json(),
    initialData: null,
  });

  useEffect(() => {
    setIsFavorite(profileGame?.isFavorite ?? false);
  }, [profileGame]);

  const { mutate: toggleFavorite } = useMutation({
    mutationFn: async () => {
      setIsFavorite(!isFavorite);

      try {
        await toggleGameFavorite(shop, objectId);
      } catch (error) {
        console.error(error);
        setIsFavorite(isFavorite);
      }
    },
  });

  return {
    howLongToBeat,
    achievements,
    profileGame,
    toggleFavorite,
    isFavorite,
  };
}
