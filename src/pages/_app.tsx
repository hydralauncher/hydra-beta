import "@/styles/globals.scss";

import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Sidebar, Header } from "@/layouts";
import { Space_Grotesk } from "next/font/google";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/hooks";
import { useGamepadStore } from "@/stores";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

function Main({ children }: { children: React.ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { getUser } = useUser();

  useEffect(() => {
    getUser();
  }, [getUser]);

  useEffect(() => {
    useGamepadStore.getState().sync();
  }, []);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [router.pathname, router.query]);

  return (
    <main
      ref={contentRef}
      style={{
        display: "flex",
        flex: 1,
        overflow: "auto",
      }}
    >
      <div style={{ maxWidth: 1920, margin: "0 auto", flex: 1 }}>
        {children}
      </div>
    </main>
  );
}

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <div
        id="app"
        className={spaceGrotesk.className}
        style={{ width: "100%", display: "flex" }}
      >
        <Sidebar />

        <Main>
          <Header />
          <Component {...pageProps} />
        </Main>
      </div>
    </QueryClientProvider>
  );
}
