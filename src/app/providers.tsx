"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  getSteamGamesByLetter,
  importSteamGamesByLetter,
} from "@/services/download-sources.service";

const queryClient = new QueryClient();

if (typeof window !== "undefined") {
  const steamGamesByLetter = await getSteamGamesByLetter();
  importSteamGamesByLetter(steamGamesByLetter);
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
