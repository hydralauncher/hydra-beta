import { api } from "@/services/api.service";
import type { CatalogueGame } from "@/types";
import { useQuery } from "@tanstack/react-query";

interface SearchGamesProps {
  take?: number;
  skip?: number;
  title?: string;
  tags?: number[];
  genres?: string[];
  publishers?: string[];
  developers?: string[];
}

interface SearchGamesResponseData {
  edges: CatalogueGame[];
  count: number;
}

interface SearchGamesResult {
  searchData: {
    data: SearchGamesResponseData | undefined;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    isEmpty: boolean;
  };
}

export function useSearchGames(props: SearchGamesProps): SearchGamesResult {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      "search-games",
      props.take,
      props.skip,
      props.title,
      props.tags,
      props.genres,
      props.publishers,
      props.developers,
    ],
    queryFn: () => {
      const body = {
        take: props.take,
        skip: props.skip,
        title: props.title,
        tags: props.tags,
        genres: props.genres,
        publishers: props.publishers,
        developers: props.developers,
      };

      return api
        .post<SearchGamesResponseData>("catalogue/search", { json: body })
        .json();
    },
  });

  const isEmpty = !data || data.edges.length === 0;

  return {
    searchData: {
      data,
      isLoading,
      isError,
      error,
      isEmpty,
    },
  };
}
