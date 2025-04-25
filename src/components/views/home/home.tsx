import { useHomeData } from "../hooks/use-home-data";
import { useSearchGames } from "../hooks/use-search-games";
import type { TrendingGame, CatalogueGame } from "@/types";

export function Home() {
  const { catalogueTrendingGames, catalogueHotGames, catalogueGamesToBeat } =
    useHomeData();

  console.log("catalogueTrendingGames", catalogueTrendingGames);

  const { searchData: rolePlayingGames } = useSearchGames({
    take: 12,
    skip: 0,
    tags: [19, 122, 4172],
  });

  console.log("rolePlayingGames", rolePlayingGames);

  const { searchData: fightingGames } = useSearchGames({
    take: 12,
    skip: 0,
    tags: [1743, 1773, 3878],
  });

  console.log("fightingGames", fightingGames);

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
        {catalogueTrendingGames.isLoading && <p>loading trending games...</p>}
        {catalogueTrendingGames.isError && (
          <p>error loading trending games...</p>
        )}

        {catalogueTrendingGames.data?.map((game: TrendingGame) => (
          <img key={game.id} src={game.logo} alt={game.description} />
        ))}
      </div>
      <br />
      <div>
        <h1>Hot Games</h1>
        {catalogueHotGames.isLoading && <p>loading hot games...</p>}
        {catalogueHotGames.isError && <p>error loading hot games...</p>}

        {catalogueHotGames.data?.map((game: CatalogueGame) => (
          <p key={game.title}>{game.title}</p>
        ))}
      </div>
      <br />
      <div>
        <h1>Games to Beat</h1>
        {catalogueGamesToBeat.isLoading && <p>loading games to beat...</p>}
        {catalogueGamesToBeat.isError && <p>error loading games to beat...</p>}

        {catalogueGamesToBeat.data?.map((game: CatalogueGame) => (
          <p key={game.title}>{game.title}</p>
        ))}
      </div>
      <br />
      <div>
        <h1>RPG</h1>
        {rolePlayingGames.isLoading && <p>loading rpg games...</p>}
        {rolePlayingGames.isError && <p>error loading rpg games...</p>}

        {rolePlayingGames.isEmpty && !rolePlayingGames.isLoading && (
          <p>no rpg games found...</p>
        )}

        {rolePlayingGames.data?.edges.map((game) => (
          <p key={game.title}>{game.title}</p>
        ))}
      </div>
      <br />
      <div>
        <h1>Fighting</h1>
        {fightingGames.isLoading && <p>loading fighting games...</p>}
        {fightingGames.isError && <p>error loading fighting games...</p>}

        {fightingGames.isEmpty && !fightingGames.isLoading && (
          <p>no fighting games found...</p>
        )}

        {fightingGames.data?.edges.map((game) => (
          <p key={game.title}>{game.title}</p>
        ))}
      </div>
    </div>
  );
}
