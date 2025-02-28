import { SourceAnchor, SourceAnchorProps } from "@/components";

export default {
  title: "Components/Button/Source Anchor",
  component: SourceAnchor,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    title: { control: "text" },
    url: { control: "text" },
  },
};

export const base = (args: SourceAnchorProps) => <SourceAnchor {...args} />;

base.args = {
  title: "Source",
  href: "/",
};
