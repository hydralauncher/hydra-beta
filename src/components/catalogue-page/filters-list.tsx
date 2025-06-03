import List from "rc-virtual-list";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { Checkbox, Typography } from "@/components";

type FilterSectionDataProps =
  | string[]
  | Record<string, number>
  | Record<string, string>;

const ITEM_HEIGHT = 32;
const MAX_VISIBLE_ITEMS = 10;

export default function FilterSection<T extends FieldValues>({
  listData,
  name,
  control,
  searchTerm = "",
}: Readonly<{
  listData: FilterSectionDataProps | undefined;
  name: Path<T>;
  control: Control<T>;
  searchTerm?: string;
}>) {
  if (!listData) return null;

  const isRecord = !Array.isArray(listData);
  const itemList = isRecord ? Object.keys(listData) : listData;
  const items = searchTerm
    ? itemList.filter((item) =>
        item.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : itemList;

  const height = ITEM_HEIGHT * Math.min(items.length, MAX_VISIBLE_ITEMS);

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

        if (items.length === 0) {
          return (
            <div className="filter-section__empty">
              <Typography
                variant="label"
                className="filter-section__empty__text"
              >
                No results found
              </Typography>
            </div>
          );
        }

        return (
          <List
            data={items}
            height={height}
            itemHeight={ITEM_HEIGHT}
            itemKey={(item) => item}
          >
            {(item: string) => {
              const value = isRecord ? listData[item] : item;
              return (
                <div className="filter-section__item" key={item}>
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
      }}
    />
  );
}
