import { Button } from "@/components/common";
import { IS_DESKTOP } from "@/constants";
import { api } from "@/services";
import type { User } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { Link } from "react-router";

export function Home() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["me"],
    queryFn: () => api.get<User>("profile/me").json(),
  });

  const { mutateAsync } = useMutation({
    mutationFn: () => api.post("auth/logout"),
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
        webview.close();

        const params = new URLSearchParams({
          payload: event.payload as string,
        });

        window.location.href =
          window.location.origin + "/api/auth?" + params.toString();
      });
    } else {
      const params = new URLSearchParams({
        return_to: window.location.origin + "/api/auth",
      });

      window.location.href = authUrl + "?" + params.toString();
    }
  }, []);

  const logout = useCallback(async () => {
    await mutateAsync();
    refetch();
  }, [mutateAsync, refetch]);

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
