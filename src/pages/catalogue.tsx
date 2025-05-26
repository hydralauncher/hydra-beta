import { useMemo } from "react";
import { useCatalogueData } from "../hooks";
import { FilterSection, Accordion, Input } from "@/components";
import { useForm } from "react-hook-form";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useCatalogueStore } from "@/stores/catalogue.store";

enum Filters {
  Title = "title",
  Genres = "genres",
  UserTags = "tags",
  Developers = "developers",
  Publishers = "publishers",
}

enum Colors {
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

function CatalogueFilters() {
  const { catalogueData } = useCatalogueData();
  const {
    filtersSearchTerms,
    setFilterSearchTerm,
    openedFilters,
    setOpenedFilter,
  } = useCatalogueStore();
  const { control, watch } = useForm();
  const userLanguage = "en"; //  hardcoded enquanto nao temos um "useLocale()"

  console.log(watch());

  if (!catalogueData) return null;

  const getFilterSection = (name: Exclude<Filters, Filters.Title>) => {
    const dataMap = {
      [Filters.Genres]: catalogueData.genres[userLanguage],
      [Filters.UserTags]: catalogueData.userTags[userLanguage],
      [Filters.Developers]: catalogueData.developers,
      [Filters.Publishers]: catalogueData.publishers,
    } as const;

    const colorMap = {
      [Filters.Genres]: Colors.Genres,
      [Filters.UserTags]: Colors.UserTags,
      [Filters.Developers]: Colors.Developers,
      [Filters.Publishers]: Colors.Publishers,
    } as const;

    const data = dataMap[name];
    const color = colorMap[name];
    const length =
      name === Filters.UserTags
        ? Object.keys(data || {}).length
        : data?.length || 0;

    return { name, color, data, length };
  };

  const filterSections = (
    [
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
      {filterSections.map(({ name, color, data, length }) => (
        <Accordion
          key={name}
          title={name}
          icon={<ColorDot color={color} />}
          open={openedFilters[name] || false}
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

export default function Catalogue() {
  return (
    <div className="catalogue-container">
      <div className="catalogue-content">
        <h1>flex 1</h1>
      </div>
      <CatalogueFilters />
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
