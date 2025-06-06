import { api, getSteamAppDetails } from "@/services";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { Typography, GamePage } from "@/components";
import Head from "next/head";
import { useDownloadSources, useFormat, useGamePage } from "@/hooks";
import { GameStats, type SteamAppDetails } from "@/types";
import { toSlug } from "@/helpers";
import { useMemo, useState } from "react";

export interface GamePageProps {
  stats: GameStats;
  appDetails: SteamAppDetails;
}

export default function GamePageWrapper({
  stats,
  appDetails,
}: Readonly<GamePageProps>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  const { formatNumber } = useFormat();

  const {
    howLongToBeat,
    achievements,
    profileGame,
    toggleFavorite,
    isFavorite,
  } = useGamePage("steam", id as string);

  const { downloadOptionsByObjectId } = useDownloadSources();

  const gameDownloadOptions = useMemo(() => {
    return downloadOptionsByObjectId.get(id as string) ?? [];
  }, [downloadOptionsByObjectId, id]);

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

      <GamePage.DownloadOptionsModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        downloadOptions={gameDownloadOptions}
        backgroundImageUrl={stats.assets?.libraryHeroImageUrl ?? ""}
      />

      <div className="game-page">
        <GamePage.Hero
          stats={stats}
          appDetails={appDetails}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
          setIsModalOpen={setIsModalOpen}
        />

        <section className="game-page__content">
          <GamePage.PlaytimeBar profileGame={profileGame} />

          <div style={{ display: "flex", gap: 16, padding: "64px 0" }}>
            <div style={{ flex: 1 }}>
              {appDetails.screenshots && appDetails.screenshots.length > 0 && (
                <GamePage.ScreenshotCarousel
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

            <div className="game-page__sidebar">
              <div
                style={{
                  display: "flex",
                  gap: 16,
                }}
              >
                <div className="game-page__box-group">
                  <GamePage.TitleBox title="User Tags" />

                  <GamePage.Box
                    style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
                  >
                    {appDetails.categories.slice(0, 4).map((genre) => {
                      return (
                        <Typography key={genre.id}>
                          {genre.description}
                        </Typography>
                      );
                    })}
                  </GamePage.Box>
                </div>

                <div className="game-page__box-group">
                  <GamePage.TitleBox title="Stats" />
                  <GamePage.SingleLineBox
                    title="Playing Now"
                    value={formatNumber(stats.playerCount)}
                  />
                  <GamePage.SingleLineBox
                    title="Downloads"
                    value={formatNumber(stats.downloadCount)}
                  />
                </div>
              </div>

              <GamePage.HowLongToBeatBox howLongToBeat={howLongToBeat} />

              <GamePage.AchievementsBox achievements={achievements} />

              <div className="game-page__box-group">
                <GamePage.SingleLineBox
                  title="Developed by"
                  value={appDetails.developers[0]}
                />

                <GamePage.SingleLineBox
                  title="Published by"
                  value={appDetails.publishers[0]}
                />

                <GamePage.SingleLineBox
                  title="Release Date"
                  value={appDetails.release_date.date}
                />
              </div>

              <div className="game-page__box-group">
                <GamePage.TitleBox title="Requirements" />

                <GamePage.Box
                  dangerouslySetInnerHTML={{
                    __html: appDetails.pc_requirements.minimum,
                  }}
                  className="game-page__requirements"
                />
              </div>
              {/* 
              <Typography
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
