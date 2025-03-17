import { Divider, RouteAnchor, UserProfile } from "@/components/common";
import { api } from "@/services";
import {
  DownloadSimple,
  Gear,
  House,
  SquaresFour,
} from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import {
  createContext,
  type CSSProperties,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import "./sidebar.scss";

interface User {
  displayName: string;
  profileImageUrl: string;
  libraryGames: {
    id: string;
    objectId: string;
    shop: string;
  }[];
  status: {
    icon: string;
    label: string;
  };
}

interface SidebarContainerProps {
  children: React.ReactNode;
}

interface SidebarGroupProps {
  children: React.ReactNode;
}

interface SidebarContext {
  isCollapsed: boolean;
  user: User | null;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

const SidebarMockUser = (): User | null => {
  const id = "Znq8XqOR";

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", id],
    queryFn: () => api.get<User>(`users/${id}`).json(),
    initialData: {
      displayName: "",
      profileImageUrl: "",
      libraryGames: [],
      status: {
        icon: "",
        label: "",
      },
    },
  });

  if (isLoading || !profile) {
    return null;
  }

  console.log(profile);

  return {
    ...profile,
    status: {
      icon: "https://cdn2.steamgriddb.com/icon/602d1305678a8d5fdb372271e980da6a/32/256x256.png",
      label: "Hollow Knight",
    },
  };
};

const SidebarContext = createContext<SidebarContext>({
  isCollapsed: false,
  setIsCollapsed: () => {},
  user: null,
});

function SidebarContainer({ children }: Readonly<SidebarContainerProps>) {
  const SIDEBAR_DEFAULT_WIDTH = 250;
  const SIDEBAR_COLLAPSED_WIDTH = 72;
  const SIDEBAR_MIN_WIDTH = 200;
  const SIDEBAR_MAX_WIDTH = 400;

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [width, setWidth] = useState(SIDEBAR_DEFAULT_WIDTH);

  const startResizing = () => setIsResizing(true);
  const stopResizing = () => setIsResizing(false);

  const handleResize = (e: MouseEvent) => {
    if (!isResizing) return;

    if (e.clientX < SIDEBAR_MIN_WIDTH / 2) {
      setIsCollapsed(true);
    } else if (e.clientX > SIDEBAR_MIN_WIDTH) {
      setIsCollapsed(false);
    }

    const newWidth = Math.min(
      Math.max(e.clientX, SIDEBAR_MIN_WIDTH),
      SIDEBAR_MAX_WIDTH
    );
    setWidth(newWidth);
  };

  useEffect(() => {
    if (!isResizing) return;

    document.addEventListener("mousemove", handleResize);
    document.addEventListener("mouseup", stopResizing);

    return () => {
      document.removeEventListener("mousemove", handleResize);
      document.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing, handleResize, stopResizing]);

  const containerStyle: CSSProperties = {
    width: isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : width,
  };

  const user = SidebarMockUser();

  const contextValue = useMemo(
    () => ({ isCollapsed, setIsCollapsed, user }),
    [isCollapsed, user]
  );

  return (
    <div className="sidebar-container" style={containerStyle}>
      <div // NOSONAR
        className="sidebar-container__slider"
        onMouseDown={startResizing}
        role="slider"
        aria-label="Resize sidebar"
        aria-valuenow={width}
        aria-valuemin={SIDEBAR_MIN_WIDTH}
        aria-valuemax={SIDEBAR_MAX_WIDTH}
      >
        <div className="sidebar-container__slider-trigger" />
      </div>
      <SidebarContext.Provider value={contextValue}>
        {children}
      </SidebarContext.Provider>
    </div>
  );
}

function SidebarHeader() {
  const { isCollapsed, user } = useContext(SidebarContext);
  if (!user) {
    // TODO: add skeleton
    return <div>Loading...</div>;
  }

  return (
    <div className="sidebar-header">
      <UserProfile
        name={user.displayName}
        image={user.profileImageUrl}
        collapsed={isCollapsed}
        playingStatus={user.status}
        href="#"
      />
      <Divider />
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
  const { user, isCollapsed } = useContext(SidebarContext);

  if (!user) {
    // TODO: add skeleton
    return <div>Loading...</div>;
  }

  const userGameLibrary = user.libraryGames.map((game) => {
    return {
      id: game.id,
      objectId: game.objectId,
      shop: game.shop,
    };
  });

  return (
    <div className="sidebar-library">
      {userGameLibrary.map((game) => (
        <RouteAnchor
          href={`/store/${game.id}`}
          label={game.objectId}
          icon={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.objectId}/logo.png`}
          key={game.id}
          collapsed={isCollapsed}
        />
      ))}
    </div>
  );
}

function SidebarContent() {
  return (
    <div className="sidebar-content">
      <SidebarGroup>
        <SidebarRoutes />
      </SidebarGroup>
      <Divider />
      <SidebarGroup>
        <SidebarLibrary />
      </SidebarGroup>
    </div>
  );
}

function SidebarGroup({ children }: Readonly<SidebarGroupProps>) {
  return <div className="sidebar-group">{children}</div>;
}

export function Sidebar() {
  return (
    <SidebarContainer>
      <SidebarHeader />
      <SidebarContent />
    </SidebarContainer>
  );
}
