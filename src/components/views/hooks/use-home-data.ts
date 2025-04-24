import { useQuery } from "@tanstack/react-query";
import { api } from "@/services";
import type { TrendingGame, CatalogueGame } from "@/types";

interface CatalogueResponse<T> {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

interface HomeData {
  catalogueTrendingGames: CatalogueResponse<TrendingGame[]>;
  catalogueHotGames: CatalogueResponse<CatalogueGame[]>;
  catalogueGamesToBeat: CatalogueResponse<CatalogueGame[]>;
}

export function useHomeData(): HomeData {
  const {
    data: catalogueTrendingGamesData,
    isLoading: catalogueTrendingGamesLoading,
    isError: isTrendingError,
    error: trendingError,
  } = useQuery({
    queryKey: ["catalogue-trending-games"],
    queryFn: () => {
      return api.get<TrendingGame[]>("games/trending").json();
    },
  });

  const {
    data: catalogueHotGamesData,
    isLoading: catalogueHotGamesLoading,
    isError: isHotGamesError,
    error: hotGamesError,
  } = useQuery({
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
    isError: isGamesToBeatError,
    error: gamesToBeatError,
  } = useQuery({
    queryKey: ["catalogue-games-to-beat"],
    queryFn: () => {
      const take = 12;
      const skip = 0;

      return api
        .get<
          CatalogueGame[]
        >(`catalogue/achievements?take=${take}&skip=${skip}`)
        .json();
    },
  });

  return {
    catalogueTrendingGames: {
      data: catalogueTrendingGamesData,
      isLoading: catalogueTrendingGamesLoading,
      isError: isTrendingError,
      error: trendingError,
    },
    catalogueHotGames: {
      data: catalogueHotGamesData,
      isLoading: catalogueHotGamesLoading,
      isError: isHotGamesError,
      error: hotGamesError,
    },
    catalogueGamesToBeat: {
      data: catalogueGamesToBeatData,
      isLoading: catalogueGamesToBeatLoading,
      isError: isGamesToBeatError,
      error: gamesToBeatError,
    },
  };
}
