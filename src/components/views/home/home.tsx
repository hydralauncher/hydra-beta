import { Button } from "@/components/common";
import { IS_DESKTOP } from "@/constants";
import { api } from "@/services";
import { useAuthStore, type Auth } from "@/stores/auth.store";
import type { User } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { Link } from "react-router";

const AUTH_URL = "http://localhost:5173";
const AUTH_REDIRECT_URL = "http://localhost:4321/api/auth";

export interface HomeProps {
  profile?: User | null;
}

export function Home(props: HomeProps) {
  const { auth, setAuth, clearAuth } = useAuthStore();

  const { data, refetch } = useQuery({
    queryKey: ["me", auth?.accessToken],
    queryFn: () => {
      if (!auth) return null;
      return api.get<User>("profile/me").json();
    },
    placeholderData: props.profile,
  });

  const openAuth = useCallback(async () => {
    if (IS_DESKTOP) {
      const { WebviewWindow } = await import("@tauri-apps/api/webviewWindow");

      const webview = new WebviewWindow("auth", {
        url: AUTH_URL,
        width: 600,
        height: 640,
        parent: "main",
        backgroundColor: "#1c1c1c",
        maximizable: false,
        resizable: false,
        minimizable: false,
      });

      webview.once("auth-response", (event) => {
        setAuth(event.payload as Auth);
        webview.close();
      });
    } else {
      const params = new URLSearchParams({
        return_to: AUTH_REDIRECT_URL,
      });

      window.location.href = AUTH_URL + "?" + params.toString();
    }
  }, [setAuth]);

  const logout = useCallback(() => {
    clearAuth();
    refetch();
  }, [clearAuth, refetch]);

  return (
    <div>
      <p>Logged in as {data?.displayName}</p>

      {data ? (
        <Button onClick={logout}>Logout</Button>
      ) : (
        <Button onClick={openAuth}>Login</Button>
      )}

      <Link to="/download-sources">Download Sources</Link>
      <Link to="/profile">Profile</Link>
    </div>
  );
}
