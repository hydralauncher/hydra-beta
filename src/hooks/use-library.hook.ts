import { api } from "@/services";
import { type Game, useLibraryStore } from "@/stores";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useUser } from "./use-user.hook";

export function useLibrary() {
  const { setLibrary, library } = useLibraryStore();
  const { user } = useUser();

  const { data, isLoading } = useQuery<Game[]>({
    queryKey: ["library", user?.id],
    queryFn: () => api.get("profile/games").json(),
  });

  useEffect(() => {
    if (data) {
      setLibrary(data);
    }
  }, [data, setLibrary]);

  return {
    library,
    isLoading,
  };
}
