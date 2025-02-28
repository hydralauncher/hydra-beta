import { db } from "@/dexie";
import {
  downloadsTable,
  downloadSourcesTable,
  steamGamesByLetterTable,
} from "@/dexie";

import { SteamGamesByLetter } from "@/dexie";
import { downloadSourceSchema } from "@/schemas/download-source.schema";
import axios from "axios";
import { InferType } from "yup";
import { DownloadSourceStatus } from "../download-sources.worker";
import { formatDownloadOptionName } from "@/helpers/string-formatting";
import { GameDownload } from "@/types";
import { ImportDownloadSourceError } from "./constants";

const getSteamGamesByLetter = async () => {
  const steamGames = await steamGamesByLetterTable.toArray();

  return steamGames.reduce((acc, game) => {
    return {
      ...acc,
      [game.letter]: game.games,
    };
  }, {}) as Record<string, SteamGamesByLetter["games"]>;
};

const addNewDownloads = async (
  downloadSource: { id: number; name: string },
  downloads: InferType<typeof downloadSourceSchema>["downloads"],
  steamGames: Record<string, SteamGamesByLetter["games"]>
) => {
  const now = new Date();

  const results = [] as (Omit<GameDownload, "id"> & {
    downloadSourceId: number;
  })[];

  const objectIdsOnSource = new Set<string>();

  for (const download of downloads) {
    const formattedTitle = formatDownloadOptionName(download.title);
    const [firstLetter] = formattedTitle;
    const games = steamGames[firstLetter] || [];

    const gamesInSteam = games.filter((game) =>
      formattedTitle.startsWith(game.name)
    );

    if (gamesInSteam.length === 0) continue;

    for (const game of gamesInSteam) {
      objectIdsOnSource.add(String(game.id));
    }

    results.push({
      objectIds: gamesInSteam.map((game) => String(game.id)),
      title: download.title,
      uris: download.uris,
      fileSize: download.fileSize,
      uploadDate: download.uploadDate,
      downloadSourceId: downloadSource.id,
      createdAt: now,
      updatedAt: now,
    });
  }

  await downloadsTable.bulkAdd(results);

  await downloadSourcesTable.update(downloadSource.id, {
    objectIds: Array.from(objectIdsOnSource),
  });
};

self.onmessage = async (event: MessageEvent<string>) => {
  const response = await axios.get<InferType<typeof downloadSourceSchema>>(
    event.data
  );

  try {
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
          etag: response.headers["etag"],
          status: DownloadSourceStatus.UpToDate,
          downloadCount: downloads.length,
          createdAt: now,
          updatedAt: now,
        });

        const downloadSource = await downloadSourcesTable.get(id);

        await addNewDownloads(downloadSource, downloads, steamGames);
      }
    );
  } catch (error: unknown) {
    console.error(error);
    self.postMessage(ImportDownloadSourceError.INVALID_DOWNLOAD_SOURCE);
  }

  self.postMessage(true);
};
