import { useMemo } from "react";
import { useSidebarStore } from "@/stores/sidebar.store";
import { FunnelSimple, MagnifyingGlass } from "@phosphor-icons/react";
import { useLibrary } from "@/hooks/use-library.hook";
import { useUser } from "@/hooks/use-user.hook";
import {
  RouteAnchor,
  Divider,
  Input,
  ScrollArea,
  UserProfile,
  Button,
} from "@/components";
import { toSlug } from "@/helpers";

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
  const { library } = useLibrary();
  console.log(library);
  const { searchTerm, setSearchTerm } = useSidebarStore();

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
