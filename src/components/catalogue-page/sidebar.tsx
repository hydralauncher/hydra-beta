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

type FilterData = string[] | Record<string, number> | Record<string, string>;

export default function Sidebar({
  catalogueData,
  values,
  updateSearchParams,
}: Readonly<SidebarProps>) {
  const [filtersSearchTerms, setFiltersSearchTerms] = useState<
    Record<FilterType, string>
  >({
    [FilterType.Genres]: "",
    [FilterType.Tags]: "",
    [FilterType.Developers]: "",
    [FilterType.Publishers]: "",
    [FilterType.DownloadSourceFingerprints]: "",
  });

  const setFilterSearchTerm = (key: FilterType, term: string) => {
    setFiltersSearchTerms((prev) => ({ ...prev, [key]: term }));
  };

  if (!catalogueData) return null;

  const filterData: Record<FilterType, FilterData> = {
    [FilterType.Genres]: catalogueData[FilterType.Genres].data,
    [FilterType.Tags]: catalogueData[FilterType.Tags].data,
    [FilterType.Developers]: catalogueData[FilterType.Developers].data,
    [FilterType.Publishers]: catalogueData[FilterType.Publishers].data,
    [FilterType.DownloadSourceFingerprints]:
      catalogueData[FilterType.DownloadSourceFingerprints].data,
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
