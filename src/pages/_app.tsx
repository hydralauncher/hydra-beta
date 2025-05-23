import "@/styles/globals.scss";

import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Sidebar } from "@/layouts/sidebar/sidebar";
import { Space_Grotesk } from "next/font/google";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

function Main({ children }: { children: React.ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [router.pathname, router.query]);

  return (
    <main
      ref={contentRef}
      className={spaceGrotesk.className}
      style={{
        display: "flex",
        flex: 1,
        overflow: "auto",
      }}
    >
      <div style={{ maxWidth: 1920, margin: "0 auto" }}>{children}</div>
    </main>
  );
}

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  // const { initialize, startPolling, cleanup } = useGamepadStore();

  // useEffect(() => {
  //   initialize();
  //   startPolling();

  //   return () => {
  //     cleanup();
  //   };
  // }, [initialize, startPolling, cleanup]);

  return (
    <QueryClientProvider client={queryClient}>
      <Sidebar />

      <Main>
        <Component {...pageProps} />
      </Main>
    </QueryClientProvider>
  );
}
