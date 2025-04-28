import List from "rc-virtual-list";
import "./catalogue.scss";
import { useState, useRef, useEffect, useCallback } from "react";
import { FilterToggle, SearchBuilder } from "./search-builder";
import debounce from "lodash/debounce";
import {
  useCatalogueData,
  useSearchGames,
  type SearchGamesProps,
} from "../hooks";
import type {
  Developer,
  Genre,
  Publisher,
  UserTag,
} from "../hooks/use-catalogue-data";

type FilterSectionDataProps =
  | Genre
  | UserTag
  | Developer
  | Publisher
  | undefined;

enum Filters {
  Title = "title",
  Genres = "genres",
  UserTags = "userTags",
  Developers = "developers",
  Publishers = "publishers",
}

export function Catalogue() {
  const [searchParams, setSearchParams] = useState<SearchGamesProps>({
    take: 32,
    skip: 0,
    title: "",
    tags: [],
    genres: [],
    publishers: [],
    developers: [],
  });

  const { data } = useCatalogueData();
  const { searchData } = useSearchGames(searchParams);

  const searchBuilderRef = useRef(
    new SearchBuilder({
      take: 32,
      skip: 0,
    })
  );

  const [searchPayload, setSearchPayload] = useState(
    searchBuilderRef.current.payload
  );

  const handlePayloadInputs = (
    event: React.ChangeEvent<HTMLInputElement>,
    filter: Filters
  ) => {
    const { value, checked } = event.target;

    switch (filter) {
      case Filters.Title:
        searchBuilderRef.current.setTitle(value);
        break;
      case Filters.Genres:
        new FilterToggle(
          value,
          checked,
          (val) => searchBuilderRef.current.setGenres(val),
          (val) => searchBuilderRef.current.removeGenre(val)
        ).toggle();
        break;
      case Filters.UserTags:
        new FilterToggle(
          Number(value),
          checked,
          (val) => searchBuilderRef.current.setUserTags(val),
          (val) => searchBuilderRef.current.removeUserTag(val)
        ).toggle();
        break;
      case Filters.Developers:
        new FilterToggle(
          value,
          checked,
          (val) => searchBuilderRef.current.setDevelopers(val),
          (val) => searchBuilderRef.current.removeDeveloper(val)
        ).toggle();
        break;
      case Filters.Publishers:
        new FilterToggle(
          value,
          checked,
          (val) => searchBuilderRef.current.setPublishers(val),
          (val) => searchBuilderRef.current.removePublisher(val)
        ).toggle();
        break;
    }
    setSearchPayload({ ...searchBuilderRef.current.payload });
  };

  const updateSearchParams = useCallback(() => {
    const filters = searchPayload.filters;
    const pagination = searchPayload.pagination;

    setSearchParams({
      take: pagination.take,
      skip: pagination.skip,
      title: filters.title,
      tags: filters.tags,
      genres: filters.genres,
      publishers: filters.publishers,
      developers: filters.developers,
    });
  }, [searchPayload]);

  const debouncedUpdateSearchParams = useCallback(
    debounce(updateSearchParams, 400),
    [updateSearchParams]
  );

  useEffect(() => {
    debouncedUpdateSearchParams();

    return () => {
      debouncedUpdateSearchParams.cancel();
    };
  }, [searchPayload, debouncedUpdateSearchParams]);

  return (
    <div className="catalogue-container">
      <div className="catalogue-search">
        <input
          className="catalogue-search__input"
          type="text"
          placeholder="Search"
          onChange={(e) => handlePayloadInputs(e, Filters.Title)}
        />

        <div className="search-content">
          <div className="search-content__payload">
            <h3>Payload:</h3>
            <pre>{JSON.stringify(searchPayload, null, 2)}</pre>
          </div>

          <div className="search-content__results">
            <h3>Results Title:</h3>
            {searchData.isLoading ? (
              <p>loading results...</p>
            ) : (
              <pre>
                {JSON.stringify(
                  searchData.data?.edges.map((edge) => edge.title) || [],
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
            listData={data?.genres.en}
            onChange={handlePayloadInputs}
            filterType={Filters.Genres}
          />
        </div>

        <div className="catalogue-filters__section">
          <FilterSection
            listData={data?.userTags.en}
            onChange={handlePayloadInputs}
            filterType={Filters.UserTags}
          />
        </div>

        <div className="catalogue-filters__section">
          <FilterSection
            listData={data?.publishers}
            onChange={handlePayloadInputs}
            filterType={Filters.Publishers}
          />
        </div>

        <div className="catalogue-filters__section">
          <FilterSection
            listData={data?.developers}
            onChange={handlePayloadInputs}
            filterType={Filters.Developers}
          />
        </div>
      </div>
    </div>
  );
}

function FilterSection({
  listData,
  onChange,
  filterType,
}: {
  listData: FilterSectionDataProps;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, filter: Filters) => void;
  filterType: Filters;
}) {
  if (!listData) {
    return null;
  }

  const isArray = Array.isArray(listData);
  const isRecord = !isArray && typeof listData === "object";

  const calculateHeight = (items: readonly unknown[]) =>
    28 * (items.length > 10 ? 10 : items.length);

  return (
    <div className="filter-section">
      {isArray && (
        <List
          data={listData}
          height={calculateHeight(listData)}
          itemHeight={28}
          itemKey={(item) => item}
        >
          {(item) => (
            <div className="filter-section-item">
              <input
                id={`${filterType}-${item}`}
                type="checkbox"
                value={item}
                onChange={(e) => onChange(e, filterType)}
              />
              <label
                className="filter-section-item__label"
                htmlFor={`${filterType}-${item}`}
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
          {(item) => (
            <div className="filter-section-item">
              <input
                id={`${filterType}-${item}`}
                type="checkbox"
                value={listData[item]}
                onChange={(e) => onChange(e, filterType)}
              />
              <label
                className="filter-section-item__label"
                htmlFor={`${filterType}-${item}`}
              >
                {item}
              </label>
            </div>
          )}
        </List>
      )}
    </div>
  );
}
