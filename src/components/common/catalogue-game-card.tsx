import Image from "next/image";
import { Typography } from "./typography/typography";
import { SourceAnchor } from "./source-anchor/source-anchor";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

export interface CatalogueGameCardProps {
  title: string;
  image: string;
  genres: string[];
  sources?: string[];
  href: string;
  trailerUrl?: string;
}

export function CatalogueGameCard({
  title,
  image,
  genres,
  sources = ["FitGirl", "SteamRip"],
  href,
  trailerUrl = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
}: Readonly<CatalogueGameCardProps>) {
  const [showPreview, setShowPreview] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [highZIndex, setHighZIndex] = useState(false);
  const zIndexTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.volume = 0.3;
      videoRef.current.muted = false;
    }
    
    hoverTimeoutRef.current = setTimeout(() => {
      setHighZIndex(true);
      setShowPreview(true);
    }, 1500);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setShowPreview(false);

    zIndexTimeoutRef.current = setTimeout(() => {
      setHighZIndex(false);
    }, 300);
  };

  console.log("showPreview", showPreview);

  return (
    <div
      className="catalogue-game-card"
      style={{
        zIndex: highZIndex ? 100 : 1,
        position: "relative",
      }}
    >
      <div
        className={clsx(
          "catalogue-game-card__image",
          showPreview && "catalogue-game-card__image--open"
        )}
      >
        <motion.div
          ref={cardRef}
          initial={{ scale: 1 }}
          animate={{
            scale: showPreview ? 1.5 : 1,
            boxShadow: showPreview
              ? "0 25px 50px rgba(0, 0, 0, 0.8)"
              : "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
          transition={{
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
            scale: { type: "spring", stiffness: 300, damping: 30 },
          }}
          className="catalogue-game-card__image__preview"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Link href={href}>
            {showPreview ? (
              <video
                src={trailerUrl}
                autoPlay
                muted
                loop
                ref={videoRef}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              >
                <track kind="captions" />
              </video>
            ) : (
              <Image src={image} alt={title} fill objectFit="fill" />
            )}
          </Link>
        </motion.div>
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
