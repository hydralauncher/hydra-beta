import {
  db,
  downloadSourcesTable,
  downloadsTable,
  SteamGamesByLetter,
  steamGamesByLetterTable,
} from "@/dexie";

import type { InferType } from "yup";
import axios, { AxiosError, AxiosHeaders } from "axios";

import { downloadSourceSchema } from "@/schemas";
import { GameDownload } from "@/types";
import { formatDownloadOptionName } from "@/helpers/string-formatting";

export enum DownloadSourceStatus {
  UpToDate,
  Errored,
}

type Payload =
  | ["IMPORT_DOWNLOAD_SOURCE", string]
  | ["DELETE_DOWNLOAD_SOURCE", number]
  | ["VALIDATE_DOWNLOAD_SOURCE", string]
  | ["SYNC_DOWNLOAD_SOURCES", string];

self.onmessage = async (event: MessageEvent<Payload>) => {
  const [type, data] = event.data;

  if (type === "VALIDATE_DOWNLOAD_SOURCE") {
    const response =
      await axios.get<InferType<typeof downloadSourceSchema>>(data);

    const { name } = await downloadSourceSchema.validate(response.data);

    self.postMessage([
      "VALIDATE_DOWNLOAD_SOURCE_RESPONSE",
      {
        name,
        etag: response.headers["etag"],
        downloadCount: response.data.downloads.length,
      },
    ]);
  }

  if (type === "SYNC_DOWNLOAD_SOURCES") {
    let newRepacksCount = 0;

    const downloadSources = await downloadSourcesTable.toArray();
    const existingRepacks = await downloadsTable.toArray();

    for (const downloadSource of downloadSources) {
      const headers = new AxiosHeaders();

      if (downloadSource.etag) {
        headers.set("If-None-Match", downloadSource.etag);
      }

      try {
        const response = await axios.get(downloadSource.url, {
          headers,
        });

        const source = await downloadSourceSchema.validate(response.data);

        const steamGames = await getSteamGamesByLetter();

        await db.transaction(
          "rw",
          downloadsTable,
          downloadSourcesTable,
          async () => {
            await downloadSourcesTable.update(downloadSource.id, {
              etag: response.headers["etag"],
              downloadCount: source.downloads.length,
              status: DownloadSourceStatus.UpToDate,
            });

            const repacks = source.downloads.filter(
              (download) =>
                !existingRepacks.some(
                  (repack) => repack.title === download.title
                )
            );

            await addNewDownloads(downloadSource, repacks, steamGames);

            newRepacksCount += repacks.length;
          }
        );

        self.postMessage(["SYNC_DOWNLOAD_SOURCES_RESPONSE", newRepacksCount]);
      } catch (err: unknown) {
        const isNotModified = (err as AxiosError).response?.status === 304;

        await downloadSourcesTable.update(downloadSource.id, {
          status: isNotModified
            ? DownloadSourceStatus.UpToDate
            : DownloadSourceStatus.Errored,
        });
      }
    }
  }
};
