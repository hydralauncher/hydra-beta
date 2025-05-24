import { api, getSteamAppDetails } from "@/services";
import { Clock, Heart, PlusCircle } from "@phosphor-icons/react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  Tooltip,
  Button,
  Typography,
  ScreenshotCarousel,
  DownloadOptionsModal,
} from "@/components";
import Head from "next/head";
import Image from "next/image";
import { useDate, useDownloadSources, useFormat, useGamePage } from "@/hooks";
import { GameShop, type SteamAppDetails } from "@/types";
import { toSlug } from "@/helpers";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export interface ShopAssets {
  objectId: string;
  shop: GameShop;
  title: string;
  iconUrl: string | null;
  libraryHeroImageUrl: string;
  libraryImageUrl: string;
  logoImageUrl: string;
  logoPosition: string | null;
  coverImageUrl: string;
}

export interface GameStats {
  downloadCount: number;
  playerCount: number;
  assets: ShopAssets | null;
}

export interface GamePageProps {
  stats: GameStats;
  appDetails: SteamAppDetails;
}

interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function Box({ children, ...props }: BoxProps) {
  const { style, ...rest } = props;

  return (
    <div
      style={{
        backgroundColor: "#0E0E0E",
        padding: 8,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

export function TitleBox({ title }: { title: string }) {
  return (
    <Box>
      <Typography
        style={{ textAlign: "center", color: "rgba(255, 255, 255, 0.5)" }}
      >
        {title}
      </Typography>
    </Box>
  );
}

function SingleLineBox({ title, value }: { title: string; value: string }) {
  return (
    <Box style={{ display: "flex", justifyContent: "space-between" }}>
      <Typography style={{ color: "rgba(255, 255, 255, 0.5)" }}>
        {title}
      </Typography>
      <Typography style={{ fontWeight: "700" }}>{value}</Typography>
    </Box>
  );
}

export default function GamePage({
  stats,
  appDetails,
}: Readonly<GamePageProps>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  const { formatNumber } = useFormat();
  const { formatDistance } = useDate();

  const { howLongToBeat, achievements, profileGame, toggleFavorite } =
    useGamePage(id as string, "steam");

  const { downloadSources } = useDownloadSources();

  const gameDownloadOptions = useMemo(
    () =>
      downloadSources.flatMap((downloadSource) =>
        downloadSource.downloadOptions
          .filter((downloadOption) =>
            downloadOption.objectIds.includes(id as string)
          )
          .map((downloadOption) => ({
            ...downloadOption,
            downloadSource: downloadSource.name,
          }))
      ),
    [downloadSources, id]
  );

  useEffect(() => {
    setIsFavorite(profileGame?.isFavorite ?? false);
  }, [profileGame]);

  return (
    <>
      <Head>
        <title>{appDetails.name}</title>
        <meta name="description" content={appDetails.short_description} />
        <meta property="og:title" content={appDetails.name} />
        <meta
          property="og:description"
          content={appDetails.short_description}
        />
        {stats.assets?.libraryImageUrl && (
          <meta property="og:image" content={stats.assets.libraryImageUrl} />
        )}
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_APP_URL}/game/${id}/${toSlug(
            appDetails.name
          )}`}
        />
        <link
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_APP_URL}/game/${id}/${toSlug(
            appDetails.name
          )}`}
        />
      </Head>

      <DownloadOptionsModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        downloadOptions={gameDownloadOptions}
        backgroundImageUrl={stats.assets?.libraryHeroImageUrl ?? ""}
      />

      <div className="game-page">
        <section
          style={{ position: "relative", height: 620, overflow: "hidden" }}
        >
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
                content={
                  isFavorite ? "Remove from Favorites" : "Add to Favorites"
                }
              >
                <Button
                  variant="secondary"
                  onClick={() => {
                    toggleFavorite(!isFavorite);
                    setIsFavorite(!isFavorite);
                  }}
                >
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

        <section style={{ padding: "16px 88px" }}>
          {profileGame && profileGame.lastTimePlayed && (
            <div className="game-page__playtime-bar">
              <Typography>
                Played for <strong>{profileGame.playTimeInSeconds}</strong>{" "}
                minutes
              </Typography>
              <Typography style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                Last played{" "}
                {formatDistance(profileGame.lastTimePlayed, new Date(), {
                  addSuffix: true,
                })}
              </Typography>
            </div>
          )}

          <div style={{ display: "flex", gap: 16, padding: "64px 0" }}>
            <div style={{ flex: 1 }}>
              {appDetails.screenshots && appDetails.screenshots.length > 0 && (
                <ScreenshotCarousel
                  screenshots={appDetails.screenshots}
                  videos={appDetails.movies}
                />
              )}

              <div
                dangerouslySetInnerHTML={{
                  __html: appDetails.detailed_description,
                }}
                className="game-page__detailed-description"
              />
            </div>

            <div
              style={{
                width: 500,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 16,
                }}
              >
                <div className="game-page__box-group">
                  <TitleBox title="User Tags" />

                  <Box style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {appDetails.categories.slice(0, 4).map((genre) => {
                      return (
                        <Typography key={genre.id}>
                          {genre.description}
                        </Typography>
                      );
                    })}
                  </Box>
                </div>

                <div className="game-page__box-group">
                  <TitleBox title="Stats" />
                  <SingleLineBox
                    title="Playing Now"
                    value={formatNumber(stats.playerCount)}
                  />
                  <SingleLineBox
                    title="Downloads"
                    value={formatNumber(stats.downloadCount)}
                  />
                </div>
              </div>

              <div className="game-page__box-group">
                <TitleBox title="HowLongToBeat" />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  {howLongToBeat?.map((item) => (
                    <div
                      key={item.title}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                        gap: 4,
                      }}
                    >
                      <Box className="game-page__how-long-to-beat-duration">
                        <Clock size={20} />
                        <Typography
                          variant="h3"
                          style={{ textAlign: "center" }}
                        >
                          {item.duration.split(" ")[0]}
                        </Typography>
                      </Box>

                      <Box className="game-page__how-long-to-beat-title">
                        <Typography style={{ textAlign: "center" }}>
                          {item.title}
                        </Typography>
                      </Box>
                    </div>
                  ))}
                </div>
              </div>

              <div className="game-page__box-group">
                <TitleBox title="Achievements" />

                {achievements?.slice(0, 5).map((achievement) => (
                  <Box
                    key={achievement.name}
                    className="game-page__achievement"
                  >
                    <Image
                      src={achievement.icon}
                      width={56}
                      height={56}
                      className="game-page__achievement-icon"
                      alt={achievement.displayName}
                      loading="lazy"
                    />

                    <div className="game-page__achievement-info">
                      <Typography>{achievement.displayName}</Typography>

                      <Typography style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                        {achievement.description}
                      </Typography>
                    </div>
                  </Box>
                ))}

                <Box style={{ textAlign: "center" }}>
                  <Link href={`/achievements/${id}`}>
                    <Typography>View All Achievements</Typography>
                  </Link>
                </Box>
              </div>

              <div className="game-page__box-group">
                <SingleLineBox
                  title="Developed by"
                  value={appDetails.developers[0]}
                />

                <SingleLineBox
                  title="Published by"
                  value={appDetails.publishers[0]}
                />

                <SingleLineBox
                  title="Release Date"
                  value={appDetails.release_date.date}
                />
              </div>

              <div className="game-page__box-group">
                <TitleBox title="Requirements" />

                <Box
                  dangerouslySetInnerHTML={{
                    __html: appDetails.pc_requirements.minimum,
                  }}
                  className="game-page__requirements"
                />
              </div>

              {/* <Typography
                  dangerouslySetInnerHTML={{
                    __html: appDetails.legal_notice,
                  }}
                  className="game-page__legal-notice"
                /> */}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<GamePageProps> = async (
  context
) => {
  const { id, slug } = context.params as { id: string; slug?: string };

  const [stats, appDetails] = await Promise.all([
    api.get<GameStats>(`games/stats?objectId=${id}&shop=steam`).json(),
    getSteamAppDetails(id, "en"),
  ]);

  if (!appDetails) {
    return {
      notFound: true,
    };
  }

  const correctSlug = toSlug(appDetails.name);

  if (slug !== correctSlug) {
    return {
      redirect: {
        destination: `/game/${id}/${correctSlug}`,
        permanent: true,
      },
    };
  }

  return {
    props: { stats, appDetails },
  };
};
