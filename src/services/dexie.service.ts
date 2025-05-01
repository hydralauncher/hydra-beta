import { Dexie } from "dexie";

export const db = new Dexie("Hydra");

db.version(1).stores({
  downloads: `++id, title, uris, fileSize, uploadDate, downloadSourceId, objectIds, createdAt, updatedAt`,
  downloadSources: `++id, url, name, objectIds, downloadCount, status, fingerprint, createdAt, updatedAt`,
  howLongToBeatEntries: `++id, categories, [shop+objectId], createdAt, updatedAt`,
});

export const downloadSourcesTable = db.table("downloadSources");
export const downloadsTable = db.table("downloads");
export const howLongToBeatEntriesTable = db.table("howLongToBeatEntries");

db.open();
