import { Button, Input, Typography } from "@/components";
import { useDownloadSourcesStore } from "@/stores/download-sources.store";
import { ArrowsClockwise, PlusCircle, Trash } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";

export interface DownloadSourceProps {
  name: string;
  url: string;
}

function DownloadSource({ name, url }: DownloadSourceProps) {
  const { removeDownloadSource } = useDownloadSourcesStore();

  const { mutate: remove } = useMutation({
    mutationFn: async () => removeDownloadSource(name),
  });

  return (
    <div style={{ backgroundColor: "#0E0E0E", borderRadius: 8, padding: 16 }}>
      <Typography variant="h5">{name}</Typography>
      <Typography>1.082 download options</Typography>

      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        <Input readOnly value={url} />
        <Button
          icon={<Trash size={16} />}
          variant="danger"
          onClick={() => remove()}
        >
          Remove
        </Button>
      </div>
    </div>
  );
}

export default function DownloadSources() {
  const { downloadSources, clearDownloadSources } = useDownloadSourcesStore();

  return (
    <div>
      <Typography variant="h4">Download Sources</Typography>
      <Typography>
        Hydra will fetch the download links from these sources. The source URL
        must be a direct link to a .json file containing the download the links.
      </Typography>

      <div>
        <Button icon={<ArrowsClockwise size={16} />} variant="secondary">
          Sync All
        </Button>

        <Button icon={<PlusCircle size={16} />} variant="secondary">
          Add New
        </Button>

        <Button
          icon={<Trash size={16} />}
          variant="danger"
          onClick={() => clearDownloadSources()}
          disabled={downloadSources.length === 0}
        >
          Clear All
        </Button>
      </div>

      {downloadSources.map((downloadSource) => (
        <DownloadSource
          key={downloadSource.name}
          name={downloadSource.name}
          url={downloadSource.url}
        />
      ))}
    </div>
  );
}
