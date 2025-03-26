import { Divider, Input, RouteAnchor } from "@/components/common";
import { api } from "@/services/api.service";
import { useAuthStore } from "@/stores/auth.store";
import type { UserGame } from "@/types";
import {
  DownloadSimple,
  Gear,
  House,
  MagnifyingGlass,
  SquaresFour,
} from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useContext, useRef, useState } from "react";
import { SidebarContext, SidebarProvider } from "./sidebar-context";
import { SidebarSlider } from "./sidebar-slider";
import "./sidebar.scss";

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

function SidebarLibrary() {
  const { auth } = useAuthStore();
  const { isCollapsed, setIsCollapsed } = useContext(SidebarContext);
  const [search, setSearch] = useState("");

  const searchbarRef = useRef<HTMLInputElement>(null);

  const { data: gameLibrary } = useQuery({
    queryKey: ["game-library", auth?.accessToken],
    queryFn: () => {
      if (!auth) return null;
      return api.get<UserGame[]>("profile/games").json();
    },
    placeholderData: null,
  });

  const handleSearchbarClick = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
      searchbarRef.current?.focus();
    }
  };

  // talvez seja melhor mover isso para um helper depois
  const iconUrlBuilder = (objectId: string, iconHash: string) =>
    `https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/${objectId}/${iconHash}.ico`;

  return (
    <div
      className={clsx("sidebar-library", {
        "sidebar-library--collapsed": isCollapsed,
      })}
    >
      {gameLibrary && (
        <Input
          placeholder="Search"
          iconLeft={<MagnifyingGlass size={24} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          inputSize={isCollapsed ? "icon" : "default"}
          onClick={() => handleSearchbarClick()}
          ref={searchbarRef as React.RefObject<HTMLInputElement>}
        />
      )}
      <div className="sidebar-library__game-list">
        {gameLibrary
          ?.sort((a, b) => a.title.localeCompare(b.title))
          .filter((game) =>
            game.title.toLowerCase().includes(search.toLowerCase())
          )
          .map((game) => (
            <RouteAnchor
              key={game.id}
              href={`/shop/${game.id}`}
              label={game.title}
              icon={iconUrlBuilder(game.objectId, game.iconHash)}
              collapsed={isCollapsed}
            />
          ))}
      </div>
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
        <SidebarLibrary />
      </SidebarContainer>
      <SidebarSlider />
    </SidebarProvider>
  );
}
