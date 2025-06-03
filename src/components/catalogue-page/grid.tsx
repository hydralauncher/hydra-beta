import { useCatalogueSearch } from "@/hooks/use-catalogue-search.hook";
import { Catalogue } from "@/components";
import type { CatalogueGame } from "@/types";
import { CardSkeleton } from "./skeleton";
import { toSlug } from "@/helpers/string-formatting";

interface CatalogueGameWithAssets extends CatalogueGame {
  libraryImageUrl: string;
}

export default function Grid() {
  const { search } = useCatalogueSearch();

  if (search.isLoading) {
    return (
      <div className="catalogue__grid">
        <CardSkeleton />
      </div>
    );
  }

  if (search.isError) {
    return <p>Error loading games. Please try again.</p>;
  }

  if (search.isEmpty) {
    return <p>No games found. Try different filters.</p>;
  }

  return (
    <div className="catalogue__grid">
      {search.data?.edges.map((edge) => (
        <div key={edge.id} className="catalogue__grid-item">
          <Catalogue.Card
            title={edge.title}
            image={(edge as CatalogueGameWithAssets).libraryImageUrl}
            genres={edge.genres}
            href={`/game/${edge.objectId}/${toSlug(edge.title)}`}
            objectId={edge.objectId}
          />
        </div>
      ))}
    </div>
  );
}
