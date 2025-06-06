import { SourceAnchor, Typography } from "@/components";
import { CatalogueGame } from "@/types";
import { useDownloadSources } from "@/hooks";
import Image from "next/image";
import Link from "next/link";
import { toSlug } from "@/helpers";
import { useMemo } from "react";

interface CardProps {
  game: CatalogueGame;
}

export default function Card({ game }: Readonly<CardProps>) {
  const { downloadOptionsByObjectId } = useDownloadSources();

  const uniqueDownloadSources = useMemo(() => {
    return Array.from(
      new Set(
        downloadOptionsByObjectId
          .get(game.objectId)
          ?.map((option) => option.downloadSource)
      )
    );
  }, [downloadOptionsByObjectId, game.objectId]);

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

        {(uniqueDownloadSources?.length ?? 0) > 3 && (
          <SourceAnchor title={`+${uniqueDownloadSources.length - 3}`} />
        )}
      </div>
    </div>
  );
}
