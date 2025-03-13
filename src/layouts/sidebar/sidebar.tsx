import { UserProfile } from "@/components/common";
import { api } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import "./sidebar.scss";

export interface User {
  displayName: string;
  profileImageUrl: string;
}

export interface SidebarContainerProps {
  children: React.ReactNode;
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

  const containerStyle = {
    width: isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : width,
  };

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
      {children}
    </div>
  );
}

function SidebarHeader() {
  const profile = SidebarMockUser();

  if (!profile) {
    // TODO: add skeleton
    return <div>Loading...</div>;
  }

  return (
    <div className="sidebar-header">
      <UserProfile
        name={profile.displayName}
        image={profile.profileImageUrl}
        href="#"
      />
    </div>
  );
}

function SidebarContent() {
  return (
    <div className="sidebar-content">
      <SidebarGroup />
    </div>
  );
}

function SidebarGroup() {
  return (
    <div className="sidebar-group">
      <h2>Group</h2>
      <ul>
        <li>Item</li>
      </ul>
    </div>
  );
}

export function Sidebar() {
  return (
    <SidebarContainer>
      <p>asdasd</p>
    </SidebarContainer>
  );
}
