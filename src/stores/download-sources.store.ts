import type {
  DownloadOptionWithDownloadSource,
  LeanDownloadSource,
} from "@/types";
import { create } from "zustand";

export interface DownloadSourcesState {
  downloadOptionsByObjectId: Map<string, DownloadOptionWithDownloadSource[]>;
  downloadSourceUrls: Set<string>;
  downloadSources: LeanDownloadSource[];
  setDownloadSources: (downloadSources: LeanDownloadSource[]) => void;
  setDownloadOptionsByObjectId: (
    downloadOptionsByObjectId: Map<string, DownloadOptionWithDownloadSource[]>
  ) => void;
  setDownloadSourceUrls: (downloadSourceUrls: Set<string>) => void;
}

export const useDownloadSourcesStore = create<DownloadSourcesState>()(
  (set) => ({
    downloadSources: [],
    downloadOptionsByObjectId: new Map(),
    downloadSourceUrls: new Set(),
    setDownloadSources: (downloadSources) => set({ downloadSources }),
    setDownloadOptionsByObjectId: (downloadOptionsByObjectId) =>
      set({ downloadOptionsByObjectId }),
    setDownloadSourceUrls: (downloadSourceUrls) => set({ downloadSourceUrls }),
  })
);
