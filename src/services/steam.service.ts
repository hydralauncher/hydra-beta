import ky from "ky";

import type { SteamAppDetails } from "@/types";

export interface SteamAppDetailsResponse {
  [key: string]: {
    success: boolean;
    data: SteamAppDetails;
  };
}

export const getSteamAppDetails = async (
  objectId: string,
  language: string
) => {
  try {
    const searchParams = new URLSearchParams({
      appids: objectId,
      l: language,
    });

    const response = await ky
      .get<SteamAppDetailsResponse>(
        `http://store.steampowered.com/api/appdetails?${searchParams.toString()}`
      )
      .json();

    if (response[objectId].success) {
      const data = response[objectId].data;
      return {
        ...data,
        objectId,
      };
    }

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
