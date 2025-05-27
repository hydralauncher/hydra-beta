import { DownloadSourceStatus } from "@/constants";
import { formatDownloadOptionName } from "@/helpers";
import { downloadSourceSchema } from "@/schemas";

import { api, getSteamGamesByLetter } from "@/services";
import { DownloadOption, useDownloadSourcesStore } from "@/stores";
import { useMutation } from "@tanstack/react-query";
import ky from "ky";
import { useMemo } from "react";
import type { InferType } from "yup";

export function useDownloadSources() {
  const {
    addDownloadSource,
    removeDownloadSource,
    clearDownloadSources,
    downloadSources,
  } = useDownloadSourcesStore();

  const downloadSourcesUrls = useMemo(() => {
    const urls = new Set<string>();

    for (const downloadSource of downloadSources) {
      urls.add(downloadSource.url);
    }

    return urls;
  }, [downloadSources]);

  const { mutateAsync: importDownloadSource, isPending: isImporting } =
    useMutation({
      mutationFn: async (values: { url: string; shouldSync: boolean }) => {
        if (downloadSourcesUrls.has(values.url)) {
          throw new Error("Download source already exists");
        }

        const response = await ky
          .get<InferType<typeof downloadSourceSchema>>(values.url)
          .json();

        const { name, downloads } =
          await downloadSourceSchema.validate(response);

        const results: DownloadOption[] = [];

        const objectIdsOnSource = new Set<string>();

        const steamGames = await getSteamGamesByLetter();

        for (const download of downloads) {
          const formattedTitle = formatDownloadOptionName(download.title);
          const [firstLetter] = formattedTitle;
          const games = steamGames[firstLetter] || [];

          const gamesInSteam = games.filter((game) =>
            formattedTitle.startsWith(game.name)
          );

          for (const game of gamesInSteam) {
            objectIdsOnSource.add(String(game.id));
          }

          results.push({
            objectIds: gamesInSteam.map((game) => String(game.id)),
            title: download.title,
            uris: download.uris,
            fileSize: download.fileSize,
            uploadDate: download.uploadDate,
          });
        }

        const { fingerprint } = await api
          .put<{ fingerprint: string }>("download-sources", {
            json: {
              objectIds: Array.from(objectIdsOnSource),
            },
          })
          .json();

        if (values.shouldSync) {
          await api
            .post("profile/download-sources", {
              json: {
                urls: [values.url],
              },
            })
            .json();
        }

        addDownloadSource({
          name,
          url: values.url,
          status: DownloadSourceStatus.UpToDate,
          downloadOptions: results,
          downloadCount: downloads.length,
          fingerprint,
        });
      },
    });

  const { mutate: remove, isPending: isRemoving } = useMutation({
    mutationFn: async (url: string) => {
      try {
        await api.delete(`profile/download-sources?url=${url}`).json();
      } finally {
        removeDownloadSource(url);
      }
    },
  });

  const { mutateAsync: syncDownloadSources, isPending: isSyncing } =
    useMutation({
      mutationFn: async () => {
        const downloadSources = await api
          .get<{ url: string }[]>("profile/download-sources")
          .json();

        for (const downloadSource of downloadSources) {
          await importDownloadSource({
            url: downloadSource.url,
            shouldSync: false,
          }).catch(() => {});
        }

        return downloadSources;
      },
    });

  const downloadSourcesByObjectId = useMemo(() => {
    const map = new Map<
      string,
      (DownloadOption & { downloadSource: string })[]
    >();

    for (const downloadSource of downloadSources) {
      for (const downloadOption of downloadSource.downloadOptions) {
        for (const objectId of downloadOption.objectIds) {
          if (!map.has(objectId)) {
            map.set(objectId, []);
          }

          map.get(objectId)?.push({
            ...downloadOption,
            downloadSource: downloadSource.name,
          } as DownloadOption & { downloadSource: string });
        }
      }
    }

    return map;
  }, [downloadSources]);

  const uniqueDownloadSourcesByObjectId = useMemo(() => {
    return new Map(
      Array.from(downloadSourcesByObjectId.entries()).map(
        ([objectId, options]) => [
          objectId,
          Array.from(new Set(options.map((opt) => opt.downloadSource))),
        ]
      )
    );
  }, [downloadSourcesByObjectId]);

  return {
    importDownloadSource,
    removeDownloadSource: remove,
    clearDownloadSources,
    syncDownloadSources,
    downloadSources,
    isRemoving,
    isImporting,
    isSyncing,
    downloadSourcesByObjectId,
    uniqueDownloadSourcesByObjectId,
  };
}
