import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export function CardSkeleton() {
  return (
    <SkeletonTheme baseColor="var(--surface)" highlightColor="var(--secondary)">
      <div className="catalogue__grid">
        {Array.from({ length: 10 }, (_, index) => (
          <div className="catalogue__grid-item" key={`skeleton-${index}`}>
            <div className="catalogue-skeleton__card">
              <Skeleton
                className="catalogue-skeleton__card__image"
                height={200}
                width={400}
              />
              <Skeleton height={20} style={{ marginTop: "8px" }} />
              <Skeleton height={16} width="35%" />
            </div>
          </div>
        ))}
      </div>
    </SkeletonTheme>
  );
}
