import { Divider, RouteAnchor } from "@/components/common";
import {
  DownloadSimple,
  Gear,
  House,
  SquaresFour,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { useContext } from "react";
import { SidebarContext, SidebarProvider } from "./sidebar-context";
import { SidebarSlider } from "./sidebar-slider";

function SidebarContainer({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { currentWidth, isCollapsed, sidebarSizes } =
    useContext(SidebarContext);

  return (
    <div
      className="sidebar-container"
      style={{ width: isCollapsed ? sidebarSizes.COLLAPSED : currentWidth }}
    >
      {children}
    </div>
  );
}

function SidebarRoutes() {
  const appRoutes = [
    {
      path: "/",
      label: "Home",
      icon: <House size={24} />,
    },
    {
      path: "/catalog",
      label: "Catalog",
      icon: <SquaresFour size={24} />,
    },
    {
      path: "/downloads",
      label: "Downloads",
      icon: <DownloadSimple size={24} />,
    },
    {
      path: "/settings",
      label: "Settings",
      icon: <Gear size={24} />,
    },
  ];

  const { isCollapsed } = useContext(SidebarContext);

  return (
    <div className="sidebar-routes">
      {appRoutes.map((route) => (
        <RouteAnchor
          key={route.path}
          href={route.path}
          label={route.label}
          icon={route.icon}
          collapsed={isCollapsed}
        />
      ))}
    </div>
  );
}

function SidebarDivider() {
  const { isCollapsed } = useContext(SidebarContext);

  return (
    <div
      className={clsx("sidebar-divider", {
        "sidebar-divider--collapsed": isCollapsed,
      })}
    >
      <Divider />
    </div>
  );
}

export function Sidebar() {
  return (
    <SidebarProvider>
      <SidebarContainer>
        <SidebarRoutes />
        <SidebarDivider />
      </SidebarContainer>
      <SidebarSlider />
    </SidebarProvider>
  );
}
