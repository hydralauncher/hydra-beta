import { api } from "@/services/api.service";
import { HowLongToBeatCategory } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useGamePage(objectId: string, shop: string) {
  const { data: howLongToBeat } = useQuery<HowLongToBeatCategory[]>({
    queryKey: ["howLongToBeat", shop, objectId],
    queryFn: () =>
      api
        .get(`games/how-long-to-beat?objectId=${objectId}&shop=${shop}`)
        .json(),
    initialData: [],
  });

  const { data: achievements } = useQuery({
    queryKey: ["achievements", shop, objectId],
    queryFn: () =>
      api.get(`games/achievements?objectId=${objectId}&shop=${shop}`).json(),
    initialData: [],
  });

  const { data: profileGame } = useQuery({
    queryKey: ["game-page", shop, objectId],
    queryFn: () => api.get(`profile/games/${shop}/${objectId}`).json(),
    initialData: null,
  });

  return { howLongToBeat, achievements, profileGame };
}
