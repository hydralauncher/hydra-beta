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

export interface SteamGenre {
  id: string;
  name: string;
}

export interface SteamScreenshot {
  id: number;
  path_thumbnail: string;
  path_full: string;
}

export interface SteamVideoSource {
  max: string;
  "480": string;
}

export interface SteamMovies {
  id: number;
  mp4: SteamVideoSource;
  webm: SteamVideoSource;
  thumbnail: string;
  name: string;
  highlight: boolean;
}

export interface SteamAppDetails {
  name: string;
  steam_appid: number;
  detailed_description: string;
  about_the_game: string;
  short_description: string;
  publishers: string[];
  genres: SteamGenre[];
  movies?: SteamMovies[];
  screenshots?: SteamScreenshot[];
  pc_requirements: {
    minimum: string;
    recommended: string;
  };
  mac_requirements: {
    minimum: string;
    recommended: string;
  };
  linux_requirements: {
    minimum: string;
    recommended: string;
  };
  release_date: {
    coming_soon: boolean;
    date: string;
  };
  content_descriptors: {
    ids: number[];
  };
}

export interface User {
  id: string;
  displayName: string;
  profileImageUrl: string;
}

export interface TrendingGame {
  id: number;
  documentId: string;
  uri: string;
  background: string;
  logo: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  locale: string;
}

export interface CatalogueGame {
  title: string;
  shop: GameShop;
  objectId: string;
}
