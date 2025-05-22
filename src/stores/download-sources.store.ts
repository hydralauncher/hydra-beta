import { create } from "zustand";

import { createJSONStorage, persist } from "zustand/middleware";
import { levelStorage } from "./level-storage";

export enum ImportDownloadSourceError {
  DOWNLOAD_SOURCE_ALREADY_EXISTS = "DOWNLOAD_SOURCE_ALREADY_EXISTS",
  INVALID_DOWNLOAD_SOURCE = "INVALID_DOWNLOAD_SOURCE",
}

export enum DownloadSourceStatus {
  UpToDate = "UP_TO_DATE",
  Errored = "ERRORED",
}

export interface DownloadOption {}

export interface DownloadSource {
  name: string;
  status: DownloadSourceStatus;
  downloadOptions: DownloadOption[];
  downloadCount: number;
}

export interface DownloadSourcesState {
  downloadSources: DownloadSource[];
  setDownloadSources: (downloadSources: DownloadSource[]) => void;
  addDownloadSource: (downloadSource: DownloadSource) => void;
  removeDownloadSource: (name: string) => void;
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
      removeDownloadSource: (name) =>
        set((state) => ({
          downloadSources: state.downloadSources.filter(
            (downloadSource) => downloadSource.name !== name
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
