import { Button } from "@/components/common";
import { IS_DESKTOP } from "@/constants";
import { api, calculateTokenExpirationTimestamp } from "@/services";
import { Keytar } from "@/services/keytar.service";
import type { User } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { setCookie } from "typescript-cookie";

export default function Home() {
  const router = useRouter();

  const { data, isLoading, refetch } = useQuery<User | null>({
    queryKey: ["me"],
    queryFn: () =>
      api.get<User>("profile/me", { credentials: "include" }).json(),
    initialData: null,
  });

  const { mutateAsync } = useMutation({
    mutationFn: () =>
      api.post("auth/logout", { credentials: "include" }).json(),
  });

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

      if (IS_DESKTOP) {
        const accessTokenKeytar = new Keytar("access-token");
        const refreshTokenKeytar = new Keytar("refresh-token");

        await Promise.all([
          accessTokenKeytar.savePassword(accessToken),
          refreshTokenKeytar.savePassword(refreshToken),
        ]);
      }

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

      <Link href="/download-sources">Download Sources</Link>
      <Link href="/gamepad/test">Gamepad test</Link>
      <Link href={`/profile/${data?.id}`}>Profile</Link>
    </div>
  );
}
