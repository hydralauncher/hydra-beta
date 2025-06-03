import { Control, FieldValues } from "react-hook-form";
import { useState } from "react";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { Input } from "@/components";
import { Accordion } from "@/components/common/accordion";
import { ColorDot } from "@/components/common/chip";
import FilterSection from "./filters-list";
import { FilterConfig, type FilterKey } from "./filters.config";
import { CatalogueData } from "@/hooks/use-catalogue.hook";

const useLocale = () => "en" as const;

interface SidebarProps {
  catalogueData: CatalogueData;
  control: Control<FieldValues>;
  filterConfig: Record<FilterKey, FilterConfig>;
}

export default function Sidebar({
  catalogueData,
  control,
  filterConfig,
}: SidebarProps) {
  const locale = useLocale();
  const initialOpenState = Object.fromEntries(
    Object.keys(filterConfig).map((key) => [key, true])
  ) as Record<FilterKey, boolean>;

  const initialSearchState = Object.fromEntries(
    Object.keys(filterConfig).map((key) => [key, ""])
  ) as Record<FilterKey, string>;

  const [openedFilters, setOpenedFilters] = useState(initialOpenState);
  const [filtersSearchTerms, setFiltersSearchTerms] =
    useState(initialSearchState);

  if (!catalogueData) return null;

  const filterData: Record<FilterKey, string[] | Record<string, number>> = {
    genres: catalogueData.genres[locale],
    tags: catalogueData.tags[locale],
    developers: catalogueData.developers,
    publishers: catalogueData.publishers,
  };

  const setOpenedFilter = (key: FilterKey, isOpen: boolean) => {
    setOpenedFilters((prev) => ({ ...prev, [key]: isOpen }));
  };

  const setFilterSearchTerm = (key: FilterKey, term: string) => {
    setFiltersSearchTerms((prev) => ({ ...prev, [key]: term }));
  };

  return (
    <div className="catalogue__sidebar">
      {(Object.keys(filterConfig) as FilterKey[]).map((filterKey) => {
        const config = filterConfig[filterKey];
        const data = filterData[filterKey];
        const length = Array.isArray(data)
          ? data.length
          : Object.keys(data).length;

        return (
          <Accordion
            key={filterKey}
            title={config.label}
            icon={<ColorDot color={config.color} />}
            open={openedFilters[filterKey] ?? true}
            hint={`${length} Available`}
            onOpenChange={(isOpen) => setOpenedFilter(filterKey, isOpen)}
          >
            <div className="catalogue__sidebar__filter__content">
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
      })}
    </div>
  );
}
