import { UserProfile, UserProfileProps } from "@/components";

export default {
  title: "Sidebar/User Profile",
  component: UserProfile,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    href: { control: "text" },
    image: { control: "text" },
    name: { control: "text" },
    status: { control: "object" },
    collapsed: { control: "boolean" },
  },
};

export const Base = (args: UserProfileProps) => <UserProfile {...args} />;

Base.args = {
  image: "https://cdn2.steamgriddb.com/icon_thumb/2b2dd5d758c3dee04d98d6fc0833e712.png",
  name: "zezinhomonstro",
  href: "/",
};

export const Status = (args: UserProfileProps) => <UserProfile {...args} />;

Status.args = {
  image: "https://cdn2.steamgriddb.com/icon_thumb/2b2dd5d758c3dee04d98d6fc0833e712.png",
  name: "zezinhomonstro",
  status: { icon: "https://cdn2.steamgriddb.com/icon/602d1305678a8d5fdb372271e980da6a/32/256x256.png", label: "Hollow Knight" },
  href: "/",
};

export const Collapsed = (args: UserProfileProps) => <UserProfile {...args} />;

Collapsed.args = {
  image: "https://cdn2.steamgriddb.com/icon_thumb/2b2dd5d758c3dee04d98d6fc0833e712.png",
  name: "zezinhomonstro",
  status: { icon: "https://cdn2.steamgriddb.com/icon/602d1305678a8d5fdb372271e980da6a/32/256x256.png", label: "Hollow Knight" },
  href: "/",
  collapsed: true,
};

export const ImageFallback = (args: UserProfileProps) => <UserProfile {...args} />;

ImageFallback.args = {
  name: "zezinhomonstro",
  status: { icon: "https://cdn2.steamgriddb.com/icon/602d1305678a8d5fdb372271e980da6a/32/256x256.png", label: "Hollow Knight" },
  href: "/",
};
