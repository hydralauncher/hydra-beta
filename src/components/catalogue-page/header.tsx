import { SearchGamesFormValues, useCatalogueData } from "@/hooks";
import { Typography } from "../common";
import { Chip } from "../common/chip";
import { UseFormReturn } from "react-hook-form";
import { FILTERS } from "./filters.config";
import { motion } from "framer-motion";

interface HeaderProps {
  form: UseFormReturn<SearchGamesFormValues>;
}

export default function Header({ form }: Readonly<HeaderProps>) {
  const { catalogueData } = useCatalogueData();
  const { watch, setValue } = form;
  const [title, genres, tags, publishers, developers] = watch([
    "title",
    "genres",
    "tags",
    "publishers",
    "developers",
  ]);

  const getTagName = (value: number) =>
    Object.keys(catalogueData?.tags["en"] ?? {}).find(
      (tagKey) => catalogueData?.tags["en"][tagKey] === value
    ) || value.toString();

  const getFilterColor = (filter: string | number) => {
    if (genres?.includes(filter as string)) return FILTERS.genres.color;
    if (catalogueData?.tags["en"][filter as string]) return FILTERS.tags.color;
    if (publishers?.includes(filter as string)) return FILTERS.publishers.color;
    if (developers?.includes(filter as string)) return FILTERS.developers.color;
    return "red";
  };

  const activeFilters = [
    ...(genres ?? []),
    ...((tags ?? []).map(getTagName) ?? []),
    ...(developers ?? []),
    ...(publishers ?? []),
  ];

  const hasActiveFilters = !!title || activeFilters.length > 0;

  const handleRemoveFilter = (filter: string | number) => {
    if (genres?.includes(filter as string)) {
      setValue(
        "genres",
        genres.filter((g) => g !== filter)
      );
    } else if (catalogueData?.tags["en"][filter as string]) {
      const tagId = catalogueData.tags["en"][filter as string];
      setValue(
        "tags",
        tags?.filter((t) => t !== tagId)
      );
    } else if (publishers?.includes(filter as string)) {
      setValue(
        "publishers",
        publishers.filter((p) => p !== filter)
      );
    } else if (developers?.includes(filter as string)) {
      setValue(
        "developers",
        developers.filter((d) => d !== filter)
      );
    }
  };

  const handleRemoveAllFilters = () => {
    setValue("title", "");
    setValue("genres", []);
    setValue("tags", []);
    setValue("publishers", []);
    setValue("developers", []);
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
                key={filter}
                layout="position"
                transition={{
                  type: "spring",
                  stiffness: 600,
                  damping: 40,
                }}
              >
                <Chip
                  color={getFilterColor(filter)}
                  label={filter.toString()}
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
