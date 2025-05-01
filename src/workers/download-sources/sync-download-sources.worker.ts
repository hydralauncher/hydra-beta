import ky from "ky";

import {
  db,
  downloadSourcesTable,
  downloadsTable,
} from "@/services/dexie.service";
import { downloadSourceSchema } from "@/schemas/download-source.schema";
import { addNewDownloads } from "./helpers";
import { DownloadSourceStatus } from "./constants";
import { getSteamGamesByLetter } from "@/services";

self.onmessage = async () => {
  try {
    const downloadSources = await downloadSourcesTable.toArray();
    const existingDownloads = await downloadsTable
      .toArray()
      .then(
        (downloads) => new Set(downloads.map((download) => download.title))
      );

    for (const downloadSource of downloadSources) {
      const response = await ky.get(downloadSource.url).json();

      const source = await downloadSourceSchema.validate(response);

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
