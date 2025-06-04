import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import { api } from "@/services/api.service";
import type { CatalogueGame } from "@/types";
import { useSearchParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { debounce } from "lodash-es";

export interface SteamGenresResponse {
  en: string[];
  es: string[];
  pt: string[];
  ru: string[];
}

export interface SteamTagsResponse {
  en: Record<string, number>;
  es: Record<string, number>;
  pt: Record<string, number>;
  ru: Record<string, number>;
}

export interface CatalogueData {
  genres: { data: string[]; label: string; color: string };
  tags: { data: Record<string, number>; label: string; color: string };
  developers: { data: string[]; label: string; color: string };
  publishers: { data: string[]; label: string; color: string };
}

export interface SearchGamesFormValues {
  take?: number;
  skip?: number;
  title?: string;
  tags?: number[];
  genres?: string[];
  publishers?: string[];
  developers?: string[];
  downloadSourceFingerprints?: string[];
}

export interface SearchGamesResponseData {
  edges: CatalogueGame[];
  count: number;
}

function parseParam<T>(value: string | null): T | undefined {
  if (!value) return undefined;
  try {
    return JSON.parse(value);
  } catch {
    return value as unknown as T;
  }
}

export function useCatalogueData() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const values = useMemo(
    () => ({
      take: parseParam<number>(searchParams.get("take")) ?? 20,
      skip: parseParam<number>(searchParams.get("skip")) ?? 0,
      title: parseParam<string>(searchParams.get("title")) ?? "",
      tags: parseParam<number[]>(searchParams.get("tags")),
      genres: parseParam<string[]>(searchParams.get("genres")),
      publishers: parseParam<string[]>(searchParams.get("publishers")),
      developers: parseParam<string[]>(searchParams.get("developers")),
      downloadSourceFingerprints: parseParam<string[]>(
        searchParams.get("downloadSourceFingerprints")
      ),
    }),
    [searchParams]
  );

  const updateSearchParams = useMemo(
    () =>
      debounce((newValues: Partial<SearchGamesFormValues>) => {
        const query = new URLSearchParams(searchParams.toString());

        Object.entries(newValues).forEach(([key, value]) => {
          if (value && (!Array.isArray(value) || value.length > 0)) {
            query.set(
              key,
              Array.isArray(value) ? JSON.stringify(value) : String(value)
            );
          } else {
            query.delete(key);
          }
        });

        router.replace(`?${query.toString()}`);
      }, 300),
    [searchParams, router]
  );

  const genresQuery = useQuery<SteamGenresResponse>({
    queryKey: ["catalogue", "genres"],
    queryFn: () => ky.get("/assets/steam-genres.json").json(),
  });

  const tagsQuery = useQuery<SteamTagsResponse>({
    queryKey: ["catalogue", "tags"],
    queryFn: () => ky.get("/assets/steam-user-tags.json").json(),
  });

  const developersQuery = useQuery<string[]>({
    queryKey: ["catalogue", "developers"],
    queryFn: () => ky.get("/assets/steam-developers.json").json(),
  });

  const publishersQuery = useQuery<string[]>({
    queryKey: ["catalogue", "publishers"],
    queryFn: () => ky.get("/assets/steam-publishers.json").json(),
  });

  const searchQuery = useQuery<SearchGamesResponseData>({
    queryKey: ["search-games", values],
    queryFn: () => api.post("catalogue/search", { json: values }).json(),
  });

  const isLoading =
    genresQuery.isLoading ||
    tagsQuery.isLoading ||
    developersQuery.isLoading ||
    publishersQuery.isLoading ||
    searchQuery.isLoading;

  const isError =
    genresQuery.isError ||
    tagsQuery.isError ||
    developersQuery.isError ||
    publishersQuery.isError ||
    searchQuery.isError;

  const error =
    genresQuery.error ||
    tagsQuery.error ||
    developersQuery.error ||
    publishersQuery.error ||
    searchQuery.error;

  const catalogueData: CatalogueData | undefined =
    genresQuery.data &&
    tagsQuery.data &&
    developersQuery.data &&
    publishersQuery.data
      ? {
          genres: {
            data: genresQuery.data.en,
            label: "Genres",
            color: "magenta",
          },
          tags: {
            data: tagsQuery.data.en,
            label: "Tags",
            color: "yellow",
          },
          developers: {
            data: developersQuery.data,
            label: "Developers",
            color: "cyan",
          },
          publishers: {
            data: publishersQuery.data,
            label: "Publishers",
            color: "lime",
          },
        }
      : undefined;

  const searchData = searchQuery.data;
  const isEmpty = !searchData || searchData.edges.length === 0;

  return {
    values,
    updateSearchParams,
    catalogueData,
    search: {
      data: searchData,
      isLoading: searchQuery.isLoading,
      isError: searchQuery.isError,
      error: searchQuery.error,
      isEmpty,
    },
    isLoading,
    isError,
    error,
  };
}
