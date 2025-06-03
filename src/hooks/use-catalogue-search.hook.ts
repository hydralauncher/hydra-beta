import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api.service";
import type { CatalogueGame } from "@/types";
import { useCatalogueStore } from "@/stores/catalogue.store";
import { useState, useEffect } from "react";
import { debounce } from "lodash-es";

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

  const { data, isLoading, isError, error } = useQuery<SearchGamesResponseData>(
    {
      queryKey: ["search-games", debouncedValues],
      queryFn: () =>
        api.post("catalogue/search", { json: debouncedValues }).json(),
    }
  );

  return {
    search: {
      data,
      isLoading,
      isError,
      error,
      isEmpty: data?.edges.length === 0,
    },
  };
}
