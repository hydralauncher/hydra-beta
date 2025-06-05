import List from "rc-virtual-list";
import { Typography, Checkbox } from "@/components";
import { SearchGamesFormValues, FilterType } from "@/hooks";

type FilterSectionDataProps =
  | string[]
  | Record<string, number>
  | Record<string, string>;

interface FilterSectionProps {
  listData: FilterSectionDataProps | undefined;
  name: FilterType;
  values: SearchGamesFormValues;
  updateSearchParams: (newValues: Partial<SearchGamesFormValues>) => void;
  searchTerm?: string;
}

export default function FilterSection({
  listData,
  name,
  values,
  updateSearchParams,
  searchTerm = "",
}: Readonly<FilterSectionProps>) {
  if (!listData) return null;

  const ITEM_HEIGHT = 32;
  const items = Array.isArray(listData) ? listData : Object.keys(listData);

  const filteredItems = searchTerm
    ? items.filter((item) =>
        item.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : items;

  const selected = (values[name] ?? []) as Array<string | number>;
  const height = ITEM_HEIGHT * Math.min(filteredItems.length, 10);

  const handleChange = (value: string | number, checked: boolean) => {
    updateSearchParams({
      [name]: checked
        ? [...selected, value]
        : selected.filter((v) => v !== value),
    });
  };

  if (filteredItems.length === 0) {
    return (
      <div className="filter-section__empty">
        <Typography variant="label" className="filter-section__empty__text">
          No results found
        </Typography>
      </div>
    );
  }

  return (
    <List
      data={filteredItems}
      height={height}
      itemHeight={ITEM_HEIGHT}
      itemKey={(item) => `${name}-${item}`}
    >
      {(item: string) => {
        const value = Array.isArray(listData) ? item : listData[item];
        return (
          <div className="filter-section__item">
            <Checkbox
              id={`${name}-${item}`}
              label={item}
              checked={selected.includes(value)}
              onChange={(checked) => handleChange(value, checked)}
              block
            />
          </div>
        );
      }}
    </List>
  );
}
