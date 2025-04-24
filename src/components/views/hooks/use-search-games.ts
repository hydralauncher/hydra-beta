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

interface SearchGamesResponse {
  edges: CatalogueGame[];
  count: number;
}

export function useSearchGames(props: SearchGamesProps) {
  const { data, isLoading } = useQuery({
    queryKey: [
      "search-games",
      props.take,
      props.skip,
      props.title,
      props.tags && JSON.stringify(props.tags),
      props.genres && JSON.stringify(props.genres),
      props.publishers && JSON.stringify(props.publishers),
      props.developers && JSON.stringify(props.developers),
    ],
    queryFn: async () => {
      const body = {
        take: props.take,
        skip: props.skip,
        title: props.title,
        tags: props.tags,
        genres: props.genres,
      };

      return api
        .post<SearchGamesResponse>("catalogue/search", { json: body })
        .json();
    },
  });

  return { data: { data, isLoading } };
}
