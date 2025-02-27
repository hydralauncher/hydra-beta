import { Input, InputProps } from "@/components";
import { Row } from "@/components/storybook/row";
import { MagnifyingGlass } from "@phosphor-icons/react";
export default {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    type: { control: "text" },
    placeholder: { control: "text" },
    value: { control: "text" },
    label: { control: "text" },
    hint: { control: "text" },
    error: { control: "boolean" },
    iconLeft: { control: false },
    iconRight: { control: false },
  },
};

export const base = (args: InputProps) => <Input {...args} />;

base.args = {
  type: "text",
  placeholder: "Search friends",
  value: "",
};

export const Types = (args: InputProps) => (
  <Row>
    <Input
      type="email"
      label="Email"
      value="Value"
      hint="example@email.com"
      placeholder="Enter your email"
    />

    <Input
      type="text"
      value="Value"
      placeholder="Search friends"
      iconLeft={<MagnifyingGlass size={20} />}
    />

    <Input
      type="text"
      value="Value"
      placeholder="Search friends"
      iconRight={<MagnifyingGlass size={20} />}
    />
  </Row>
);

export const States = (args: InputProps) => (
  <Row align="start">
    <Input error placeholder="Error" hint="your email is invalid" />
    <Input disabled placeholder="Disabled" />
  </Row>
);
