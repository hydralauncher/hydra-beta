import { useHomeData } from "../hooks/use-home-data";
import { useSearchGames } from "../hooks/use-search-games";
import type { TrendingGame, CatalogueGame } from "@/types";

export function Home() {
  const { catalogueTrendingGames, catalogueHotGames, catalogueGamesToBeat } =
    useHomeData();

  const { data: rolePlayingGames } = useSearchGames({
    take: 12,
    skip: 0,
    tags: [122],
  });

  const { data: fightingGames } = useSearchGames({
    take: 12,
    skip: 0,
    tags: [1743],
  });

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
      <br />
      <div>
        <h1>RPG</h1>
        {rolePlayingGames.data?.edges.map((game) => <p>{game.title}</p>)}
      </div>
      <br />
      <div>
        <h1>Fighting</h1>
        {fightingGames.data?.edges.map((game) => <p>{game.title}</p>)}
      </div>
    </div>
  );
}
