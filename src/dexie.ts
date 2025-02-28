import { Dexie } from "dexie";

export type GameShop = "steam";

export interface HowLongToBeatCategory {
  title: string;
  duration: string;
  accuracy: string;
}

export interface HowLongToBeatEntry {
  id?: number;
  objectId: string;
  categories: HowLongToBeatCategory[];
  shop: GameShop;
  createdAt: Date;
  updatedAt: Date;
}

export interface CatalogueCache {
  id?: number;
  category: string;
  games: { objectId: string; shop: GameShop }[];
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

export interface SteamGamesByLetter {
  id?: number;
  letter: string;
  games: { id: string; name: string }[];
  createdAt: Date;
  updatedAt: Date;
}

export const db = new Dexie("Hydra");

db.version(2).stores({
  downloads: `++id, title, uris, fileSize, uploadDate, downloadSourceId, objectIds, createdAt, updatedAt`,
  downloadSources: `++id, url, name, etag, objectIds, downloadCount, status, fingerprint, createdAt, updatedAt`,
  howLongToBeatEntries: `++id, categories, [shop+objectId], createdAt, updatedAt`,
  steamGamesByLetter: `++id, letter, games, createdAt, updatedAt`,
});

export const downloadSourcesTable = db.table("downloadSources");
export const downloadsTable = db.table("downloads");
export const howLongToBeatEntriesTable = db.table("howLongToBeatEntries");
export const steamGamesByLetterTable = db.table("steamGamesByLetter");

db.open();
