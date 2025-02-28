import axios from "axios";

import { db, downloadSourcesTable, downloadsTable } from "@/dexie";
import { downloadSourceSchema } from "@/schemas";
import { getSteamGamesByLetter, addNewDownloads } from "./helpers";
import { DownloadSourceStatus } from "./constants";

self.onmessage = async () => {
  try {
    const downloadSources = await downloadSourcesTable.toArray();
    const existingDownloads = await downloadsTable
      .toArray()
      .then(
        (downloads) => new Set(downloads.map((download) => download.title))
      );

    for (const downloadSource of downloadSources) {
      const response = await axios.get(downloadSource.url);

      const source = await downloadSourceSchema.validate(response.data);

      const steamGames = await getSteamGamesByLetter();

      await db.transaction(
        "rw",
        downloadsTable,
        downloadSourcesTable,
        async () => {
          await downloadSourcesTable.update(downloadSource.id, {
            downloadCount: source.downloads.length,
            status: DownloadSourceStatus.UpToDate,
          });

          const downloads = source.downloads.filter((download) => {
            return !existingDownloads.has(download.title);
          });

          await addNewDownloads(downloadSource, downloads, steamGames);

          self.postMessage({
            downloadSourceId: downloadSource.id,
            downloads,
            done: false,
          });
        }
      );
    }
  } finally {
    self.postMessage({ done: true });
  }
};
