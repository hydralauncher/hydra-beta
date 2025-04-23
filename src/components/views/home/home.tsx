import { useHomeData } from "@/hooks/api/use-home-data";
import type { TrendingGame, CatalogueGame } from "@/types";

export function Home() {
  const { catalogueTrendingGames, catalogueHotGames, catalogueGamesToBeat } =
    useHomeData();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        width: "100%",
        padding: "32px",
        overflow: "auto",
      }}
    >
      <h1>Home</h1>
      <div>
        {catalogueTrendingGames.data?.map((game: TrendingGame) => (
          <img src={game.logo} alt={game.description} />
        ))}
      </div>
      <br />
      <div>
        <h1>Hot Games</h1>
        {catalogueHotGames.data?.map((game: CatalogueGame) => (
          <p>{game.title}</p>
        ))}
      </div>
      <br />
      <div>
        <h1>Games to Beat</h1>
        {catalogueGamesToBeat.data?.map((game: CatalogueGame) => (
          <p>{game.title}</p>
        ))}
      </div>
    </div>
  );
}
