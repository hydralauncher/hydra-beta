"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { Auth, useAuthStore } from "@/stores/auth.store";
import { IS_DESKTOP } from "@/constants";
import { User, useUserStore } from "@/stores/user.store";

export default function Home() {
  const { auth, setAuth } = useAuthStore();
  const { user, setUser } = useUserStore();

  const { data } = useQuery<User | null>({
    queryKey: ["user"],
    queryFn: () =>
      api
        .get("/profile/me", {
          headers: {
            Authorization: `Bearer ${auth?.accessToken}`,
          },
        })
        .then((res) => res.data),
    initialData: null,
    enabled: !!auth?.accessToken,
  });

  useEffect(() => {
    (async () => {
      if (IS_DESKTOP) {
        const tauri = await import("@tauri-apps/api");
        tauri.invoke<Auth>("get_auth").then(setAuth);
      }
    })();
  }, [setAuth]);

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);

  return (
    <div>
      <h1>Hello</h1>
      <p>{user?.id}</p>
      <p>{user?.displayName}</p>
    </div>
  );
}
