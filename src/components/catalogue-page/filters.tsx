import List from "rc-virtual-list";
import { useMemo, useState, useCallback } from "react";
import { Accordion, Input, ColorDot, Checkbox, Typography } from "@/components";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useCatalogueStore } from "@/stores/catalogue.store";
import { useSearch } from "@/hooks/use-search.hook";
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
  const [isOpen, setIsOpen] = useState(true);
  const isRecord = !Array.isArray(data);

  const itemList = useMemo(() => {
    if (!data) return [];
    return isRecord ? Object.keys(data) : data;
  }, [data, isRecord]);

  const searchableItems = useMemo(
    () => itemList.map((item) => ({ value: item })),
    [itemList]
  );

  const { search, setSearch, filteredItems } = useSearch(searchableItems, [
    "value",
  ]);

  const storeMapping: Record<FilterKey, (string | number)[]> = {
    genres: store.genres,
    userTags: store.tags,
    developers: store.developers,
    publishers: store.publishers,
    downloadSourceFingerprints: store.downloadSourceFingerprints,
  };

  const { items, height } = useMemo(() => {
    const finalItems = filteredItems.map((item) => item.value);
    return {
      items: finalItems,
      height: ITEM_HEIGHT * Math.min(finalItems.length, MAX_VISIBLE_ITEMS),
    };
  }, [filteredItems]);

  const selected = storeMapping[filterKey];

  const handleChange = useCallback(
    (value: string | number, checked: boolean) => {
      const next = checked
        ? [...selected, value]
        : selected.filter((v) => v !== value);

      const storeKey = filterKey === "userTags" ? "tags" : filterKey;
      store.setFilters({ [storeKey]: next });
    },
    [selected, filterKey, store]
  );

  if (!data || items.length === 0) {
    return (
      <Accordion
        title={config.label}
        icon={<ColorDot color={config.color} />}
        open={isOpen}
        hint={`${config.isObject ? Object.keys(data || {}).length : data?.length || 0} Available`}
        onOpenChange={setIsOpen}
      >
        <div className="catalogue__sidebar-filter">
          <Input
            placeholder={`Search ${config.label}`}
            iconLeft={<MagnifyingGlassIcon size={24} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
      open={isOpen}
      hint={`${config.isObject ? Object.keys(data || {}).length : data?.length || 0} Available`}
      onOpenChange={setIsOpen}
    >
      <div className="catalogue__sidebar-filter">
        <Input
          placeholder={`Search ${config.label}`}
          iconLeft={<MagnifyingGlassIcon size={24} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
