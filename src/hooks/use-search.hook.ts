import { useMemo, useState, useEffect } from "react";
import debounce from "lodash-es/debounce";

export function useSearch<T>(items: T[], fieldsToSearch: (keyof T)[]) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = debounce((value: string) => {
      setDebouncedSearch(value);
    }, 100);

    handler(search);

    return () => {
      handler.cancel();
    };
  }, [search]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      return fieldsToSearch.some((field) => {
        return String(item[field])
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase());
      });
    });
  }, [items, fieldsToSearch, debouncedSearch]);

  return {
    search,
    setSearch,
    filteredItems,
  };
}
