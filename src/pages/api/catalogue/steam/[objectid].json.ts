import { getSteamAppDetails } from "@/services/steam.service";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ params }) => {
  const objectId = params["objectid"]!;

  const response = await getSteamAppDetails(objectId, "en");

  return new Response(JSON.stringify(response));
};
