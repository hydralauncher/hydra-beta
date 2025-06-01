import { motion } from "framer-motion";
import { Typography, Chip } from "@/components";
import { useCatalogueStore } from "@/stores/catalogue.store";
import { useDownloadSources } from "@/hooks/use-download-sources.hook";
import { useCatalogueAssets } from "@/hooks/use-catalogue-assets.hook";
import { useMemo } from "react";
import { type ActiveFilter } from "@/types";
import { FILTER_COLORS } from "./index";

export default function Header() {
  const {
    title,
    genres,
    tags,
    developers,
    publishers,
    downloadSourceFingerprints,
    setFilters,
  } = useCatalogueStore();

  const { data: catalogueData } = useCatalogueAssets();
  const { downloadSources } = useDownloadSources();

  const activeFilters = useMemo((): ActiveFilter[] => {
    const filters: ActiveFilter[] = [];

    const addFilters = (
      items: (string | number)[],
      type: ActiveFilter["type"],
      getLabelFn?: (item: string | number) => string
    ) => {
      items.forEach((item) => {
        filters.push({
          type,
          value: item,
          label: getLabelFn ? getLabelFn(item) : String(item),
          color: FILTER_COLORS[type],
        });
      });
    };

    addFilters(genres, "genres");
    addFilters(developers, "developers");
    addFilters(publishers, "publishers");

    if (catalogueData) {
      addFilters(tags, "userTags", (tagId) => {
        return (
          Object.keys(catalogueData.userTags.en).find(
            (name) => catalogueData.userTags.en[name] === tagId
          ) ?? String(tagId)
        );
      });
    }

    addFilters(
      downloadSourceFingerprints,
      "downloadSourceFingerprints",
      (fingerprint) => {
        return (
          downloadSources.find((ds) => ds.fingerprint === fingerprint)?.name ??
          String(fingerprint)
        );
      }
    );

    return filters;
  }, [
    genres,
    tags,
    developers,
    publishers,
    downloadSourceFingerprints,
    catalogueData,
    downloadSources,
  ]);

  const removeFilter = (filter: ActiveFilter) => {
    const filterMap = {
      genres: () =>
        setFilters({ genres: genres.filter((g) => g !== filter.value) }),
      userTags: () =>
        setFilters({ tags: tags.filter((t) => t !== filter.value) }),
      developers: () =>
        setFilters({
          developers: developers.filter((d) => d !== filter.value),
        }),
      publishers: () =>
        setFilters({
          publishers: publishers.filter((p) => p !== filter.value),
        }),
      downloadSourceFingerprints: () =>
        setFilters({
          downloadSourceFingerprints: downloadSourceFingerprints.filter(
            (ds) => ds !== filter.value
          ),
        }),
    };

    filterMap[filter.type]();
  };

  const clearAllFilters = () => {
    setFilters({
      genres: [],
      tags: [],
      developers: [],
      publishers: [],
      downloadSourceFingerprints: [],
    });
  };

  const hasSearchCriteria = Boolean(title) || activeFilters.length > 0;

  return (
    <div className="catalogue__header">
      <Typography variant="h4" className="catalogue__title">
        {hasSearchCriteria ? (
          <>
            Showing search results
            {title && (
              <>
                {" "}
                for <q>{title}</q>
              </>
            )}
          </>
        ) : (
          "Most popular games"
        )}
      </Typography>

      {activeFilters.length > 0 && (
        <div className="catalogue__header-filters">
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
                label={filter.label}
                color={filter.color}
                onRemove={() => removeFilter(filter)}
              />
            </motion.div>
          ))}

          <button className="catalogue__clear-button" onClick={clearAllFilters}>
            <Typography variant="label" className="catalogue__clear-text">
              Clear all
            </Typography>
          </button>
        </div>
      )}
    </div>
  );
}
