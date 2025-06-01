import List from "rc-virtual-list";
import { useMemo } from "react";
import { Accordion, Input, ColorDot, Checkbox, Typography } from "@/components";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useCatalogueStore } from "@/stores/catalogue.store";
import type { FilterKey, FilterConfig } from "@/types";

type FilterData = string[] | Record<string, number> | Record<string, string>;

interface FiltersProps {
  filterKey: FilterKey;
  config: FilterConfig;
  data: FilterData;
}

const ITEM_HEIGHT = 32;
const MAX_VISIBLE_ITEMS = 10;

export default function Filters({
  filterKey,
  config,
  data,
}: Readonly<FiltersProps>) {
  const store = useCatalogueStore();
  const searchTerm = store.filtersSearchTerms[filterKey] ?? "";
  const isRecord = !Array.isArray(data);

  const storeMapping: Record<FilterKey, (string | number)[]> = {
    genres: store.genres,
    userTags: store.tags,
    developers: store.developers,
    publishers: store.publishers,
    downloadSourceFingerprints: store.downloadSourceFingerprints,
  };

  const { items, height } = useMemo(() => {
    if (!data) return { items: [], height: 0 };

    const itemList = isRecord ? Object.keys(data) : data;
    const filteredItems = searchTerm
      ? itemList.filter((item) =>
          item.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : itemList;

    return {
      items: filteredItems,
      height: ITEM_HEIGHT * Math.min(filteredItems.length, MAX_VISIBLE_ITEMS),
    };
  }, [data, isRecord, searchTerm]);

  const selected = storeMapping[filterKey];

  const handleChange = (value: string | number, checked: boolean) => {
    const next = checked
      ? [...selected, value]
      : selected.filter((v) => v !== value);

    const storeKey = filterKey === "userTags" ? "tags" : filterKey;
    store.setFilters({ [storeKey]: next });
  };

  if (!data || items.length === 0) {
    return (
      <Accordion
        title={config.label}
        icon={<ColorDot color={config.color} />}
        open={store.openedFilters[filterKey] ?? true}
        hint={`${config.isObject ? Object.keys(data || {}).length : data?.length || 0} Available`}
        onOpenChange={(isOpen: boolean) =>
          store.setOpenedFilter(filterKey, isOpen)
        }
      >
        <div className="catalogue__sidebar-filter">
          <Input
            placeholder={`Search ${config.label}`}
            iconLeft={<MagnifyingGlassIcon size={24} />}
            value={searchTerm}
            onChange={(e) =>
              store.setFilterSearchTerm(filterKey, e.target.value)
            }
          />
          <div className="filter-section__empty">
            <Typography variant="label">No results found</Typography>
          </div>
        </div>
      </Accordion>
    );
  }

  return (
    <Accordion
      title={config.label}
      icon={<ColorDot color={config.color} />}
      open={store.openedFilters[filterKey] ?? true}
      hint={`${config.isObject ? Object.keys(data || {}).length : data?.length || 0} Available`}
      onOpenChange={(isOpen: boolean) =>
        store.setOpenedFilter(filterKey, isOpen)
      }
    >
      <div className="catalogue__sidebar-filter">
        <Input
          placeholder={`Search ${config.label}`}
          iconLeft={<MagnifyingGlassIcon size={24} />}
          value={searchTerm}
          onChange={(e) => store.setFilterSearchTerm(filterKey, e.target.value)}
        />

        <List
          data={items}
          height={height}
          itemHeight={ITEM_HEIGHT}
          itemKey={(item) => item}
        >
          {(item: string) => {
            const value = isRecord ? data[item] : item;
            return (
              <div className="filter-section__item" key={item}>
                <Checkbox
                  id={`${filterKey}-${item}`}
                  label={item}
                  checked={selected.includes(value)}
                  onChange={(checked) => handleChange(value, checked)}
                  block
                />
              </div>
            );
          }}
        </List>
      </div>
    </Accordion>
  );
}
