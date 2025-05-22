import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Sidebar } from "@/layouts/sidebar/sidebar";
import { useGamepadStore } from "@/stores/gamepad.store";
import { Space_Grotesk } from "next/font/google";
import { useEffect } from "react";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const { initialize, startPolling, cleanup } = useGamepadStore();

  useEffect(() => {
    initialize();
    startPolling();

    return () => {
      cleanup();
    };
  }, [initialize, startPolling, cleanup]);

  return (
    <QueryClientProvider client={queryClient}>
      <main
        className={spaceGrotesk.className}
        style={{ display: "flex", flex: 1 }}
      >
        <Sidebar />

        <Component {...pageProps} />
      </main>
    </QueryClientProvider>
  );
}
