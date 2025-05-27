import { useMemo } from "react";
import { motion } from "framer-motion";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useCatalogueStore } from "@/stores/catalogue.store";
import {
  Control,
  UseFormRegister,
  UseFormGetValues,
  UseFormSetValue,
} from "react-hook-form";
import {
  FilterSection,
  Accordion,
  Input,
  Typography,
  Chips,
  ColorDot,
  CatalogueGameCard,
} from "@/components";
import {
  CatalogueData,
  SearchGamesFormValues,
  useCatalogueData,
  SteamUserTagsResponse,
  SearchGamesQuery,
} from "../hooks";

const FILTER_CONFIG = {
  genres: {
    label: "Genres",
    color: "#d946ef",
    isObject: false,
  },
  tags: {
    label: "User Tags",
    color: "#f97316",
    isObject: true,
  },
  downloadSourceFingerprints: {
    label: "Download Sources",
    color: "#ef4444",
    isObject: true,
  },
  developers: {
    label: "Developers",
    color: "#06b6d4",
    isObject: false,
  },
  publishers: {
    label: "Publishers",
    color: "#32cd32",
    isObject: false,
  },
} as const;

type FilterKey = keyof typeof FILTER_CONFIG;

interface FilterChip {
  readonly label: string;
  readonly color: string;
  readonly type: FilterKey;
  readonly value: string;
}

interface SidebarProps {
  readonly catalogueData: CatalogueData | undefined;
  readonly control: Control<SearchGamesFormValues>;
  readonly register: UseFormRegister<SearchGamesFormValues>;
  readonly userLanguage: keyof SteamUserTagsResponse;
}

interface HeaderProps {
  readonly title?: string;
  readonly activeFilters: readonly FilterChip[];
  readonly onRemoveFilter: (filter: FilterChip) => void;
  readonly onClearAll: () => void;
}

interface GridProps {
  readonly search: SearchGamesQuery;
}

interface FilterAccordionProps {
  readonly filterKey: FilterKey;
  readonly config: (typeof FILTER_CONFIG)[FilterKey];
  readonly data: string[] | Record<string, number> | Record<string, string>;
  readonly control: Control<SearchGamesFormValues>;
}

interface ActiveFiltersChipsProps {
  readonly filters: readonly FilterChip[];
  readonly onRemoveFilter: (filter: FilterChip) => void;
  readonly onClearAll: () => void;
}

const findTagLabel = (
  catalogueData: CatalogueData,
  userLanguage: keyof SteamUserTagsResponse,
  value: string | number
) => {
  return Object.keys(catalogueData.userTags[userLanguage]).find(
    (tagKey) => catalogueData.userTags[userLanguage][tagKey] === value
  );
};

const findSourceLabel = (
  catalogueData: CatalogueData,
  value: string | number
) => {
  return Object.keys(catalogueData.downloadSources).find(
    (sourceKey) => catalogueData.downloadSources[sourceKey] === value
  );
};

const createFilterChip = (
  value: string | number,
  config: (typeof FILTER_CONFIG)[FilterKey],
  filterKey: FilterKey,
  catalogueData: CatalogueData,
  userLanguage: keyof SteamUserTagsResponse
): FilterChip => {
  let label = value.toString();

  if (filterKey === "tags") {
    const tagName = findTagLabel(catalogueData, userLanguage, value);
    label = tagName ?? `Tag ${value}`;
  } else if (filterKey === "downloadSourceFingerprints") {
    const sourceName = findSourceLabel(catalogueData, value);
    label = sourceName ?? `Source ${value}`;
  }

  return {
    label,
    color: config.color,
    type: filterKey,
    value: value.toString(),
  };
};

function useActiveFilters(
  payload: SearchGamesFormValues,
  catalogueData: CatalogueData | undefined,
  userLanguage: keyof SteamUserTagsResponse
): FilterChip[] {
  return useMemo(() => {
    if (!catalogueData) return [];

    const filters: FilterChip[] = [];

    Object.entries(FILTER_CONFIG).forEach(([key, config]) => {
      const filterKey = key as FilterKey;
      const values = payload[filterKey];

      if (!values?.length) return;

      values.forEach((value: string | number) => {
        filters.push(
          createFilterChip(
            value,
            config,
            filterKey,
            catalogueData,
            userLanguage
          )
        );
      });
    });

    return filters;
  }, [payload, catalogueData, userLanguage]);
}

function useFilterRemoval(
  getValues: UseFormGetValues<SearchGamesFormValues>,
  setValue: UseFormSetValue<SearchGamesFormValues>
) {
  const removeFilter = (filter: FilterChip) => {
    const currentValues = getValues();
    const currentArray = currentValues[filter.type];

    if (!currentArray) return;

    const newArray = currentArray.filter(
      (item) => item.toString() !== filter.value
    );

    setValue(filter.type, newArray as string[] | number[]);
  };

  const clearAllFilters = () => {
    Object.keys(FILTER_CONFIG).forEach((key) => {
      setValue(key as FilterKey, []);
    });
  };

  return { removeFilter, clearAllFilters };
}

function FilterAccordion({
  filterKey,
  config,
  data,
  control,
}: FilterAccordionProps) {
  const {
    filtersSearchTerms,
    setFilterSearchTerm,
    openedFilters,
    setOpenedFilter,
  } = useCatalogueStore();

  const length = config.isObject
    ? Object.keys(data || {}).length
    : data?.length || 0;

  return (
    <Accordion
      title={config.label}
      icon={<ColorDot color={config.color} />}
      open={openedFilters[filterKey] ?? true}
      hint={`${length} Available`}
      onOpenChange={(isOpen) => setOpenedFilter(filterKey, isOpen)}
    >
      <div className="catalogue__sidebar-filter">
        <Input
          placeholder={`Search ${config.label}`}
          iconLeft={<MagnifyingGlassIcon size={24} />}
          value={filtersSearchTerms[filterKey] || ""}
          onChange={(e) => setFilterSearchTerm(filterKey, e.target.value)}
        />

        <FilterSection
          name={filterKey}
          listData={data}
          control={control}
          searchTerm={filtersSearchTerms[filterKey] || ""}
        />
      </div>
    </Accordion>
  );
}

function ActiveFiltersChips({
  filters,
  onRemoveFilter,
  onClearAll,
}: ActiveFiltersChipsProps) {
  if (filters.length === 0) return null;

  return (
    <div className="catalogue__header-filters">
      {filters.map((filter) => (
        <motion.div
          key={`${filter.type}-${filter.value}`}
          layout="position"
          transition={{
            type: "spring",
            stiffness: 600,
            damping: 40,
          }}
        >
          <Chips
            label={filter.label}
            color={filter.color}
            onRemove={() => onRemoveFilter(filter)}
          />
        </motion.div>
      ))}

      <button className="catalogue__clear-button" onClick={onClearAll}>
        <Typography variant="label" className="catalogue__clear-text">
          Clear all
        </Typography>
      </button>
    </div>
  );
}

function Sidebar({
  catalogueData,
  control,
  register,
  userLanguage,
}: SidebarProps) {
  const getFilterData = useMemo(() => {
    if (!catalogueData) return () => null;

    return (key: FilterKey) => {
      switch (key) {
        case "downloadSourceFingerprints":
          return catalogueData.downloadSources;
        case "genres":
          return catalogueData.genres[userLanguage];
        case "tags":
          return catalogueData.userTags[userLanguage];
        case "developers":
          return catalogueData.developers;
        case "publishers":
          return catalogueData.publishers;
        default:
          return null;
      }
    };
  }, [catalogueData, userLanguage]);

  if (!catalogueData) return null;

  return (
    <div className="catalogue__sidebar">
      <Input placeholder="Search games..." {...register("title")} />

      {Object.entries(FILTER_CONFIG).map(([key, config]) => {
        const filterKey = key as FilterKey;
        const data = getFilterData(filterKey);

        if (!data) return null;

        return (
          <FilterAccordion
            key={filterKey}
            filterKey={filterKey}
            config={config}
            data={data}
            control={control}
          />
        );
      })}
    </div>
  );
}

function Header({
  title,
  activeFilters,
  onRemoveFilter,
  onClearAll,
}: HeaderProps) {
  const hasSearchCriteria = Boolean(title) || activeFilters.length > 0;

  return (
    <div className="catalogue__header">
      <Typography variant="h4" className="catalogue__title">
        {hasSearchCriteria ? (
          <>Showing search results for {title && <q>{title}</q>}</>
        ) : (
          "Most popular games"
        )}
      </Typography>

      <ActiveFiltersChips
        filters={activeFilters}
        onRemoveFilter={onRemoveFilter}
        onClearAll={onClearAll}
      />
    </div>
  );
}

function Grid({ search }: GridProps) {
  if (search.isLoading) {
    return <p>Loading results...</p>;
  }

  if (search.error) {
    return <p>Error loading games. Please try again.</p>;
  }

  return (
    <div className="catalogue__grid">
      {search.data?.edges.map((edge) => (
        <div key={edge.id} className="catalogue__grid-item">
          <CatalogueGameCard
            title={edge.title}
            image={edge.libraryImageUrl}
            genres={edge.genres}
            href={`/game/${edge.objectId}`}
            objectId={edge.objectId}
          />
        </div>
      ))}
    </div>
  );
}

export default function Catalogue() {
  const userLanguage = "en";
  const { form, catalogueData, search } = useCatalogueData();
  const { register, control, watch, getValues, setValue } = form;

  const payload = watch();
  const activeFilters = useActiveFilters(payload, catalogueData, userLanguage);
  const { removeFilter, clearAllFilters } = useFilterRemoval(
    getValues,
    setValue
  );

  return (
    <div className="catalogue">
      <div className="catalogue__content">
        <Catalogue.Header
          title={payload.title}
          activeFilters={activeFilters}
          onRemoveFilter={removeFilter}
          onClearAll={clearAllFilters}
        />
        <Catalogue.Grid search={search} />
      </div>
      <Catalogue.Sidebar
        catalogueData={catalogueData}
        control={control}
        register={register}
        userLanguage={userLanguage}
      />
    </div>
  );
}

Catalogue.Sidebar = Sidebar;
Catalogue.Header = Header;
Catalogue.Grid = Grid;
