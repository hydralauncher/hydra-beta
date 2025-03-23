import { db, steamGamesByLetterTable } from "@/services/dexie.service";
import type { SteamGamesByLetterResponse } from "@/types";

import ky from "ky";

export const getSteamGamesByLetter = async () =>
  ky
    .get<SteamGamesByLetterResponse>("/assets/steam-games-by-letter.json")
    .json();

export const importSteamGamesByLetter = async (
  response: SteamGamesByLetterResponse
) => {
  const now = new Date();

  await db.transaction("rw", steamGamesByLetterTable, async () => {
    await steamGamesByLetterTable.clear();

    for (const letter in response) {
      await steamGamesByLetterTable.add({
        letter,
        games: response[letter],
        createdAt: now,
        updatedAt: now,
      });
    }
  });
};
