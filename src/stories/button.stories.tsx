import { Button, type ButtonProps } from "@/components/common";
import { PlusCircle } from "@phosphor-icons/react";

export default {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    children: { control: "text" },
    icon: { control: "object" },
    disabled: { control: "boolean" },
    variant: { control: "select" },
    size: { control: "select" },
    loading: { control: "boolean" },
    iconPosition: { control: "select", options: ["left", "right"] },
    target: {
      control: "select",
      options: ["_blank", "_self", "_parent", "_top"],
    },
    onClick: { action: "clicked" },
  },
};

export const base = (args: ButtonProps) => <Button {...args} />;

base.args = {
  onClick: () => alert("hello!"),
  children: "Add to Library",
};

export const Types = (args: ButtonProps) => (
  <div>
    <Button size="icon" {...args}>
      <PlusCircle size={24} />
    </Button>

    <Button {...args}>Add to Library</Button>

    <Button icon={<PlusCircle size={24} />} {...args}>
      Add to Library
    </Button>
  </div>
);

export const Sizes = (args: ButtonProps) => (
  <div>
    <Button icon={<PlusCircle size={24} />} size="small" {...args}>
      Small Button
    </Button>
    <Button icon={<PlusCircle size={24} />} size="medium" {...args}>
      Medium Button
    </Button>
    <Button icon={<PlusCircle size={24} />} size="large" {...args}>
      Large Button
    </Button>
  </div>
);

export const Variants = (args: ButtonProps) => (
  <div>
    <Button icon={<PlusCircle size={24} />} variant="primary" {...args}>
      Primary Button
    </Button>
    <Button icon={<PlusCircle size={24} />} variant="secondary" {...args}>
      Secondary Button
    </Button>
    <Button icon={<PlusCircle size={24} />} variant="danger" {...args}>
      Danger Button
    </Button>
  </div>
);

export const States = (args: ButtonProps) => (
  <div>
    <Button size="icon" icon={<PlusCircle size={24} />} loading {...args}>
      <PlusCircle size={24} />
    </Button>
    <Button loading {...args}>
      Add to Library
    </Button>
    <Button disabled {...args}>
      Add to Library
    </Button>
  </div>
);

export const Link = (args: ButtonProps) => (
  <div>
    <Button href="https://github.com/hydralauncher/hydra" {...args}>
      Source Code
    </Button>
    <Button
      href="https://github.com/hydralauncher/hydra"
      variant="link"
      {...args}
    >
      Source Code
    </Button>
  </div>
);
