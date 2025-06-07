import { DownloadSourceStatus } from "@/constants";
import { formatDownloadOptionName } from "@/helpers";
import { downloadSourceSchema } from "@/schemas";

import { api, DownloadSourcesService } from "@/services";
import { useDownloadSourcesStore } from "@/stores";
import type { DownloadOption } from "@/types";
import { useMutation } from "@tanstack/react-query";
import ky from "ky";
import { useCallback } from "react";
import type { InferType } from "yup";

export function useDownloadSources() {
  const { downloadSourceUrls, downloadSources, downloadOptionsByObjectId } =
    useDownloadSourcesStore();

  const { mutateAsync: importDownloadSource, isPending: isImporting } =
    useMutation({
      mutationFn: async (values: { url: string }) => {
        if (downloadSourceUrls.has(values.url)) {
          throw new Error("Download source already exists");
        }

        const response = await ky
          .get<InferType<typeof downloadSourceSchema>>(values.url)
          .json();

        const { name, downloads } =
          await downloadSourceSchema.validate(response);

        const results: DownloadOption[] = [];

        const objectIdsOnSource = new Set<string>();

        const steamGames = await DownloadSourcesService.getSteamGamesByLetter();

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

        await api
          .post("profile/download-sources", {
            json: {
              urls: [values.url],
            },
          })
          .json()
          .catch(() => {});

        DownloadSourcesService.addDownloadSource({
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
        DownloadSourcesService.removeDownloadSource(url);
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
          }).catch(() => {});
        }

        return downloadSources;
      },
    });

  const clearDownloadSources = useCallback(async () => {
    DownloadSourcesService.clearDownloadSources();
  }, []);

  return {
    importDownloadSource,
    removeDownloadSource: remove,
    clearDownloadSources,
    syncDownloadSources,
    downloadOptionsByObjectId,
    downloadSources,
    isRemoving,
    isImporting,
    isSyncing,
  };
}
