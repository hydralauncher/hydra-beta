export const IS_BROWSER =
  typeof self !== "undefined" &&
  typeof Window !== "undefined" &&
  self instanceof Window;

export const IS_DESKTOP = IS_BROWSER && "__TAURI_INTERNALS__" in self;

export enum DownloadSourceStatus {
  UpToDate = "UP_TO_DATE",
  Errored = "ERRORED",
}

export enum DownloadSourcesWorkerTopic {
  AddDownloadSource = "add-download-source",
  RemoveDownloadSource = "remove-download-source",
  ClearDownloadSources = "clear-download-sources",
}
