import { SearchGamesResponseData } from "@/hooks";
import { Catalogue } from ".";
import { useSearchParams } from "next/navigation";

interface GridProps {
  search: {
    data: SearchGamesResponseData | undefined;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    isEmpty: boolean;
  };
}

export default function Grid({ search }: Readonly<GridProps>) {
  const queryParams = useSearchParams();
  const skeletonLength = queryParams.get("skeleton") || 21;

  if (search.isLoading) {
    return (
      <div className="catalogue-grid">
        {Array.from(
          { length: Number(skeletonLength) },
          (_, index) => index
        ).map((item) => (
          <Catalogue.SkeletonCard key={`skeleton-${item}`} />
        ))}
      </div>
    );
  }

  return (
    <div className="catalogue-grid">
      {search.data?.edges.map((item) => (
        <Catalogue.Card key={item.id} game={item} />
      ))}
    </div>
  );
}
