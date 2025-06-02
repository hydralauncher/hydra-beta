import { useQuery } from "@tanstack/react-query";
import ky from "ky";

export interface SteamGenresResponse {
  en: string[];
  es: string[];
  pt: string[];
  ru: string[];
}

export interface SteamUserTagsResponse {
  en: Record<string, number>;
  es: Record<string, number>;
  pt: Record<string, number>;
  ru: Record<string, number>;
}

export interface CatalogueData {
  genres: SteamGenresResponse;
  userTags: SteamUserTagsResponse;
  developers: string[];
  publishers: string[];
}

async function fetchJson<T>(url: string): Promise<T> {
  return ky.get(url).json();
}

export function useCatalogueAssets() {
  const genresQuery = useQuery<SteamGenresResponse>({
    queryKey: ["catalogue", "genres"],
    queryFn: () => fetchJson("/assets/steam-genres.json"),
  });

  const userTagsQuery = useQuery<SteamUserTagsResponse>({
    queryKey: ["catalogue", "userTags"],
    queryFn: () => fetchJson("/assets/steam-user-tags.json"),
  });

  const developersQuery = useQuery<string[]>({
    queryKey: ["catalogue", "developers"],
    queryFn: () => fetchJson("/assets/steam-developers.json"),
  });

  const publishersQuery = useQuery<string[]>({
    queryKey: ["catalogue", "publishers"],
    queryFn: () => fetchJson("/assets/steam-publishers.json"),
  });

  const isLoading =
    genresQuery.isLoading ||
    userTagsQuery.isLoading ||
    developersQuery.isLoading ||
    publishersQuery.isLoading;

  const isError =
    genresQuery.isError ||
    userTagsQuery.isError ||
    developersQuery.isError ||
    publishersQuery.isError;

  const error =
    genresQuery.error ||
    userTagsQuery.error ||
    developersQuery.error ||
    publishersQuery.error;

  const data =
    genresQuery.data &&
    userTagsQuery.data &&
    developersQuery.data &&
    publishersQuery.data
      ? {
          genres: genresQuery.data,
          userTags: userTagsQuery.data,
          developers: developersQuery.data,
          publishers: publishersQuery.data,
        }
      : undefined;

  return { data, isLoading, isError, error };
}
