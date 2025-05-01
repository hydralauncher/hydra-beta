import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router";

import { Sidebar } from "@/layouts/sidebar/sidebar";
import type { User } from "./types";

const queryClient = new QueryClient();

export interface AppProps {
  initialPath: string;
  user?: User | null;
}

interface RouterProps {
  children: React.ReactNode;
  initialPath: string;
}

function Router({ children, initialPath }: Readonly<RouterProps>) {
  if (typeof window === "undefined") {
    return (
      <MemoryRouter initialEntries={[initialPath]}>{children}</MemoryRouter>
    );
  }

  return <BrowserRouter>{children}</BrowserRouter>;
}

const Home = lazy(() => import("@/components/views/home/home"));
const DownloadSources = lazy(
  () => import("@/components/views/download-sources/download-sources")
);
const Profile = lazy(() => import("@/components/views/profile/profile"));

export function App(props: Readonly<AppProps>) {
  return (
    <QueryClientProvider client={queryClient}>
      <Router initialPath={props.initialPath}>
        <Sidebar />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/download-sources" element={<DownloadSources />} />
            <Route
              path="/profile/:id"
              element={<Profile user={props.user} />}
            />
          </Routes>
        </Suspense>
      </Router>
    </QueryClientProvider>
  );
}
