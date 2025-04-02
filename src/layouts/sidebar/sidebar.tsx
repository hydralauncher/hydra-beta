import { Divider, Input, RouteAnchor, UserProfile } from "@/components/common";
import { useSidebar } from "@/hooks/use-sidebar";
import { api } from "@/services/api.service";
import { useAuthStore } from "@/stores/auth.store";
import type { User, UserGame } from "@/types";
import {
  DownloadSimple,
  Gear,
  House,
  MagnifyingGlass,
  SquaresFour,
} from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useRef, useState } from "react";
import { SidebarSlider } from "./sidebar-slider";
import "./sidebar.scss";

export interface SidebarProps {
  profile?: User | null;
}

function SidebarContainer({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { currentWidth, isCollapsed, sidebarSizes } = useSidebar();

  return (
    <div
      className="sidebar-container"
      style={{ width: isCollapsed ? sidebarSizes.COLLAPSED : currentWidth }}
    >
      {children}
    </div>
  );
}

function SidebarProfile({ profile }: Readonly<SidebarProps>) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="sidebar-profile">
      <UserProfile
        name={profile?.displayName ?? ""}
        image={profile?.profileImageUrl ?? ""}
        href={`/profile/${profile?.id}`}
        collapsed={isCollapsed}
      />
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

  const { isCollapsed } = useSidebar();

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
  const { isCollapsed, setIsCollapsed } = useSidebar();
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
  const { isCollapsed } = useSidebar();

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

export function Sidebar(props: Readonly<SidebarProps>) {
  return (
    <>
      <SidebarContainer>
        <SidebarProfile profile={props.profile} />
        <SidebarDivider />
        <SidebarRoutes />
        <SidebarDivider />
        <SidebarLibrary />
      </SidebarContainer>
      <SidebarSlider />
    </>
  );
}
