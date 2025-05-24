import List from "rc-virtual-list";
import { useMemo } from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { useCatalogueData } from "../hooks";

enum Filters {
  Title = "title",
  Genres = "genres",
  UserTags = "tags",
  Developers = "developers",
  Publishers = "publishers",
}

type FilterSectionDataProps = string[] | Record<string, number>;

export default function Catalogue() {
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

function FilterSection<T extends FieldValues>({
  listData,
  name,
  control,
}: {
  listData: FilterSectionDataProps | undefined;
  name: Path<T>;
  control: Control<T>;
}) {
  if (!listData) return null;

  const isArray = Array.isArray(listData);
  const isRecord = !isArray && typeof listData === "object";

  const calculateHeight = (items: readonly unknown[]) =>
    28 * (items.length > 10 ? 10 : items.length);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const selected: (string | number)[] = field.value ?? [];

        const handleChange = (value: string | number, checked: boolean) => {
          const next = checked
            ? [...selected, value]
            : selected.filter((v) => v !== value);
          field.onChange(next);
        };

        return (
          <div className="filter-section">
            {isArray && (
              <List
                data={listData}
                height={calculateHeight(listData)}
                itemHeight={28}
                itemKey={(item) => item}
              >
                {(item: string) => (
                  <div className="filter-section-item" key={item}>
                    <input
                      id={`${name}-${item}`}
                      type="checkbox"
                      value={item}
                      checked={selected.includes(item)}
                      onChange={(e) => handleChange(item, e.target.checked)}
                    />
                    <label
                      className="filter-section-item__label"
                      htmlFor={`${name}-${item}`}
                    >
                      {item}
                    </label>
                  </div>
                )}
              </List>
            )}

            {isRecord && (
              <List
                data={Object.keys(listData)}
                height={calculateHeight(Object.keys(listData))}
                itemHeight={28}
                itemKey={(item) => item}
              >
                {(item: string) => {
                  const value = (listData as Record<string, number>)[item];
                  return (
                    <div className="filter-section-item" key={item}>
                      <input
                        id={`${name}-${item}`}
                        type="checkbox"
                        value={value}
                        checked={selected.includes(value)}
                        onChange={(e) => handleChange(value, e.target.checked)}
                      />
                      <label
                        className="filter-section-item__label"
                        htmlFor={`${name}-${item}`}
                      >
                        {item}
                      </label>
                    </div>
                  );
                }}
              </List>
            )}
          </div>
        );
      }}
    />
  );
}
