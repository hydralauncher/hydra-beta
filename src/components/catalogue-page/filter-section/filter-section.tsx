import List from "rc-virtual-list";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { useMemo } from "react";
import { Checkbox } from "@/components";

type FilterSectionDataProps = string[] | Record<string, number>;

const ITEM_HEIGHT = 28;
const MAX_VISIBLE_ITEMS = 10;

export function FilterSection<T extends FieldValues>({
  listData,
  name,
  control,
}: Readonly<{
  listData: FilterSectionDataProps | undefined;
  name: Path<T>;
  control: Control<T>;
}>) {
  const isRecord = !Array.isArray(listData);

  const { items, height } = useMemo(() => {
    if (!listData) return { items: [], height: 0 };

    const itemList = isRecord ? Object.keys(listData) : listData;
    const itemCount = Math.min(itemList.length, MAX_VISIBLE_ITEMS);
    return {
      items: itemList,
      height: ITEM_HEIGHT * itemCount,
    };
  }, [listData, isRecord]);

  if (!listData) return null;

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
