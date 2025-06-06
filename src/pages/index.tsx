import { Button } from "@/components/common";
import { IS_DESKTOP } from "@/constants";
import { calculateTokenExpirationTimestamp } from "@/services";
import { useUser } from "@/hooks";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { useAuthStore } from "@/stores";

export default function Home() {
  const router = useRouter();
  const { user, getUser, logout } = useUser();
  const { setTokenExpirationTimestamp, setAccessToken, setRefreshToken } =
    useAuthStore();

  const authorizePayload = useCallback(
    async (payload: string) => {
      const { accessToken, refreshToken, expiresIn } = JSON.parse(
        atob(payload)
      );

      setTokenExpirationTimestamp(calculateTokenExpirationTimestamp(expiresIn));
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);

      getUser();
    },
    [getUser, setAccessToken, setRefreshToken, setTokenExpirationTimestamp]
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

      <Link href="/download-sources">Download Sources</Link>
      <Link href={`/profile/${user?.id}`}>Profile</Link>
      <Link href="/gamepad/test">Gamepad Test</Link>
      <Link href="/gamepad/example">Gamepad Example</Link>
    </div>
  );
}
