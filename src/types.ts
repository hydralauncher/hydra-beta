import { DownloadSourceStatus } from "./workers/download-sources/constants";

export type GameShop = "steam";

export interface DexieModel {
  id?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Download extends DexieModel {
  title: string;
  uris: string[];
  fileSize: string;
  uploadDate: string;
  downloadSourceId: number;
  objectIds: string[];
}

export interface DownloadSource extends DexieModel {
  url: string;
  name: string;
  /* etag is only available in desktop app */
  etag?: string;
  objectIds: string[];
  downloadCount: number;
  status: DownloadSourceStatus;
  fingerprint: string;
}

export interface HowLongToBeatCategory {
  title: string;
  duration: string;
  accuracy: string;
}

export interface HowLongToBeatEntry extends DexieModel {
  objectId: string;
  categories: HowLongToBeatCategory[];
  shop: GameShop;
}

export interface SteamGamesByLetter extends DexieModel {
  letter: string;
  games: { id: string; name: string }[];
}

export type SteamGamesByLetterResponse = Record<
  string,
  { id: string; name: string }[]
>;
