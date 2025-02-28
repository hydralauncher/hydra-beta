import axios from "axios";

import type { SteamGamesByLetterResponse } from "@/types";

export async function GET() {
  const steamGamesByLetter = await axios
    .get<SteamGamesByLetterResponse>(
      `${process.env.NEXT_PUBLIC_EXTERNAL_RESOURCES_URL}/steam-games-by-letter.json`
    )
    .then((response) => response.data);

  return Response.json(steamGamesByLetter);
}
