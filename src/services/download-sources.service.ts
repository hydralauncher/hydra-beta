import { db, steamGamesByLetterTable } from "@/dexie";
import type { SteamGamesByLetterResponse } from "@/types";

import axios from "axios";

export const getSteamGamesByLetter = async () =>
  axios
    .get<SteamGamesByLetterResponse>("/assets/steam-games-by-letter.json")
    .then((response) => response.data);

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
