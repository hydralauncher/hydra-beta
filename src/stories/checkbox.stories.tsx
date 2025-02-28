import { Checkbox, CheckboxProps } from "@/components";
import { Row } from "@/components/storybook/row";

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
  id: "base-checkbox",
  label: "Adventure",
  checked: false,
  block: false,
  disabled: false,
  onChange: () => console.log("onChange"),
};

export const block = (args: CheckboxProps) => <Checkbox {...args} />;

block.args = {
  label: "Adventure",
  block: true,
  checked: true,
};

export const State = (args: CheckboxProps) => (
  <Row>
    <Checkbox label="Disabled" disabled checked {...args} />
    <Checkbox label="Disabled" disabled checked block {...args} />
  </Row>
);
