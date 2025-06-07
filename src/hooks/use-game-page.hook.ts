import { api } from "@/services";
import type {
  GameShop,
  HowLongToBeatCategory,
  SteamAchievement,
  UserGame,
} from "@/types";
import { toast } from "sonner";
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
      return toast.promise(
        async () => {
          setIsFavorite(!isFavorite);

          try {
            await toggleGameFavorite(shop, objectId);
          } catch (error) {
            console.error(error);
            setIsFavorite(isFavorite);

            throw error;
          }
        },
        {
          loading: `${isFavorite ? "Removing from" : "Adding to"} favorites...`,
          success: `${isFavorite ? "Removed from" : "Added to"} favorites`,
          error: `Failed to ${isFavorite ? "remove from" : "add to"} favorites`,
        }
      );
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
