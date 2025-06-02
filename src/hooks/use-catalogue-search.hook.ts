import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api.service";
import type { CatalogueGame } from "@/types";
import { useCatalogueStore } from "@/stores/catalogue.store";
import { useState, useEffect } from "react";
import { debounce } from "lodash-es";

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

export function useCatalogueSearch() {
  const storeValues = useCatalogueStore();
  const [debouncedValues, setDebouncedValues] = useState(storeValues);

  useEffect(() => {
    const debouncedUpdate = debounce((values) => {
      setDebouncedValues(values);
    }, 300);

    debouncedUpdate(storeValues);
    return () => debouncedUpdate.cancel();
  }, [storeValues]);

  const searchQuery = useQuery<SearchGamesResponseData>({
    queryKey: [
      "search-games",
      debouncedValues.title,
      debouncedValues.take,
      debouncedValues.skip,
      debouncedValues.tags,
      debouncedValues.genres,
      debouncedValues.publishers,
      debouncedValues.developers,
      debouncedValues.downloadSourceFingerprints,
    ],
    queryFn: () =>
      api
        .post("catalogue/search", {
          json: debouncedValues,
        })
        .json(),
  });

  const searchData = searchQuery.data;
  const isEmpty = !searchData || searchData.edges.length === 0;

  return {
    search: {
      data: searchData,
      isLoading: searchQuery.isLoading,
      isError: searchQuery.isError,
      error: searchQuery.error,
      isEmpty,
    },
  };
}
