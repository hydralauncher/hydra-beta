import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import { api } from "@/services/api.service";
import type { CatalogueGame } from "@/types";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { debounce } from "lodash-es";
import { IS_BROWSER } from "@/constants";

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

export interface SearchGamesFormValues {
  take?: number;
  skip?: number;
  title?: string;
  tags?: number[];
  genres?: string[];
  publishers?: string[];
  developers?: string[];
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

  const initialValues: SearchGamesFormValues = useMemo(() => {
    return {
      take: Number(searchParams.get("take") ?? "20"),
      skip: Number(searchParams.get("skip") ?? "0"),
      title: searchParams.get("title") || "",
      tags: parseParam<number[]>(searchParams.get("tags")),
      genres: parseParam<string[]>(searchParams.get("genres")),
      publishers: parseParam<string[]>(searchParams.get("publishers")),
      developers: parseParam<string[]>(searchParams.get("developers")),
    };
  }, [searchParams]);

  const form = useForm<SearchGamesFormValues>({
    defaultValues: initialValues,
  });

  const { watch } = form;

  useEffect(() => {
    if (!IS_BROWSER) return;

    const subscription = watch(
      debounce((values) => {
        const query = new URLSearchParams();

        if (values.take) query.set("take", String(values.take));
        if (values.skip) query.set("skip", String(values.skip));
        if (values.title) query.set("title", values.title);
        if (values.tags?.length) query.set("tags", JSON.stringify(values.tags));
        if (values.genres?.length)
          query.set("genres", JSON.stringify(values.genres));
        if (values.publishers?.length)
          query.set("publishers", JSON.stringify(values.publishers));
        if (values.developers?.length)
          query.set("developers", JSON.stringify(values.developers));

        router.replace(`?${query.toString()}`);
      }, 300)
    );

    return () => subscription.unsubscribe();
  }, [watch, router]);

  const values = form.getValues();

  const genresQuery = useQuery<SteamGenresResponse>({
    queryKey: ["catalogue", "genres"],
    queryFn: () => ky.get("/assets/steam-genres.json").json(),
  });

  const userTagsQuery = useQuery<SteamUserTagsResponse>({
    queryKey: ["catalogue", "userTags"],
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
    queryFn: () =>
      api
        .post("catalogue/search", {
          json: values,
        })
        .json(),
  });

  const isLoading =
    genresQuery.isLoading ||
    userTagsQuery.isLoading ||
    developersQuery.isLoading ||
    publishersQuery.isLoading ||
    searchQuery.isLoading;

  const isError =
    genresQuery.isError ||
    userTagsQuery.isError ||
    developersQuery.isError ||
    publishersQuery.isError ||
    searchQuery.isError;

  const error =
    genresQuery.error ||
    userTagsQuery.error ||
    developersQuery.error ||
    publishersQuery.error ||
    searchQuery.error;

  const catalogueData: CatalogueData | undefined =
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

  const searchData = searchQuery.data;
  const isEmpty = !searchData || searchData.edges.length === 0;

  return {
    form,
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
