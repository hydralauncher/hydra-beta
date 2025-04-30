import { Button } from "@/components/common";
import { IS_DESKTOP } from "@/constants";
import { api } from "@/services";
import { useAuthStore, type Auth } from "@/stores/auth.store";
import type { User } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { Link } from "react-router";

export function Home() {
  const { auth, setAuth, clearAuth } = useAuthStore();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["me", auth?.accessToken],
    queryFn: () => {
      if (!auth) return null;
      return api.get<User>("profile/me").json();
    },
  });

  const openAuth = useCallback(async () => {
    const authUrl = import.meta.env.PUBLIC_AUTH_URL;

    if (IS_DESKTOP) {
      const { WebviewWindow } = await import("@tauri-apps/api/webviewWindow");

      const webview = new WebviewWindow("auth", {
        url: authUrl,
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
        return_to: window.location.origin + "/api/auth",
      });

      window.location.href = authUrl + "?" + params.toString();
    }
  }, [setAuth]);

  const logout = useCallback(() => {
    clearAuth();
    refetch();
  }, [clearAuth, refetch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>Logged in as {data?.displayName}</p>

      {data ? (
        <Button onClick={logout}>Logout</Button>
      ) : (
        <Button onClick={openAuth}>Login</Button>
      )}

      <Link to="/download-sources">Download Sources</Link>
      <Link to={`/profile/${data?.id}`}>Profile</Link>
    </div>
  );
}
