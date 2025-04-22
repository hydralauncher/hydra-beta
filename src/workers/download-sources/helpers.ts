import {
  downloadsTable,
  downloadSourcesTable,
  steamGamesByLetterTable,
} from "../../services/dexie.service";

import { downloadSourceSchema } from "../../schemas/download-source.schema";
import type { InferType } from "yup";
import { formatDownloadOptionName } from "../../helpers/string-formatting";
import type { Download, SteamGamesByLetter } from "../../types";

export const getSteamGamesByLetter = async () => {
  const steamGames: SteamGamesByLetter[] =
    await steamGamesByLetterTable.toArray();

  return steamGames.reduce(
    (acc, game) => {
      return {
        ...acc,
        [game.letter]: game.games,
      };
    },
    {} as Record<string, SteamGamesByLetter["games"]>
  );
};

export const addNewDownloads = async (
  downloadSource: { id: number; name: string },
  downloads: InferType<typeof downloadSourceSchema>["downloads"],
  steamGames: Record<string, SteamGamesByLetter["games"]>
) => {
  const now = new Date();

  const results: Download[] = [];

  const objectIdsOnSource = new Set<string>();

  for (const download of downloads) {
    const formattedTitle = formatDownloadOptionName(download.title);
    const [firstLetter] = formattedTitle;
    const games = steamGames[firstLetter] || [];

    const gamesInSteam = games.filter((game) =>
      formattedTitle.startsWith(game.name)
    );

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
