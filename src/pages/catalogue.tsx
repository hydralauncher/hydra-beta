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
  CatalogueGameCard,
} from "@/components";
import {
  CatalogueData,
  SearchGamesFormValues,
  useCatalogueData,
  SteamUserTagsResponse,
  SearchGamesQuery,
} from "../hooks";

interface CatalogueContentProps {
  payload: SearchGamesFormValues;
  catalogueData: CatalogueData | undefined;
  userLanguage: keyof SteamUserTagsResponse;
  getValues: UseFormGetValues<SearchGamesFormValues>;
  setValue: UseFormSetValue<SearchGamesFormValues>;
  search: SearchGamesQuery;
}

interface CatalogueFiltersProps {
  catalogueData: CatalogueData | undefined;
  control: Control<SearchGamesFormValues>;
  register: UseFormRegister<SearchGamesFormValues>;
  userLanguage: keyof SteamUserTagsResponse;
}

enum Filters {
  Title = "title",
  DownloadSources = "downloadSourceFingerprints",
  Genres = "genres",
  UserTags = "tags",
  Developers = "developers",
  Publishers = "publishers",
}

// Adiciona mapeamento para nomes bonitos
const FilterDisplayNames = {
  [Filters.DownloadSources]: "Sources",
  [Filters.Genres]: "Genres",
  [Filters.UserTags]: "User Tags",
  [Filters.Developers]: "Developers",
  [Filters.Publishers]: "Publishers",
} as const;

enum Colors {
  DownloadSources = "red",
  Genres = "magenta",
  UserTags = "orange",
  Developers = "cyan",
  Publishers = "limegreen",
}

function ColorDot({ color }: Readonly<{ color: string }>) {
  return (
    <div
      className="color-dot"
      style={{
        backgroundColor: color,
        width: "11px",
        height: "11px",
        borderRadius: "50%",
      }}
    />
  );
}

function CatalogueFilters({
  catalogueData,
  control,
  register,
  userLanguage,
}: Readonly<CatalogueFiltersProps>) {
  const {
    filtersSearchTerms,
    setFilterSearchTerm,
    openedFilters,
    setOpenedFilter,
  } = useCatalogueStore();

  if (!catalogueData) return null;

  const getFilterSection = (name: Exclude<Filters, Filters.Title>) => {
    const dataMap = {
      [Filters.DownloadSources]: catalogueData.downloadSources,
      [Filters.Genres]: catalogueData.genres[userLanguage],
      [Filters.UserTags]: catalogueData.userTags[userLanguage],
      [Filters.Developers]: catalogueData.developers,
      [Filters.Publishers]: catalogueData.publishers,
    } as const;

    const colorMap = {
      [Filters.DownloadSources]: Colors.DownloadSources,
      [Filters.Genres]: Colors.Genres,
      [Filters.UserTags]: Colors.UserTags,
      [Filters.Developers]: Colors.Developers,
      [Filters.Publishers]: Colors.Publishers,
    } as const;

    const data = dataMap[name];
    const color = colorMap[name];
    const length =
      name === Filters.UserTags || name === Filters.DownloadSources
        ? Object.keys(data || {}).length
        : data?.length || 0;

    return { name, color, data, length };
  };

  const filterSections = (
    [
      Filters.DownloadSources,
      Filters.Genres,
      Filters.UserTags,
      Filters.Developers,
      Filters.Publishers,
    ] as const
  )
    .map(getFilterSection)
    .filter(({ data }) => data);

  return (
    <div className="catalogue-filters">
      <Input placeholder="debug" {...register(Filters.Title)} />

      {filterSections.map(({ name, color, data, length }) => (
        <Accordion
          key={name}
          title={FilterDisplayNames[name]}
          icon={<ColorDot color={color} />}
          open={openedFilters[name] ?? true}
          hint={`${length} Available`}
          onOpenChange={(isOpen) => {
            setOpenedFilter(name, isOpen);
          }}
        >
          <div className="catalogue-filters__container">
            <Input
              placeholder={`Search ${name}`}
              iconLeft={<MagnifyingGlassIcon size={24} />}
              value={filtersSearchTerms[name] || ""}
              onChange={(e) => setFilterSearchTerm(name, e.target.value)}
            />

            <FilterSection
              name={name}
              listData={data}
              control={control}
              searchTerm={filtersSearchTerms[name] || ""}
            />
          </div>
        </Accordion>
      ))}
    </div>
  );
}

function CatalogueContent({
  payload,
  catalogueData,
  userLanguage,
  getValues,
  setValue,
  search,
}: Readonly<CatalogueContentProps>) {
  console.log("search", search);

  const activeFilters = useMemo(() => {
    if (!catalogueData) return [];

    const filters: Array<{
      label: string;
      color: string;
      type: string;
      value: string;
    }> = [];

    payload.genres?.forEach((genre) => {
      filters.push({
        label: genre,
        color: Colors.Genres,
        type: "genres",
        value: genre,
      });
    });

    payload.tags?.forEach((tagId) => {
      const tagName = Object.keys(catalogueData.userTags[userLanguage]).find(
        (key) => catalogueData.userTags[userLanguage][key] === tagId
      );
      filters.push({
        label: tagName ?? `Tag ${tagId}`,
        color: Colors.UserTags,
        type: "tags",
        value: tagId.toString(),
      });
    });

    payload.publishers?.forEach((publisher) => {
      filters.push({
        label: publisher,
        color: Colors.Publishers,
        type: "publishers",
        value: publisher,
      });
    });

    payload.developers?.forEach((developer) => {
      filters.push({
        label: developer,
        color: Colors.Developers,
        type: "developers",
        value: developer,
      });
    });

    payload.downloadSourceFingerprints?.forEach((fingerprint) => {
      const sourceName = Object.keys(catalogueData.downloadSources).find(
        (key) => catalogueData.downloadSources[key] === fingerprint
      );
      filters.push({
        label: sourceName ?? `Source ${fingerprint}`,
        color: Colors.DownloadSources,
        type: "downloadSourceFingerprints",
        value: fingerprint,
      });
    });

    return filters;
  }, [payload, catalogueData, userLanguage]);

  const handleRemoveFilter = (filter: { type: string; value: string }) => {
    const currentValues = getValues();

    if (filter.type === "genres" && currentValues.genres) {
      setValue(
        "genres",
        currentValues.genres.filter((item) => item !== filter.value)
      );
    } else if (filter.type === "tags" && currentValues.tags) {
      setValue(
        "tags",
        currentValues.tags.filter((item) => item.toString() !== filter.value)
      );
    } else if (filter.type === "publishers" && currentValues.publishers) {
      setValue(
        "publishers",
        currentValues.publishers.filter((item) => item !== filter.value)
      );
    } else if (filter.type === "developers" && currentValues.developers) {
      setValue(
        "developers",
        currentValues.developers.filter((item) => item !== filter.value)
      );
    } else if (
      filter.type === "downloadSourceFingerprints" &&
      currentValues.downloadSourceFingerprints
    ) {
      setValue(
        "downloadSourceFingerprints",
        currentValues.downloadSourceFingerprints.filter(
          (item) => item !== filter.value
        )
      );
    }
  };

  return (
    <div className="catalogue-content">
      <div className="catalogue-content__header">
        {payload.title || activeFilters.length > 0 ? (
          <Typography variant="h4" className="catalogue-content__header__title">
            Showing search results for {payload.title && <q>{payload.title}</q>}
          </Typography>
        ) : (
          <Typography variant="h4" className="catalogue-content__header__title">
            Most popular games
          </Typography>
        )}

        {activeFilters.length > 0 && (
          <div className="catalogue-content__header__active-filters">
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
                <Chips
                  label={filter.label}
                  color={filter.color}
                  onRemove={() => handleRemoveFilter(filter)}
                />
              </motion.div>
            ))}

            <button
              className="catalogue-content__header__clear-filters"
              onClick={() => {
                setValue("genres", []);
                setValue("tags", []);
                setValue("publishers", []);
                setValue("developers", []);
                setValue("downloadSourceFingerprints", []);
              }}
            >
              <Typography
                variant="label"
                className="catalogue-content__header__clear-filters__text"
              >
                Clear all
              </Typography>
            </button>
          </div>
        )}
      </div>

      <div className="catalogue-content__body">
        {search.isLoading ? (
          // TODO: adicionar o skeleton loader aqui
          <p>loading results...</p>
        ) : (
          search.data?.edges.map((edge) => (
            <div key={edge.id} className="catalogue-content__body__item">
              <CatalogueGameCard
                title={edge.title}
                image={edge.libraryImageUrl}
                genres={edge.genres}
                href={`/game/${edge.objectId}`}
                objectId={edge.objectId}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function Catalogue() {
  const userLanguage = "en"; //  hardcoded enquanto nao temos um "useLocale()"
  const { form, catalogueData, search } = useCatalogueData();
  const { register, control, watch, getValues, setValue } = form;

  console.log("payload", watch());

  return (
    <div className="catalogue-container">
      <CatalogueContent
        payload={watch()}
        search={search}
        catalogueData={catalogueData}
        userLanguage={userLanguage}
        getValues={getValues}
        setValue={setValue}
      />
      <CatalogueFilters
        catalogueData={catalogueData}
        control={control}
        register={register}
        userLanguage={userLanguage}
      />
    </div>
  );
}

export function CatalogueOld() {
  const { form, catalogueData, search } = useCatalogueData();
  const { register, control, watch } = form;

  const payload = useMemo(() => watch(), [watch]);

  return (
    <div className="catalogue-container">
      <div className="catalogue-search">
        <input
          className="catalogue-search__input"
          type="text"
          placeholder="Search"
          {...register(Filters.Title)}
        />

        <div className="search-content">
          <div className="search-content__payload">
            <h3>Payload:</h3>
            <pre>{JSON.stringify(payload, null, 2)}</pre>
          </div>

          <div className="search-content__results">
            <h3>Results Title:</h3>
            {search.isLoading ? (
              <p>loading results...</p>
            ) : (
              <pre>
                {JSON.stringify(
                  search.data?.edges.map((edge) => edge.title) || [],
                  null,
                  2
                )}
              </pre>
            )}
          </div>
        </div>
      </div>

      <div className="catalogue-filters">
        <div className="catalogue-filters__section">
          <FilterSection
            name={Filters.Genres}
            listData={catalogueData?.genres.en}
            control={control}
          />
        </div>

        <div className="catalogue-filters__section">
          <FilterSection
            name={Filters.UserTags}
            listData={catalogueData?.userTags.en}
            control={control}
          />
        </div>

        <div className="catalogue-filters__section">
          <FilterSection
            name={Filters.Publishers}
            listData={catalogueData?.publishers}
            control={control}
          />
        </div>

        <div className="catalogue-filters__section">
          <FilterSection
            name={Filters.Developers}
            listData={catalogueData?.developers}
            control={control}
          />
        </div>
      </div>
    </div>
  );
}
