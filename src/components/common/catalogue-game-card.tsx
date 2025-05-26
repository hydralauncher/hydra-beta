import Image from "next/image";
import { Typography } from "./typography/typography";
import { SourceAnchor } from "./source-anchor/source-anchor";
import Link from "next/link";

export interface CatalogueGameCardProps {
  title: string;
  image: string;
  genres: string[];
  sources?: string[];
  href: string;
}

export function CatalogueGameCard({
  title,
  image,
  genres,
  sources = ["FitGirl", "SteamRip"],
  href,
}: Readonly<CatalogueGameCardProps>) {
  return (
    <div className="catalogue-game-card">
      <div className="catalogue-game-card__image">
        <Link href={href}>
          <Image src={image} alt={title} fill objectFit="fill" />
        </Link>
      </div>
      <div className="catalogue-game-card__content">
        <div className="catalogue-game-card__content__info">
          <Link href={href}>
            <Typography
              variant="label"
              className="catalogue-game-card__content__info__title"
            >
              {title}
            </Typography>
          </Link>

          <Typography
            variant="label"
            className="catalogue-game-card__content__info__tags"
          >
            {genres.length > 3
              ? `${genres.slice(0, 3).join(", ")} +${genres.length - 3}`
              : genres.join(", ")}
          </Typography>
        </div>
        <div className="catalogue-game-card__content__sources">
          {sources.map((source) => (
            <SourceAnchor key={source} title={source} href="/" />
          ))}
        </div>
      </div>
    </div>
  );
}
