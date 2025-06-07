import { DownloadSourcesWorkerTopic } from "@/constants";
import { useDownloadSourcesStore } from "@/stores";
import type { DownloadSource, SteamGamesByLetterResponse } from "@/types";
import ky from "ky";

export class DownloadSourcesService {
  private static worker: Worker | null = null;

  public static getSteamGamesByLetter() {
    return ky
      .get("/assets/steam-games-by-letter.json")
      .json() as Promise<SteamGamesByLetterResponse>;
  }

  public static subscribeToWorker() {
    this.worker = new Worker(
      new URL("../workers/download-sources.worker.ts", import.meta.url)
    );

    this.worker.onmessage = (event) => {
      const {
        setDownloadOptionsByObjectId,
        setDownloadSourceUrls,
        setDownloadSources,
      } = useDownloadSourcesStore.getState();

      const { downloadOptionsByObjectId, downloadSourceUrls, downloadSources } =
        event.data;
      setDownloadOptionsByObjectId(downloadOptionsByObjectId);
      setDownloadSourceUrls(downloadSourceUrls);
      setDownloadSources(downloadSources);
    };
  }

  public static addDownloadSource(downloadSource: DownloadSource) {
    this.worker!.postMessage({
      topic: DownloadSourcesWorkerTopic.AddDownloadSource,
      downloadSource,
    });
  }

  public static removeDownloadSource(url: string) {
    this.worker!.postMessage({
      topic: DownloadSourcesWorkerTopic.RemoveDownloadSource,
      url,
    });
  }

  public static clearDownloadSources() {
    this.worker!.postMessage({
      topic: DownloadSourcesWorkerTopic.ClearDownloadSources,
    });
  }
}
