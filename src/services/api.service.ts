import ky from "ky";
import { fetch } from "@tauri-apps/plugin-http";

import { IS_DESKTOP } from "@/constants";

export const api = ky.create({
  prefixUrl: "https://api-staging.hydralauncher.gg",
  fetch: IS_DESKTOP ? fetch : undefined,
});
