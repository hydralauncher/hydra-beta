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

    // Genres
    genres.forEach((genre) => {
      filters.push({
        type: "genres",
        value: genre,
        label: genre,
        color: FILTER_COLORS.genres,
      });
    });

    // User Tags (tags -> names from catalogue data)
    if (catalogueData) {
      tags.forEach((tagId) => {
        const tagName = Object.keys(catalogueData.userTags.en).find(
          (name) => catalogueData.userTags.en[name] === tagId
        );
        if (tagName) {
          filters.push({
            type: "userTags",
            value: tagId,
            label: tagName,
            color: FILTER_COLORS.userTags,
          });
        }
      });
    }

    // Developers
    developers.forEach((developer) => {
      filters.push({
        type: "developers",
        value: developer,
        label: developer,
        color: FILTER_COLORS.developers,
      });
    });

    // Publishers
    publishers.forEach((publisher) => {
      filters.push({
        type: "publishers",
        value: publisher,
        label: publisher,
        color: FILTER_COLORS.publishers,
      });
    });

    // Download Sources (fingerprints -> names)
    downloadSourceFingerprints.forEach((fingerprint) => {
      const source = downloadSources.find(
        (ds) => ds.fingerprint === fingerprint
      );
      if (source) {
        filters.push({
          type: "downloadSourceFingerprints",
          value: fingerprint,
          label: source.name,
          color: FILTER_COLORS.downloadSourceFingerprints,
        });
      }
    });

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
    switch (filter.type) {
      case "genres":
        setFilters({ genres: genres.filter((g) => g !== filter.value) });
        break;
      case "userTags":
        setFilters({ tags: tags.filter((t) => t !== filter.value) });
        break;
      case "developers":
        setFilters({
          developers: developers.filter((d) => d !== filter.value),
        });
        break;
      case "publishers":
        setFilters({
          publishers: publishers.filter((p) => p !== filter.value),
        });
        break;
      case "downloadSourceFingerprints":
        setFilters({
          downloadSourceFingerprints: downloadSourceFingerprints.filter(
            (ds) => ds !== filter.value
          ),
        });
        break;
    }
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
