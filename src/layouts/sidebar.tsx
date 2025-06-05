import { useLibrary, useUser } from "@/hooks";
import {
  House,
  SquaresFour,
  DownloadSimple,
  Gear,
  FunnelSimple,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import {
  RouteAnchor,
  Divider,
  Input,
  ScrollArea,
  UserProfile,
  Button,
} from "@/components";
import { toSlug } from "@/helpers";
import { useSearch } from "@/hooks";
import { useMemo } from "react";

function SidebarRouter() {
  const routes = [
    {
      label: "Home",
      href: "/",
      icon: House,
    },
    {
      label: "Catalogue",
      href: "/catalogue",
      icon: SquaresFour,
    },
    {
      label: "Downloads",
      href: "/downloads",
      icon: DownloadSimple,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Gear,
    },
  ];

  return (
    <div className="router-container">
      {routes.map((route) => (
        <RouteAnchor
          key={route.label}
          label={route.label}
          href={route.href}
          icon={<route.icon size={24} />}
        />
      ))}
    </div>
  );
}

function SidebarLibrary() {
  const { library } = useLibrary();

  const sortedLibrary = useMemo(() => {
    return library.sort(
      (a, b) =>
        (b.playTimeInMilliseconds ?? 0) - (a.playTimeInMilliseconds ?? 0)
    );
  }, [library]);

  const { filteredItems, search, setSearch } = useSearch(sortedLibrary, [
    "title",
  ]);

  return (
    <div className="library-container">
      <div className="library-container__header">
        <Input
          placeholder="Search"
          iconLeft={<MagnifyingGlass size={24} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          spellCheck={false}
          autoComplete="off"
        />

        <Button variant="rounded" size="icon">
          <FunnelSimple size={24} className="library-container__header__icon" />
        </Button>
      </div>

      <ScrollArea>
        <ul className="library-list">
          {filteredItems.map((game) => (
            <li key={game.id} className="library-list__item">
              <RouteAnchor
                key={game.id}
                label={game.title}
                href={`/game/${game.objectId}/${toSlug(game.title)}`}
                icon={game.iconUrl}
                isFavorite={game.isFavorite}
              />
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}

function SidebarProfile() {
  const { user } = useUser();

  return (
    <div className="sidebar-profile">
      <UserProfile
        name={user?.displayName ?? ""}
        image={user?.profileImageUrl ?? ""}
        friendCode={user?.id ?? ""}
      />
    </div>
  );
}

function SidebarContainer({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="sidebar-container">{children}</div>
      <div className="sidebar-spacer" />
      <div className="sidebar-drawer-overlay" />
    </>
  );
}

export default function Sidebar() {
  return (
    <SidebarContainer>
      <SidebarRouter />
      <Divider />
      <SidebarLibrary />
      <SidebarProfile />
    </SidebarContainer>
  );
}
