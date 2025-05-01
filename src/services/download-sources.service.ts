import type { SteamGamesByLetterResponse } from "@/types";

export const getSteamGamesByLetter = async () =>
  import("@/assets/steam-games-by-letter.json").then(
    (module) => module.default as SteamGamesByLetterResponse
  );
