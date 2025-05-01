import { Button } from "@/components/common";
import { IS_DESKTOP } from "@/constants";
import { api, calculateTokenExpirationTimestamp } from "@/services";
import type { User } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { setCookie } from "typescript-cookie";

export function Home() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["me"],
    queryFn: () => api.get<User>("profile/me").json(),
  });

  const { mutateAsync } = useMutation({
    mutationFn: () => api.post("auth/logout"),
  });

  const { mutateAsync: createSession } = useMutation({
    mutationFn: ({
      accessToken,
      refreshToken,
    }: {
      accessToken: string;
      refreshToken: string;
    }) =>
      api.post("auth/session", {
        json: { accessToken, refreshToken },
      }),
  });

  const [searchParams, setSearchParams] = useSearchParams();

  const authorizePayload = useCallback(
    async (payload: string) => {
      const { accessToken, refreshToken, expiresIn } = JSON.parse(
        atob(payload)
      );

      return createSession({
        accessToken,
        refreshToken,
      }).then(() => {
        setCookie(
          "tokenExpirationTimestamp",
          calculateTokenExpirationTimestamp(expiresIn).toString()
        );

        refetch();
      });
    },
    [createSession, refetch]
  );

  useEffect(() => {
    const payload = searchParams.get("payload");

    if (payload) {
      authorizePayload(payload).then(() => {
        setSearchParams({});
      });
    }
  }, [searchParams, setSearchParams, authorizePayload]);

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

        authorizePayload(event.payload as string);
      });
    } else {
      const params = new URLSearchParams({
        return_to: window.location.origin,
      });

      window.location.href = authUrl + "?" + params.toString();
    }
  }, [authorizePayload]);

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
