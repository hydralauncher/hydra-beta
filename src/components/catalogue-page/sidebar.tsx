import { useState } from "react";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { Input } from "@/components";
import { Accordion } from "@/components/common/accordion";
import { ColorDot } from "@/components/common/chip";
import FilterSection from "./filters-list";
import { CatalogueData, SearchGamesFormValues, FilterType } from "@/hooks";

interface SidebarProps {
  catalogueData: CatalogueData;
  values: SearchGamesFormValues;
  updateSearchParams: (newValues: Partial<SearchGamesFormValues>) => void;
}

export default function Sidebar({
  catalogueData,
  values,
  updateSearchParams,
}: Readonly<SidebarProps>) {
  const [filtersSearchTerms, setFiltersSearchTerms] = useState<
    Record<FilterType, string>
  >({
    [FilterType.GENRES]: "",
    [FilterType.TAGS]: "",
    [FilterType.DEVELOPERS]: "",
    [FilterType.PUBLISHERS]: "",
  });

  const setFilterSearchTerm = (key: FilterType, term: string) => {
    setFiltersSearchTerms((prev) => ({ ...prev, [key]: term }));
  };

  if (!catalogueData) return null;

  const filterData: Record<FilterType, string[] | Record<string, number>> = {
    [FilterType.GENRES]: catalogueData[FilterType.GENRES].data,
    [FilterType.TAGS]: catalogueData[FilterType.TAGS].data,
    [FilterType.DEVELOPERS]: catalogueData[FilterType.DEVELOPERS].data,
    [FilterType.PUBLISHERS]: catalogueData[FilterType.PUBLISHERS].data,
  };

  return (
    <div className="catalogue__sidebar">
      {Object.values(FilterType).map((filterKey) => {
        const data = filterData[filterKey];
        const length = Array.isArray(data)
          ? data.length
          : Object.keys(data).length;

        return (
          <Accordion
            key={filterKey}
            open={true}
            hint={`${length} Available`}
            title={catalogueData[filterKey].label}
            icon={<ColorDot color={catalogueData[filterKey].color} />}
          >
            <div className="catalogue__sidebar__filter__content">
              <Input
                type="text"
                placeholder={`Search ${catalogueData[filterKey].label.toLowerCase()}`}
                iconLeft={<MagnifyingGlassIcon size={24} />}
                value={filtersSearchTerms[filterKey] ?? ""}
                onChange={(e) => setFilterSearchTerm(filterKey, e.target.value)}
                autoComplete="off"
              />

              <FilterSection
                name={filterKey}
                listData={data}
                values={values}
                updateSearchParams={updateSearchParams}
                searchTerm={filtersSearchTerms[filterKey] ?? ""}
              />
            </div>
          </Accordion>
        );
      })}
    </div>
  );
}
