import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { DownloadSources, Home, Profile } from "@/components";

const queryClient = new QueryClient();

export interface AppProps {
  initialPath: string;
}

function Router({
  children,
  initialPath,
}: {
  children: React.ReactNode;
  initialPath: string;
}) {
  if (typeof window === "undefined") {
    return (
      <MemoryRouter initialEntries={[initialPath]}>{children}</MemoryRouter>
    );
  }

  return <BrowserRouter>{children}</BrowserRouter>;
}

export function App(props: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Router initialPath={props.initialPath}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/download-sources" element={<DownloadSources />} />
          <Route path="/profile" element={<Profile {...props} />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}
