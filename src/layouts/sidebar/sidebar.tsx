import { useLibraryStore } from "@/stores/library.store";
import { useSidebarStore } from "@/stores/sidebar.store";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useMemo } from "react";
import {
  RouteAnchor,
  Divider,
  Input,
  ScrollArea,
  UserProfile,
} from "@/components";
import { useUserStore } from "@/stores/user.store";

function SidebarRouter() {
  const { routes } = useSidebarStore();

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
  const { library } = useLibraryStore();
  const { searchTerm, setSearchTerm } = useSidebarStore();

  const filteredLibrary = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return library;

    return library
      .filter((game) => game.title.toLowerCase().includes(term))
      .sort((a, b) => {
        const aStarts = a.title.toLowerCase().startsWith(term);
        const bStarts = b.title.toLowerCase().startsWith(term);

        if (aStarts !== bStarts) return aStarts ? -1 : 1;
        return a.title.localeCompare(b.title);
      });
  }, [library, searchTerm]);

  return (
    <div className="library-container">
      <Input
        placeholder="Search"
        iconLeft={<MagnifyingGlass size={24} />}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <ScrollArea>
        <ul className="library-list">
          {filteredLibrary.map((game) => (
            <li key={game.id} className="library-list__item">
              <RouteAnchor
                key={game.id}
                label={game.title}
                href={`/game/${game.id}`}
                icon={game.iconUrl}
              />
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}

function SidebarProfile() {
  const { user } = useUserStore();

  return (
    <div className="sidebar-profile">
      <UserProfile
        name={user?.displayName ?? ""}
        friendCode={user?.id ?? ""}
        image={user?.profileImageUrl ?? ""}
        playingStatus={{
          isPlaying: false,
          label: user?.id ?? "",
        }}
      />
    </div>
  );
}

export function Sidebar() {
  return (
    <div className="sidebar-container">
      <SidebarRouter />
      <Divider gap={32} />
      <SidebarLibrary />
      <SidebarProfile />
    </div>
  );
}
