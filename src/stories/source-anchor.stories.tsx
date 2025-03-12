import { SourceAnchor, type SourceAnchorProps } from "@/components/common";

export default {
  title: "Components/Button/Source Anchor",
  component: SourceAnchor,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    title: { control: "text" },
    href: { control: "text" },
  },
};

export const base = (args: SourceAnchorProps) => <SourceAnchor {...args} />;

base.args = {
  title: "DavidKazumi",
  href: "/",
};
