import { useQuery } from "@tanstack/react-query";
import { api } from "@/services";
import type { TrendingGame, CatalogueGame } from "@/types";

export const useHomeData = () => {
  const {
    data: catalogueTrendingGamesData,
    isLoading: catalogueTrendingGamesLoading,
  } = useQuery({
    queryKey: ["catalogue-trending-games"],
    queryFn: () => {
      return api.get<TrendingGame[]>("games/trending").json();
    },
  });

  const { data: catalogueHotGamesData, isLoading: catalogueHotGamesLoading } =
    useQuery({
      queryKey: ["catalogue-hot-games"],
      queryFn: () => {
        const take = 12;
        const skip = 0;

        return api
          .get<CatalogueGame[]>(`catalogue/hot?take=${take}&skip=${skip}`)
          .json();
      },
    });

  const {
    data: catalogueGamesToBeatData,
    isLoading: catalogueGamesToBeatLoading,
  } = useQuery({
    queryKey: ["catalogue-games-to-beat"],
    queryFn: () => {
      return api.get<CatalogueGame[]>("catalogue/achievements").json();
    },
  });

  return {
    catalogueTrendingGames: {
      data: catalogueTrendingGamesData,
      isLoading: catalogueTrendingGamesLoading,
    },
    catalogueHotGames: {
      data: catalogueHotGamesData,
      isLoading: catalogueHotGamesLoading,
    },
    catalogueGamesToBeat: {
      data: catalogueGamesToBeatData,
      isLoading: catalogueGamesToBeatLoading,
    },
  };
};
