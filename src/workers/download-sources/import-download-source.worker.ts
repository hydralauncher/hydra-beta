import {
  db,
  downloadsTable,
  downloadSourcesTable,
} from "../../services/dexie.service";

import { downloadSourceSchema } from "../../schemas/download-source.schema";
import ky from "ky";
import { DownloadSourceStatus, ImportDownloadSourceError } from "./constants";
import type { InferType } from "yup";
import { addNewDownloads, getSteamGamesByLetter } from "./helpers";

self.onmessage = async (event: MessageEvent<string>) => {
  try {
    const response = await ky
      .get<InferType<typeof downloadSourceSchema>>(event.data)
      .json();

    const { name, downloads } = await downloadSourceSchema.validate(response);

    const downloadSources = await downloadSourcesTable
      .where("url")
      .equals(event.data)
      .toArray();

    if (downloadSources.length > 0) {
      self.postMessage(
        ImportDownloadSourceError.DOWNLOAD_SOURCE_ALREADY_EXISTS
      );
      return;
    }

    const steamGames = await getSteamGamesByLetter();

    await db.transaction(
      "rw",
      downloadsTable,
      downloadSourcesTable,
      async () => {
        const now = new Date();

        const id = await downloadSourcesTable.add({
          url: event.data,
          name,
          status: DownloadSourceStatus.UpToDate,
          downloadCount: downloads.length,
          createdAt: now,
          updatedAt: now,
        });

        const downloadSource = await downloadSourcesTable.get(id);

        await addNewDownloads(downloadSource, downloads, steamGames);
      }
    );

    self.postMessage(true);
  } catch (error: unknown) {
    console.error(error);

    self.postMessage(ImportDownloadSourceError.INVALID_DOWNLOAD_SOURCE);
  }
};
