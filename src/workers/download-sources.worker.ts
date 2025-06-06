import { getLevelInstance } from "@/browser-level";
import type { DownloadOptionWithDownloadSource, DownloadSource } from "@/types";
import { omit } from "lodash-es";

const level = getLevelInstance();

enum Topic {
  AddDownloadSource = "add-download-source",
  RemoveDownloadSource = "remove-download-source",
}

const mapDownloadSourcesByObjectId = (downloadSources: DownloadSource[]) => {
  const map: Map<string, DownloadOptionWithDownloadSource[]> = new Map();

  for (const downloadSource of downloadSources) {
    for (const downloadOption of downloadSource.downloadOptions) {
      for (const objectId of downloadOption.objectIds) {
        if (!map.has(objectId)) {
          map.set(objectId, []);
        }

        map.get(objectId)?.push({
          ...downloadOption,
          downloadSource: downloadSource.name,
        });
      }
    }
  }

  return map;
};

const getDownloadSourceUniqusUrls = (downloadSources: DownloadSource[]) => {
  const urls = new Set<string>();

  for (const downloadSource of downloadSources) {
    urls.add(downloadSource.url);
  }

  return urls;
};

const postMessage = async (downloadSources?: DownloadSource[]) => {
  if (!downloadSources) {
    return;
  }

  const downloadOptionsByObjectId = mapDownloadSourcesByObjectId(
    downloadSources as DownloadSource[]
  );
  const downloadSourceUrls = getDownloadSourceUniqusUrls(
    downloadSources as DownloadSource[]
  );

  self.postMessage({
    downloadOptionsByObjectId,
    downloadSourceUrls,
    downloadSources: downloadSources.map((downloadSource) =>
      omit(downloadSource, "downloadOptions")
    ),
  });
};

level.get("download-sources").then((downloadSources) => {
  postMessage(downloadSources as DownloadSource[]);
});

self.onmessage = async (event) => {
  const { topic } = event.data;

  const downloadSources = await level
    .get("download-sources")
    .then((downloadSources) => {
      if (!downloadSources) {
        return [];
      }

      return downloadSources as DownloadSource[];
    });

  if (topic === Topic.AddDownloadSource) {
    const { downloadSource } = event.data;
    downloadSources.push(downloadSource);
    await level.put("download-sources", downloadSources);

    postMessage(downloadSources);
    return;
  }

  if (topic === Topic.RemoveDownloadSource) {
    const { url } = event.data;
    const filteredSources = downloadSources.filter(
      (downloadSource) => downloadSource.url !== url
    );
    await level.put("download-sources", filteredSources);

    postMessage(filteredSources);
    return;
  }
};
