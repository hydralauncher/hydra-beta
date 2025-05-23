import { create } from "zustand";

import { createJSONStorage, persist } from "zustand/middleware";
import { levelStorage } from "./level-storage";
import { DownloadSourceStatus } from "@/constants";

export interface DownloadOption {
  objectIds: string[];
  title: string;
  uris: string[];
  fileSize: string;
  uploadDate: string;
}

export interface DownloadSource {
  name: string;
  url: string;
  status: DownloadSourceStatus;
  downloadOptions: DownloadOption[];
  downloadCount: number;
  fingerprint: string;
}

export interface DownloadSourcesState {
  downloadSources: DownloadSource[];
  setDownloadSources: (downloadSources: DownloadSource[]) => void;
  addDownloadSource: (downloadSource: DownloadSource) => void;
  removeDownloadSource: (url: string) => void;
  clearDownloadSources: () => void;
}

export const useDownloadSourcesStore = create<DownloadSourcesState>()(
  persist(
    (set) => ({
      downloadSources: [],
      setDownloadSources: (downloadSources) => set({ downloadSources }),
      addDownloadSource: (downloadSource) =>
        set((state) => ({
          downloadSources: [...state.downloadSources, downloadSource],
        })),
      removeDownloadSource: (url) =>
        set((state) => ({
          downloadSources: state.downloadSources.filter(
            (downloadSource) => downloadSource.url !== url
          ),
        })),
      clearDownloadSources: () =>
        set(() => ({
          downloadSources: [],
        })),
    }),
    {
      name: "download-sources",
      storage: createJSONStorage(() => levelStorage),
    }
  )
);
