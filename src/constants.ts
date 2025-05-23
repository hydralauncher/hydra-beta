export const IS_BROWSER = typeof window !== "undefined";

export const IS_DESKTOP = IS_BROWSER && "__TAURI_INTERNALS__" in window;

export enum DownloadSourceStatus {
  UpToDate = "UP_TO_DATE",
  Errored = "ERRORED",
}
