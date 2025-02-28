import { db, downloadsTable, downloadSourcesTable } from "@/dexie";

import { downloadSourceSchema } from "@/schemas/download-source.schema";
import axios from "axios";
import { DownloadSourceStatus, ImportDownloadSourceError } from "./constants";
import type { InferType } from "yup";
import { addNewDownloads, getSteamGamesByLetter } from "./helpers";

self.onmessage = async (event: MessageEvent<string>) => {
  try {
    const response = await axios.get<InferType<typeof downloadSourceSchema>>(
      event.data
    );

    const { name, downloads } = await downloadSourceSchema.validate(
      response.data
    );

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
