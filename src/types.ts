import type { InferType } from "yup";

import type { downloadSourceSchema } from "@/schemas";

export type SteamGamesByLetterResponse = Record<
  string,
  { id: string; name: string }[]
>;

export type GameDownload = InferType<
  typeof downloadSourceSchema
>["downloads"][number] & {
  id: number;
  objectIds: string[];
  createdAt: Date;
  updatedAt: Date;
};
