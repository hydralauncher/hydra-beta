import { SearchGamesFormValues, CatalogueData, FilterType } from "@/hooks";
import { Typography } from "../common";
import { Chip } from "../common/chip";
import { motion } from "framer-motion";

interface HeaderProps {
  values: SearchGamesFormValues;
  updateSearchParams: (newValues: Partial<SearchGamesFormValues>) => void;
  catalogueData: CatalogueData;
}

interface FilterItem {
  type: FilterType;
  value: string | number;
  label: string;
}

export default function Header({
  values,
  updateSearchParams,
  catalogueData,
}: Readonly<HeaderProps>) {
  const { title, genres, tags, publishers, developers } = values;

  const activeFilters: FilterItem[] = [
    ...(genres?.map((value) => ({
      type: FilterType.Genres,
      label: value,
      value,
    })) ?? []),
    ...(tags?.map((id) => {
      const name =
        Object.entries(catalogueData.tags.data).find(
          ([, tagId]) => tagId === id
        )?.[0] ?? id.toString();

      return {
        type: FilterType.Tags,
        label: name,
        value: id,
      };
    }) ?? []),
    ...(publishers?.map((value) => ({
      type: FilterType.Publishers,
      label: value,
      value,
    })) ?? []),
    ...(developers?.map((value) => ({
      type: FilterType.Developers,
      label: value,
      value,
    })) ?? []),
  ];

  const hasActiveFilters = Boolean(title) || activeFilters.length > 0;

  const handleRemoveFilter = ({ type, value }: FilterItem) => {
    const currentFilters = values[type];
    if (!currentFilters) return;

    updateSearchParams({
      [type]: currentFilters.filter((v) => v !== value),
    });
  };

  const handleRemoveAllFilters = () => {
    const emptyFilters = Object.values(FilterType).reduce(
      (acc, type) => ({ ...acc, [type]: [] }),
      {}
    ) satisfies Partial<SearchGamesFormValues>;

    updateSearchParams(emptyFilters);
  };

  return (
    <div className="catalogue-header">
      <div className="catalogue-header__search-term">
        {hasActiveFilters && (
          <Typography
            variant="label"
            className="catalogue-header__search-term-text"
          >
            Showing search results for {title && <q>{title}</q>}
          </Typography>
        )}

        {!hasActiveFilters && (
          <Typography
            variant="label"
            className="catalogue-header__search-term-text"
          >
            Most popular games
          </Typography>
        )}
      </div>

      <div className="catalogue-header__filters">
        {activeFilters.length > 0 && (
          <div className="catalogue-header__filters-container">
            {activeFilters.map((filter) => (
              <motion.div
                key={`${filter.type}-${filter.value}`}
                layout="position"
                transition={{
                  type: "spring",
                  stiffness: 600,
                  damping: 40,
                }}
              >
                <Chip
                  color={catalogueData[filter.type].color}
                  label={filter.label}
                  onRemove={() => handleRemoveFilter(filter)}
                />
              </motion.div>
            ))}

            <button
              className="catalogue-header__filters__clear-button"
              onClick={() => handleRemoveAllFilters()}
            >
              <Typography
                variant="label"
                className="catalogue-header__filters__clear-button-text"
              >
                Clear all
              </Typography>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
