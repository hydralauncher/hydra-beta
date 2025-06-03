import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { debounce } from "lodash-es";
import {
  useCatalogueStore,
  type CatalogueState,
} from "@/stores/catalogue.store";

const DEFAULTS = { take: 20, skip: 0 } as const;

const FILTER_FIELDS = [
  "tags",
  "genres",
  "publishers",
  "developers",
  "downloadSourceFingerprints",
] as const;

type FilterValue = string | number;
type FilterArray = FilterValue[];

function safeParseArray(value: string | null): FilterArray {
  try {
    const parsed = JSON.parse(value ?? "");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function urlToState(params: URLSearchParams): Partial<CatalogueState> {
  const state: Partial<CatalogueState> = {};

  const title = params.get("title");
  if (title) state.title = title;

  const take = Number(params.get("take"));
  if (take && take !== DEFAULTS.take) state.take = take;

  const skip = Number(params.get("skip"));
  if (skip && skip !== DEFAULTS.skip) state.skip = skip;

  FILTER_FIELDS.forEach((key) => {
    const arr = safeParseArray(params.get(key));
    if (arr.length) {
      (state as Record<string, FilterArray>)[key] = arr;
    }
  });

  return state;
}

function stateToUrl(state: CatalogueState): string {
  const params = new URLSearchParams();

  if (state.title?.trim()) params.set("title", state.title.trim());
  if (state.take !== DEFAULTS.take) params.set("take", String(state.take));
  if (state.skip !== DEFAULTS.skip) params.set("skip", String(state.skip));

  FILTER_FIELDS.forEach((key) => {
    const value = state[key];
    if (Array.isArray(value) && value.length) {
      params.set(key, JSON.stringify(value));
    }
  });

  return params.toString();
}

export function useCatalogueSync() {
  const store = useCatalogueStore();
  const searchParams = useSearchParams();
  const router = useRouter();

  const syncing = useRef(false);
  const lastUrl = useRef("");

  const updateUrl = useRef(
    debounce((state: CatalogueState) => {
      if (syncing.current) return;

      const nextUrl = stateToUrl(state);
      if (nextUrl !== lastUrl.current) {
        lastUrl.current = nextUrl;
        router.replace(`?${nextUrl}`, { scroll: false });
      }
    }, 100)
  );

  useEffect(() => {
    const currentUrl = searchParams.toString();
    if (currentUrl === lastUrl.current) return;

    syncing.current = true;
    lastUrl.current = currentUrl;

    const parsedState = urlToState(searchParams);
    store.setFilters(parsedState);
    syncing.current = false;
  }, [searchParams, store]);

  useEffect(() => {
    updateUrl.current(store);
  }, [store]);
}
