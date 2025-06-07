import type { DownloadSourceStatus } from "@/constants";

export interface DownloadOption {
  objectIds: string[];
  title: string;
  uris: string[];
  fileSize: string;
  uploadDate: string;
}

export type DownloadOptionWithDownloadSource = DownloadOption & {
  downloadSource: string;
};

export interface DownloadSource {
  name: string;
  url: string;
  status: DownloadSourceStatus;
  downloadOptions: DownloadOption[];
  downloadCount: number;
  fingerprint: string;
}

export type LeanDownloadSource = Omit<DownloadSource, "downloadOptions">;
