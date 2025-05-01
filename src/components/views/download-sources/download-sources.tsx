import { useEffect, useState } from "react";

import type { DownloadSource } from "@/types";
import { downloadSourcesTable } from "@/services/dexie.service";
import { Button, Input } from "@/components/common";
import { useForm } from "react-hook-form";
import { Trash } from "@phosphor-icons/react";

import ImportDownloadSourceWorker from "@/workers/download-sources/import-download-source.worker?worker";
import RemoveDownloadSourceWorker from "@/workers/download-sources/remove-download-source.worker?worker";
import SyncDownloadSourcesWorker from "@/workers/download-sources/sync-download-sources.worker?worker";
import { useMutation } from "@tanstack/react-query";

interface FormValues {
  url: string;
}

export default function DownloadSources() {
  const [downloadSources, setDownloadSources] = useState<
    Required<DownloadSource>[]
  >([]);

  const { register, handleSubmit } = useForm<FormValues>();

  const { mutate: removeDownloadSource, isPending: isRemoving } = useMutation({
    mutationFn: (id: number) =>
      new Promise((resolve) => {
        const worker = new RemoveDownloadSourceWorker();

        worker.postMessage(id);

        worker.onmessage = () => {
          downloadSourcesTable.toArray().then(setDownloadSources);
          worker.terminate();
          resolve(true);
        };
      }),
  });

  const { mutate: importDownloadSource, isPending: isImporting } = useMutation({
    mutationFn: (values: FormValues) =>
      new Promise((resolve) => {
        const worker = new ImportDownloadSourceWorker();

        worker.postMessage(values.url);

        worker.onmessage = () => {
          downloadSourcesTable.toArray().then(setDownloadSources);
          worker.terminate();
          resolve(true);
        };
      }),
  });

  const { mutate: syncDownloadSources, isPending: isSyncing } = useMutation({
    mutationFn: () =>
      new Promise((resolve) => {
        const worker = new SyncDownloadSourcesWorker();

        worker.postMessage(true);

        worker.onmessage = (event) => {
          downloadSourcesTable.toArray().then(setDownloadSources);

          if (event.data.done) {
            resolve(true);
            worker.terminate();
          }
        };
      }),
  });

  useEffect(() => {
    downloadSourcesTable.toArray().then(setDownloadSources);
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit((values) => importDownloadSource(values))}>
        <Input type="text" {...register("url")} />
        <Button type="submit" loading={isImporting}>
          Import
        </Button>
      </form>

      <Button
        type="button"
        onClick={() => syncDownloadSources()}
        loading={isSyncing}
      >
        Sync
      </Button>

      <ul>
        {downloadSources.map((downloadSource) => (
          <li key={downloadSource.id}>
            <p>{downloadSource.name}</p>
            <p>{downloadSource.status}</p>
            <p>{downloadSource.downloadCount}</p>

            <Button
              type="button"
              variant="secondary"
              onClick={() => removeDownloadSource(downloadSource.id)}
              size="small"
              loading={isRemoving}
              icon={<Trash size={16} />}
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
