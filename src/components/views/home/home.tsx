import { Button, Tooltip } from "@/components/common";
import { IS_DESKTOP } from "@/constants";
import { api } from "@/services";
import { useAuthStore, type Auth } from "@/stores/auth.store";
import type { User } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { Link, useSearchParams } from "react-router";

const AUTH_URL = "http://localhost:5173";

export function Home() {
  const { auth, setAuth, clearAuth } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data } = useQuery({
    queryKey: ["me", auth?.accessToken],
    queryFn: () => api.get<User>("profile/me").json(),
    enabled: !!auth,
  });

  const payload = searchParams.get("payload");

  useEffect(() => {
    if (payload) {
      try {
        const auth = JSON.parse(atob(payload));
        setAuth(auth);

        setSearchParams({});
      } catch (err) {
        console.error("Failed to parse payload", err);
      }
    }
  }, [payload, setAuth]);

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
        return_to: window.location.href,
      });

      window.location.href = AUTH_URL + "?" + params.toString();
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
    </div>
  );
}
