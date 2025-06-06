import { SourceAnchor, Typography } from "@/components";
import { CatalogueGame } from "@/types";
import { useDownloadSources } from "@/hooks";
import Image from "next/image";
import Link from "next/link";
import { toSlug } from "@/helpers";
import { useEffect, useState } from "react";

interface CardProps {
  game: CatalogueGame;
}

export default function Card({ game }: Readonly<CardProps>) {
  const { getDownloadOptionsByObjectId } = useDownloadSources();

  const [uniqueDownloadSources, setUniqueDownloadSources] = useState<string[]>(
    []
  );

  useEffect(() => {
    getDownloadOptionsByObjectId(game.objectId).then((downloadOptions) => {
      const uniqueDownloadSources = Array.from(
        new Set(downloadOptions.map((option) => option.downloadSource))
      );
      setUniqueDownloadSources(uniqueDownloadSources);
    });
  }, [getDownloadOptionsByObjectId, game.objectId]);

  return (
    <div className="catalogue-card">
      <div className="catalogue-card__image">
        <Link href={`/game/${game.objectId}/${toSlug(game.title)}`}>
          <Image
            src={game.libraryImageUrl}
            alt={game.title}
            objectFit="fill"
            fill
          />
        </Link>
      </div>

      <div className="catalogue-card__content">
        <div className="catalogue-card__content__title">
          <Typography
            variant="label"
            className="catalogue-card__content__title-text"
          >
            <Link href={`/game/${game.objectId}/${toSlug(game.title)}`}>
              {game.title}
            </Link>
          </Typography>
        </div>

        <div className="catalogue-card__content__genres">
          <Typography
            variant="body"
            className="catalogue-card__content__genres-text"
          >
            {game.genres.slice(0, 3).join(", ")}
          </Typography>
        </div>
      </div>

      <div className="catalogue-card__download-sources">
        {uniqueDownloadSources
          ?.slice(0, 3)
          .map((source) => <SourceAnchor title={source} key={source} />)}

        {uniqueDownloadSources?.length && uniqueDownloadSources.length > 3 && (
          <SourceAnchor title={`+${uniqueDownloadSources.length - 3}`} />
        )}
      </div>
    </div>
  );
}
