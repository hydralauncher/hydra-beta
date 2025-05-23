import { Download, Calendar } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";

import { Modal, Typography, ScrollArea, Tooltip, Input } from "@/components";
import { useDate, useSearch } from "@/hooks";
import { DownloadOption } from "@/stores/download-sources.store";

export interface DownloadOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  downloadOptions: (DownloadOption & { downloadSource: string })[];
  backgroundImageUrl: string;
}

export function DownloadOptionsModal({
  visible,
  onClose,
  downloadOptions,
  backgroundImageUrl,
}: DownloadOptionsModalProps) {
  const { search, setSearch, filteredItems } = useSearch(downloadOptions, [
    "title",
    "downloadSource",
  ]);

  const { formatDistance, formatDate } = useDate();

  return (
    <Modal visible={visible} onClose={onClose}>
      <div
        className="download-options__header"
        style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      >
        <div className="download-options__overlay">
          <Typography variant="h5">Download Options</Typography>
          <Typography>Pick a download option from your sources</Typography>
        </div>
      </div>

      <ScrollArea>
        <div className="download-options__content">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for a download option..."
          />

          <ul className="download-options__list">
            <AnimatePresence>
              {filteredItems.map((downloadOption) => (
                <motion.li
                  key={downloadOption.title}
                  className="download-options__item"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    type="button"
                    className="download-options__button"
                    onClick={() =>
                      window.open(downloadOption.uris[0], "_blank")
                    }
                  >
                    <div className="download-options__info">
                      <Typography>{downloadOption.title}</Typography>
                      <Typography className="download-options__source">
                        {downloadOption.downloadSource}
                      </Typography>
                    </div>

                    <div className="download-options__meta">
                      <Typography className="download-options__filesize">
                        <Download />
                        {downloadOption.fileSize}
                      </Typography>

                      <Tooltip content={formatDate(downloadOption.uploadDate)}>
                        <Typography className="download-options__date">
                          <Calendar />
                          {formatDistance(
                            downloadOption.uploadDate,
                            new Date(),
                            { addSuffix: true }
                          )}
                        </Typography>
                      </Tooltip>
                    </div>
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </ScrollArea>
    </Modal>
  );
}
