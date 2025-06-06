import { DownloadSourceStatus } from "@/constants";
import { formatDownloadOptionName } from "@/helpers";
import { downloadSourceSchema } from "@/schemas";

import { api, getSteamGamesByLetter } from "@/services";
import { levelStorage } from "@/stores/level-storage";
import { useMutation } from "@tanstack/react-query";
import ky from "ky";
import { useCallback } from "react";
import type { InferType } from "yup";

export interface DownloadOption {
  objectIds: string[];
  title: string;
  uris: string[];
  fileSize: string;
  uploadDate: string;
}

export type DownloadOptionWithDownloadSource = DownloadOption & {
  downloadSource: string;
};

export interface DownloadSource {
  name: string;
  url: string;
  status: DownloadSourceStatus;
  downloadOptions: DownloadOption[];
  downloadCount: number;
  fingerprint: string;
}

export function useDownloadSources() {
  const mapDownloadSourcesByObjectId = useCallback(
    (downloadSources: DownloadSource[]) => {
      const map: Record<
        string,
        (DownloadOption & { downloadSource: string })[]
      > = {};

      for (const downloadSource of downloadSources) {
        for (const downloadOption of downloadSource.downloadOptions) {
          for (const objectId of downloadOption.objectIds) {
            if (!map[objectId]) {
              map[objectId] = [];
            }

            map[objectId].push({
              ...downloadOption,
              downloadSource: downloadSource.name,
            } as DownloadOption & { downloadSource: string });
          }
        }
      }

      return map;
    },
    []
  );

  const writeDownloadSources = useCallback(
    async (downloadSources: DownloadSource[]) => {
      await levelStorage.setItem("download-sources", downloadSources);

      const downloadSourcesByObjectId =
        mapDownloadSourcesByObjectId(downloadSources);

      for (const objectId in downloadSourcesByObjectId) {
        await levelStorage.setItem(
          `download-sources:${objectId}`,
          downloadSourcesByObjectId[objectId]
        );
      }
    },
    [mapDownloadSourcesByObjectId]
  );

  const getDownloadSources = useCallback(async () => {
    return await levelStorage
      .getItem<DownloadSource[]>("download-sources")
      .then((downloadSources) => downloadSources ?? []);
  }, []);

  const getDownloadSourcesUrls = useCallback(
    (downloadSources: DownloadSource[]) => {
      const urls = new Set<string>();

      for (const downloadSource of downloadSources) {
        urls.add(downloadSource.url);
      }

      return urls;
    },
    []
  );

  const { mutateAsync: importDownloadSource, isPending: isImporting } =
    useMutation({
      mutationFn: async (values: { url: string; shouldSync: boolean }) => {
        const downloadSources = await getDownloadSources();
        const downloadSourcesUrls = getDownloadSourcesUrls(downloadSources);

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

        await writeDownloadSources([
          ...downloadSources,
          {
            name,
            url: values.url,
            status: DownloadSourceStatus.UpToDate,
            downloadOptions: results,
            downloadCount: downloads.length,
            fingerprint,
          },
        ]);
      },
    });

  const { mutate: remove, isPending: isRemoving } = useMutation({
    mutationFn: async (url: string) => {
      try {
        await api.delete(`profile/download-sources?url=${url}`).json();
      } finally {
        const downloadSources = await getDownloadSources();
        await writeDownloadSources(
          downloadSources.filter((downloadSource) => downloadSource.url !== url)
        );
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

  const getDownloadOptionsByObjectId = useCallback(
    async (objectId: string): Promise<DownloadOptionWithDownloadSource[]> => {
      const downloadOptions = await levelStorage.getItem(
        `download-sources:${objectId}`
      );

      return (downloadOptions ?? []) as DownloadOptionWithDownloadSource[];
    },
    []
  );

  const clearDownloadSources = useCallback(async () => {
    await levelStorage.removeItem("download-sources");
    // how to clear all the download sources by object id?
  }, []);

  return {
    importDownloadSource,
    removeDownloadSource: remove,
    clearDownloadSources,
    syncDownloadSources,
    getDownloadSources,
    getDownloadOptionsByObjectId,
    isRemoving,
    isImporting,
    isSyncing,
  };
}
