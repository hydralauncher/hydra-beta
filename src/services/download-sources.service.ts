import { IS_DESKTOP } from "@/constants";
import { db, steamGamesByLetterTable } from "@/dexie";
import type { SteamGamesByLetterResponse } from "@/types";

import axios from "axios";

export const getSteamGamesByLetter = async () => {
  if (IS_DESKTOP) {
    const { getClient } = await import("@tauri-apps/api/http");

    const client = await getClient();

    return client
      .get<SteamGamesByLetterResponse>(
        `${process.env.NEXT_PUBLIC_EXTERNAL_RESOURCES_URL}/steam-games-by-letter.json`
      )
      .then((response) => response.data);
  } else {
    return axios
      .get<SteamGamesByLetterResponse>("/api/steam-games-by-letter")
      .then((response) => response.data);
  }
};

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
