import { useCatalogueData } from "../hooks/use-catalogue-data";
import { useSearchGames } from "../hooks/use-search-games";
import { Input } from "@/components/common";
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/common/checkbox/checkbox";

const styles = {
  container: {
    display: "flex",
    flexDirection: "row" as const,
    gap: "1rem",
    overflowY: "scroll" as const,
    width: "100%",
  },
  filtersContainer: {
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between",
    padding: "3rem",
    gap: "1rem",
  },
  filterColumn: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "1rem",
  },
  filterList: {
    listStyle: "none",
    padding: 0,
    border: "1px solid #fff",
  },
  filterItem: {
    display: "flex",
    alignItems: "center",
    marginBottom: "8px",
  },
  searchContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "1rem",
    padding: "3rem",
    width: "100%",
  },
  resultsContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "1rem",
  },
};

function useFilterDebounce<T>(
  initialValue: T[]
): [T[], T[], (value: T, checked: boolean) => void] {
  const [selectedValues, setSelectedValues] = useState<T[]>(initialValue);
  const [debouncedValues, setDebouncedValues] = useState<T[]>(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValues(selectedValues);
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedValues]);

  const handleToggle = (value: T, checked: boolean) => {
    if (checked) {
      setSelectedValues([...selectedValues, value]);
    } else {
      setSelectedValues(selectedValues.filter((v) => v !== value));
    }
  };

  return [selectedValues, debouncedValues, handleToggle];
}

interface FilterItem<T> {
  id: T;
  name: string;
}

export function Catalogue() {
  const { data, isLoading, isError } = useCatalogueData();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [selectedGenres, debouncedGenres, handleGenreToggle] =
    useFilterDebounce<string>([]);
  const [selectedTags, debouncedTags, handleTagToggle] =
    useFilterDebounce<number>([]);
  const [selectedPublishers, debouncedPublishers, handlePublisherToggle] =
    useFilterDebounce<string>([]);
  const [selectedDevelopers, debouncedDevelopers, handleDeveloperToggle] =
    useFilterDebounce<string>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const { searchData } = useSearchGames({
    title: debouncedSearch,
    take: 32,
    skip: 0,
    genres: debouncedGenres.length > 0 ? debouncedGenres : undefined,
    tags: debouncedTags.length > 0 ? debouncedTags : undefined,
    publishers:
      debouncedPublishers.length > 0 ? debouncedPublishers : undefined,
    developers:
      debouncedDevelopers.length > 0 ? debouncedDevelopers : undefined,
  });

  function FilterSection<T extends string | number>({
    title,
    items,
    selectedItems,
    onToggle,
  }: {
    title: string;
    items: FilterItem<T>[];
    selectedItems: T[];
    onToggle: (id: T, checked: boolean) => void;
  }) {
    return (
      <div style={styles.filterColumn}>
        <h2>{title}:</h2>
        <ul style={styles.filterList}>
          {items.map((item) => (
            <li key={`${item.id}`} style={styles.filterItem}>
              <Checkbox
                checked={selectedItems.includes(item.id)}
                onChange={(checked) => onToggle(item.id, checked)}
                label={item.name}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (isLoading) return <p>loading...</p>;
  if (isError) return <p>error fetching data</p>;

  const genreItems: FilterItem<string>[] =
    data?.genres.en.slice(0, 20).map((genre) => ({ id: genre, name: genre })) ||
    [];
  const tagItems: FilterItem<number>[] = Object.entries(data?.userTags.en || {})
    .slice(0, 20)
    .map(([name, id]) => ({ id, name }));
  const publisherItems: FilterItem<string>[] =
    data?.publishers.slice(0, 20).map((pub) => ({ id: pub, name: pub })) || [];
  const developerItems: FilterItem<string>[] =
    data?.developers.slice(0, 20).map((dev) => ({ id: dev, name: dev })) || [];

  return (
    <div style={styles.container}>
      <div style={styles.searchContainer}>
        <h2>game search:</h2>
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        <div style={styles.resultsContainer}>
          <h2>search results:</h2>
          {searchData.isLoading && <p>Buscando...</p>}
          {searchData.isError && <p>Erro ao buscar jogos</p>}
          {searchData.isEmpty && !searchData.isLoading && (
            <p>Nenhum jogo encontrado</p>
          )}

          {!searchData.isEmpty && !searchData.isLoading && (
            <ol>
              {searchData.data?.edges.map((game) => (
                <li key={`${game.id || game.title}`}>{game.title}</li>
              ))}
            </ol>
          )}
        </div>
      </div>

      <div style={styles.filtersContainer}>
        <FilterSection<string>
          title="genres"
          items={genreItems}
          selectedItems={selectedGenres}
          onToggle={handleGenreToggle}
        />

        <FilterSection<number>
          title="user tags"
          items={tagItems}
          selectedItems={selectedTags}
          onToggle={handleTagToggle}
        />

        <FilterSection<string>
          title="publishers"
          items={publisherItems}
          selectedItems={selectedPublishers}
          onToggle={handlePublisherToggle}
        />

        <FilterSection<string>
          title="developers"
          items={developerItems}
          selectedItems={selectedDevelopers}
          onToggle={handleDeveloperToggle}
        />
      </div>
    </div>
  );
}
