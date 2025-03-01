import { RouteAnchor, type RouteAnchorProps } from "@/components/route-anchor/route-anchor";
import { House } from "@phosphor-icons/react";
export default {
  title: "Sidebar/RouteAnchor",
  component: RouteAnchor,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    href: { control: "text" },
    label: { control: "text" },
    icon: { control: "ReactNode" },
  },
};


export const Base = (args: RouteAnchorProps) => (
  <div style={{ width: "200px" }}>
    <RouteAnchor {...args} />
  </div>
);

Base.args = {
  href: "/",
  label: "Home",
  icon: <House size={24} />,
};

export const Collapsible = (args: RouteAnchorProps) => (
  <div style={{ width: "200px", display: "flex", flexDirection: "column", gap: "16px" }}>
    <RouteAnchor href="/" label="Home" icon={<House size={24} />} />
    <RouteAnchor href="/" label="Home" icon={<House size={24} />} collapsed />
  </div>
);

export const States = () => (
  <div style={{ width: "200px", display: "flex", flexDirection: "column", gap: "16px" }}>
    <RouteAnchor href="/" label="Home" icon={<House size={24} />} />
    <RouteAnchor href="/" label="Home" icon={<House size={24} />} active />
    <RouteAnchor href="/" label="Home" icon={<House size={24} />} disabled active />
  </div>
);

export const GameIcon = (args: RouteAnchorProps) => (
  <div style={{ width: "200px", display: "flex", flexDirection: "column", gap: "16px" }}>
    <RouteAnchor href="/" label="Cyberpunk 2077" icon="https://cdn2.steamgriddb.com/icon/3b5e2c9be5002e87e0477099db5ff21b/32/256x256.png" />

    <RouteAnchor href="/" label="Cyberpunk 2077" icon="https://cdn2.steamgriddb.com/icon/3b5e2c9be5002e87e0477099db5ff21b/32/256x256.png" collapsed />
  </div>
);




