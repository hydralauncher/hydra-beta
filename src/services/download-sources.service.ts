import type { SteamGamesByLetterResponse } from "@/types";
import ky from "ky";

export const getSteamGamesByLetter = async () => {
  return ky
    .get("/assets/steam-games-by-letter.json")
    .json() as Promise<SteamGamesByLetterResponse>;
};
