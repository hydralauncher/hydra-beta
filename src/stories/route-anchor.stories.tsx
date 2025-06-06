import {
  RouteAnchor,
  type RouteAnchorProps,
} from "@/components/common/route-anchor/route-anchor";
import { House } from "@phosphor-icons/react";
export default {
  title: "Sidebar/Route Anchor",
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

export const Collapsible = () => (
  <div
    style={{
      width: "200px",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    }}
  >
    <RouteAnchor href="/" label="Home" icon={<House size={24} />} />
  </div>
);

export const States = () => (
  <div
    style={{
      width: "200px",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    }}
  >
    <RouteAnchor href="/" label="Home" icon={<House size={24} />} />
    <RouteAnchor href="/" label="Home" icon={<House size={24} />} active />
    <RouteAnchor
      href="/"
      label="Home"
      icon={<House size={24} />}
      disabled
      active
    />
  </div>
);

export const GameIcon = () => (
  <div
    style={{
      width: "200px",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    }}
  >
    <RouteAnchor
      href="/"
      label="Cyberpunk 2077"
      icon="https://cdn2.steamgriddb.com/icon/3b5e2c9be5002e87e0477099db5ff21b/32/256x256.png"
    />
  </div>
);
