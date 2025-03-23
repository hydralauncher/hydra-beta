import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router";

import { DownloadSources, Home, Profile } from "@/components";
import { Sidebar } from "@/layouts/sidebar/sidebar";
import type { User } from "./types";

const queryClient = new QueryClient();

export interface AppProps {
  initialPath: string;
  profile?: User | null;
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

export function App(props: Readonly<AppProps>) {
  return (
    <QueryClientProvider client={queryClient}>
      <Router initialPath={props.initialPath}>
        <Sidebar />
        <Routes>
          <Route path="/" element={<Home profile={props.profile} />} />
          <Route path="/download-sources" element={<DownloadSources />} />
          <Route
            path="/profile"
            element={<Profile profile={props.profile} />}
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}
