import { useMemo, useState } from "react";
import { useLibrary } from "@/hooks/use-library.hook";
import { useUser } from "@/hooks/use-user.hook";
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
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLibrary = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return [...library].sort(
        (a, b) =>
          (b.playTimeInMilliseconds ?? 0) - (a.playTimeInMilliseconds ?? 0)
      );
    }

    return library
      .filter(({ title }) => title.toLowerCase().includes(term))
      .sort((a, b) => {
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();
        const aStarts = aTitle.startsWith(term);
        const bStarts = bTitle.startsWith(term);

        if (aStarts !== bStarts) return aStarts ? -1 : 1;
        return aTitle.localeCompare(bTitle);
      });
  }, [library, searchTerm]);

  return (
    <div className="library-container">
      <div className="library-container__header">
        <Input
          placeholder="Search"
          iconLeft={<MagnifyingGlass size={24} />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Button variant="rounded" size="icon">
          <FunnelSimple size={24} className="library-container__header__icon" />
        </Button>
      </div>

      <ScrollArea>
        <ul className="library-list">
          {filteredLibrary.map((game) => (
            <li key={game.id} className="library-list__item">
              <RouteAnchor
                key={game.id}
                label={game.title}
                href={`/game/${game.id}`}
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

export function Sidebar() {
  return (
    <SidebarContainer>
      <SidebarRouter />
      <Divider />
      <SidebarLibrary />
      <SidebarProfile />
    </SidebarContainer>
  );
}
