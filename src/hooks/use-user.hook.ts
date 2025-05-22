import { api } from "@/services";
import {
  useAuthStore,
  useLibraryStore,
  useUserStore,
  type User,
} from "@/stores";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";

export function useUser() {
  const { user, setUser, clearUser } = useUserStore();
  const { clearAuth } = useAuthStore();
  const { clearLibrary } = useLibraryStore();

  const { data, refetch } = useQuery<User | null>({
    queryKey: ["me"],
    queryFn: () =>
      api.get<User>("profile/me", { credentials: "include" }).json(),
    initialData: null,
    enabled: false,
  });

  const logout = useCallback(async () => {
    await api.post("auth/logout", { credentials: "include" }).json();
    clearUser();
    clearAuth();
    clearLibrary();
  }, [clearAuth, clearLibrary, clearUser]);

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);

  return {
    user,
    setUser,
    getUser: refetch,
    logout,
  };
}
