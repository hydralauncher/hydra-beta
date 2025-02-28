import { db, downloadSourcesTable, downloadsTable } from "@/dexie";

self.onmessage = async (event: MessageEvent<number>) => {
  await db.transaction("rw", downloadsTable, downloadSourcesTable, async () => {
    await downloadsTable.where({ downloadSourceId: event.data }).delete();
    await downloadSourcesTable.where({ id: event.data }).delete();
  });

  self.postMessage(true);
};
