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
import { useSearch } from "@/hooks";

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
  const { filteredItems, search, setSearch } = useSearch(library, ["title"]);

  return (
    <div className="library-container">
      <div className="library-container__header">
        <Input
          placeholder="Search"
          iconLeft={<MagnifyingGlass size={24} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
