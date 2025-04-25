import { useQuery } from "@tanstack/react-query";

interface SteamGenresResponse {
  en: string[];
  es: string[];
  pt: string[];
  ru: string[];
}

interface SteamUserTagsResponse {
  en: Record<string, number>;
  es: Record<string, number>;
  pt: Record<string, number>;
  ru: Record<string, number>;
}

interface CatalogueData {
  genres: SteamGenresResponse;
  userTags: SteamUserTagsResponse;
  developers: string[];
  publishers: string[];
}

async function fetchCatalogueData(): Promise<CatalogueData> {
  const [genres, userTags, developers, publishers] = await Promise.all([
    fetch("/assets/steam-genres.json").then((res) => res.json()),
    fetch("/assets/steam-user-tags.json").then((res) => res.json()),
    fetch("/assets/steam-developers.json").then((res) => res.json()),
    fetch("/assets/steam-publishers.json").then((res) => res.json()),
  ]);

  return {
    genres,
    userTags,
    developers,
    publishers,
  };
}

export function useCatalogueData() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["catalogue"],
    queryFn: () => fetchCatalogueData(),
  });

  return {
    data,
    isLoading,
    isError,
    error,
  };
}
