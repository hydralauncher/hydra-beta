import { Button } from "@/components/common";
import { IS_DESKTOP } from "@/constants";
import { api, calculateTokenExpirationTimestamp } from "@/services";
import { useUser } from "@/hooks/use-user.hook";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/stores";

export default function Home() {
  const router = useRouter();

  const { user, getUser, logout } = useUser();
  const { setTokenExpirationTimestamp, setAccessToken, setRefreshToken } =
    useAuthStore();

  const { mutateAsync: createSession } = useMutation({
    mutationFn: ({
      accessToken,
      refreshToken,
    }: {
      accessToken: string;
      refreshToken: string;
    }) =>
      api
        .post("auth/session", {
          json: { accessToken, refreshToken },
          credentials: "include",
        })
        .json(),
  });

  const authorizePayload = useCallback(
    async (payload: string) => {
      const { accessToken, refreshToken, expiresIn } = JSON.parse(
        atob(payload)
      );

      return createSession({
        accessToken,
        refreshToken,
      }).then(() => {
        setTokenExpirationTimestamp(
          calculateTokenExpirationTimestamp(expiresIn)
        );

        if (IS_DESKTOP) {
          setAccessToken(accessToken);
          setRefreshToken(refreshToken);
        }

        getUser();
      });
    },
    [
      createSession,
      getUser,
      setAccessToken,
      setRefreshToken,
      setTokenExpirationTimestamp,
    ]
  );

  useEffect(() => {
    const payload = router.query?.payload;

    if (payload) {
      authorizePayload(payload as string).then(() => {
        router.replace(router.pathname, undefined, { shallow: true });
      });
    }
  }, [router, authorizePayload]);

  const openAuth = useCallback(async () => {
    const authUrl = process.env.NEXT_PUBLIC_AUTH_URL;

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

  return (
    <div>
      <p>Logged in as {user?.displayName}</p>

      {user ? (
        <Button onClick={logout}>Logout</Button>
      ) : (
        <Button onClick={openAuth}>Login</Button>
      )}

      <Link href="/game/268910">Cuphead</Link>
      <Link href="/download-sources">Download Sources</Link>
      <Link href={`/profile/${user?.id}`}>Profile</Link>
    </div>
  );
}
