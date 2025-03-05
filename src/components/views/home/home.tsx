import { Button, Tooltip } from "@/components/common";
import { IS_DESKTOP } from "@/constants";
import { api } from "@/services";
import { useAuthStore, type Auth } from "@/stores/auth.store";
import type { User } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { Link } from "react-router";

export function Home() {
  const { auth, setAuth, clearAuth } = useAuthStore();

  const { data } = useQuery({
    queryKey: ["me", auth?.accessToken],
    queryFn: () =>
      api
        .get<User>("profile/me", {
          headers: {
            Authorization: `Bearer ${auth?.accessToken}`,
          },
        })
        .json(),
    enabled: !!auth,
  });

  const openAuth = useCallback(async () => {
    if (IS_DESKTOP) {
      const { WebviewWindow } = await import("@tauri-apps/api/webviewWindow");

      const webview = new WebviewWindow("auth", {
        url: "http://localhost:5173",
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
    }
  }, [setAuth]);

  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  return (
    <div>
      <p>Logged in as {data?.displayName}</p>

      {auth ? (
        <Button onClick={logout}>Logout</Button>
      ) : (
        <Button onClick={openAuth}>Login</Button>
      )}

      <Link to="/download-sources">Download Sources</Link>
      <Link to="/profile">Profile</Link>

      <Tooltip content="Download Sources" position="right">
        <Button size="icon">R</Button>
      </Tooltip>
    </div>
  );
}
