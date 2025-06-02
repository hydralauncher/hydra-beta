import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { debounce } from "lodash-es";
import {
  useCatalogueStore,
  type CatalogueState,
} from "@/stores/catalogue.store";
import type { SearchGamesFormValues } from "./use-catalogue-search.hook";
import { IS_BROWSER } from "@/constants";

function parseParam<T>(value: string | null): T | undefined {
  if (!value) return undefined;
  try {
    return JSON.parse(value);
  } catch {
    return value as unknown as T;
  }
}

function getInitialValues(
  params: URLSearchParams
): Partial<SearchGamesFormValues> {
  return {
    take: Number(params.get("take") ?? "20"),
    skip: Number(params.get("skip") ?? "0"),
    title: params.get("title") ?? "",
    tags: parseParam<number[]>(params.get("tags")) ?? [],
    genres: parseParam<string[]>(params.get("genres")) ?? [],
    publishers: parseParam<string[]>(params.get("publishers")) ?? [],
    developers: parseParam<string[]>(params.get("developers")) ?? [],
    downloadSourceFingerprints:
      parseParam<string[]>(params.get("downloadSourceFingerprints")) ?? [],
  };
}

function hasSearchParams(params: URLSearchParams): boolean {
  return Array.from(params.keys()).some((key) =>
    [
      "take",
      "skip",
      "title",
      "tags",
      "genres",
      "publishers",
      "developers",
      "downloadSourceFingerprints",
    ].includes(key)
  );
}

function toSearchParams(values: CatalogueState): URLSearchParams {
  const query = new URLSearchParams();

  if (values.take !== 20) query.set("take", String(values.take));
  if (values.skip !== 0) query.set("skip", String(values.skip));
  if (values.title) query.set("title", values.title);
  if (values.tags?.length) query.set("tags", JSON.stringify(values.tags));
  if (values.genres?.length) query.set("genres", JSON.stringify(values.genres));
  if (values.publishers?.length)
    query.set("publishers", JSON.stringify(values.publishers));
  if (values.developers?.length)
    query.set("developers", JSON.stringify(values.developers));
  if (values.downloadSourceFingerprints?.length)
    query.set(
      "downloadSourceFingerprints",
      JSON.stringify(values.downloadSourceFingerprints)
    );

  return query;
}

export function useCatalogueFormSync() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setFilters } = useCatalogueStore();
  const storeValues = useCatalogueStore();
  const isInitialMount = useRef(true);

  const {
    title,
    take,
    skip,
    tags,
    genres,
    publishers,
    developers,
    downloadSourceFingerprints,
  } = storeValues;

  useEffect(() => {
    if (isInitialMount.current && hasSearchParams(searchParams)) {
      const urlValues = getInitialValues(searchParams);
      setFilters(urlValues);
      isInitialMount.current = false;
    } else {
      isInitialMount.current = false;
    }
  }, [searchParams, setFilters]);

  useEffect(() => {
    if (!IS_BROWSER) return;

    const urlRelevantValues = {
      title,
      take,
      skip,
      tags,
      genres,
      publishers,
      developers,
      downloadSourceFingerprints,
    };

    const updateUrl = debounce((values: typeof urlRelevantValues) => {
      const query = toSearchParams(values as CatalogueState);
      router.replace(`?${query.toString()}`);
    }, 300);

    updateUrl(urlRelevantValues);
    return () => updateUrl.cancel();
  }, [
    title,
    take,
    skip,
    tags,
    genres,
    publishers,
    developers,
    downloadSourceFingerprints,
    router,
  ]);
}
