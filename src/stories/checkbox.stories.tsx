import { Checkbox, CheckboxProps } from "@/components";

export default {
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export const base = (args: CheckboxProps) => <Checkbox {...args} />;

base.args = {
  label: "Adventure",
  block: false,
  onChange: () => console.log("onChange"),
};

export const block = (args: CheckboxProps) => <Checkbox {...args} />;

block.args = {
  label: "Adventure",
  block: true,
  checked: true,
};
