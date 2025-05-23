import { useForm } from "react-hook-form";
import { Button, Input, Modal, Typography } from "@/components";
import { useDownloadSources, useFormat } from "@/hooks";
import { ArrowsClockwise, PlusCircle, Trash } from "@phosphor-icons/react";
import { DownloadSource } from "@/stores";
import { useState } from "react";

export interface DownloadSourceProps {
  downloadSource: DownloadSource;
}

function DownloadSource({ downloadSource }: DownloadSourceProps) {
  const { removeDownloadSource, isRemoving, isSyncing } = useDownloadSources();
  const { formatNumber } = useFormat();

  const { name, url, downloadCount } = downloadSource;

  return (
    <div style={{ backgroundColor: "#0E0E0E", borderRadius: 8, padding: 16 }}>
      <Typography variant="h5">{name}</Typography>
      <Typography style={{ color: "rgba(255, 255, 255, 0.5)" }}>
        {formatNumber(downloadCount)} download options
      </Typography>

      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "flex-end",
          marginTop: 16,
        }}
      >
        <div style={{ flex: 1 }}>
          <Input readOnly value={url} label="Download source URL" />
        </div>

        <Button
          icon={<Trash size={16} />}
          variant="danger"
          onClick={() => removeDownloadSource(url)}
          disabled={isRemoving || isSyncing}
          loading={isRemoving}
        >
          Remove
        </Button>
      </div>
    </div>
  );
}

interface FormValues {
  url: string;
  shouldSync: boolean;
}

export default function DownloadSources() {
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      url: "",
      shouldSync: true,
    },
  });

  const {
    downloadSources,
    clearDownloadSources,
    importDownloadSource,
    isImporting,
    isSyncing,
  } = useDownloadSources();

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <Modal visible={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Typography variant="h5">Import Download Source</Typography>
        <Typography style={{ color: "rgba(255, 255, 255, 0.5)" }}>
          Insert the URL of the .json file
        </Typography>

        <form onSubmit={handleSubmit((values) => importDownloadSource(values))}>
          <Input type="text" {...register("url")} />
          <Button type="submit" loading={isImporting}>
            Import
          </Button>
        </form>
      </Modal>

      <Typography variant="h4">Download Sources</Typography>
      <Typography style={{ color: "rgba(255, 255, 255, 0.5)" }}>
        Hydra will fetch the download links from these sources. The source URL
        must be a direct link to a .json file containing the download the links.
      </Typography>

      <div>
        <Button icon={<ArrowsClockwise size={16} />} variant="secondary">
          Sync All
        </Button>

        <Button
          icon={<PlusCircle size={16} />}
          variant="secondary"
          onClick={() => setIsModalOpen(true)}
        >
          Add New
        </Button>

        <Button
          icon={<Trash size={16} />}
          variant="danger"
          onClick={() => clearDownloadSources()}
          disabled={downloadSources.length === 0 || isSyncing}
        >
          Clear All
        </Button>
      </div>

      <ul
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          listStyle: "none",
        }}
      >
        {downloadSources.map((downloadSource) => (
          <li key={downloadSource.url}>
            <DownloadSource
              key={downloadSource.url}
              downloadSource={downloadSource}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
