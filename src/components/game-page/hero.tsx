import { Heart } from "@phosphor-icons/react";

import { Button } from "@/components";

import { Tooltip, Typography } from "@/components";
import { GameStats, SteamAppDetails } from "@/types";
import { PlusCircle } from "@phosphor-icons/react";
import { motion } from "framer-motion";

export interface HeroProps {
  stats: GameStats;
  appDetails: SteamAppDetails;
  isFavorite: boolean;
  toggleFavorite: () => void;
  setIsModalOpen: (isOpen: boolean) => void;
}

export function Hero({
  stats,
  appDetails,
  isFavorite,
  toggleFavorite,
  setIsModalOpen,
}: HeroProps) {
  return (
    <section style={{ position: "relative", height: 620, overflow: "hidden" }}>
      {/* Animated Hero Background */}
      <motion.div
        initial={{ scale: 1, x: 0, y: 0 }}
        animate={{
          scale: 1.1,
          x: -10, // subtle horizontal pan
          y: -10, // subtle vertical pan
        }}
        transition={{
          duration: 20, // very slow for background
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "mirror",
        }}
        className="game-page__hero"
        style={{
          backgroundImage: `url(${stats.assets?.libraryHeroImageUrl})`,
        }}
      />

      <div className="game-page__hero-overlay">
        <img
          src={stats.assets?.logoImageUrl}
          style={{ width: 337 }}
          alt={stats.assets?.title}
        />

        <Typography
          style={{ maxWidth: 512, color: "rgba(255, 255, 255, 0.8)" }}
          dangerouslySetInnerHTML={{
            __html: appDetails.short_description,
          }}
        />

        <div style={{ display: "flex", gap: 16 }}>
          <Button variant="secondary" icon={<PlusCircle size={24} />}>
            Add to Library
          </Button>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            Open Download Options
          </Button>

          <Tooltip
            content={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Button variant="secondary" onClick={() => toggleFavorite()}>
              <motion.span
                key={isFavorite ? "filled" : "empty"}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isFavorite ? (
                  <Heart size={24} weight="fill" />
                ) : (
                  <Heart size={24} />
                )}
              </motion.span>
            </Button>
          </Tooltip>
        </div>
      </div>
    </section>
  );
}
