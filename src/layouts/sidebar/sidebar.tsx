import { Divider, RouteAnchor, UserProfile } from "@/components/common";
import { api } from "@/services";
import { DownloadSimple, Gear, House, SquaresFour } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { createContext, type CSSProperties, useContext, useEffect, useMemo, useState } from "react";
import "./sidebar.scss";

interface User {
  displayName: string;
  profileImageUrl: string;
}

interface SidebarContainerProps {
  children: React.ReactNode;
}

interface SidebarGroupProps {
  children: React.ReactNode;
}

interface SidebarContext {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

function SidebarMockUser(): User | null {
  const id = "Znq8XqOR";

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", id],
    queryFn: () => api.get<User>(`users/${id}`).json(),
    initialData: {
      displayName: "",
      profileImageUrl: "",
    },
  });

  if (isLoading || !profile) {
    return null;
  }

  return profile;
}

const SidebarContext = createContext<SidebarContext>({
  isCollapsed: false,
  setIsCollapsed: () => {},
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

  const contextValue = useMemo(
    () => ({ isCollapsed, setIsCollapsed }),
    [isCollapsed]
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
  const profile = SidebarMockUser();
  const { isCollapsed } = useContext(SidebarContext);
  if (!profile) {
    // TODO: add skeleton
    return <div>Loading...</div>;
  }

  return (
    <div className="sidebar-header">
      <UserProfile
        name={profile.displayName}
        image={profile.profileImageUrl}
        collapsed={isCollapsed}
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

function SidebarLibrary(library: any) {
  return (
    <div className="sidebar-library">
      <h2>Library</h2>
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
