export const createImportDownloadSourceWorker = () =>
  new Worker(
    new URL(
      "./download-sources/import-download-source.worker.ts",
      import.meta.url
    )
  );

export const createSyncDownloadSourcesWorker = () =>
  new Worker(
    new URL(
      "./download-sources/sync-download-sources.worker.ts",
      import.meta.url
    )
  );

export const createRemoveDownloadSourceWorker = () =>
  new Worker(
    new URL(
      "./download-sources/remove-download-source.worker.ts",
      import.meta.url
    )
  );
