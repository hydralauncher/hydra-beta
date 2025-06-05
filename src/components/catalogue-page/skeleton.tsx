import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const SkeletonCard = () => {
  return (
    <div className="catalogue-card">
      <SkeletonTheme
        baseColor="var(--surface)"
        highlightColor="var(--secondary)"
      >
        <Skeleton className="catalogue-card__image skeleton-catalogue-card" />

        <div className="catalogue-card__content">
          <Skeleton
            className="catalogue-card__content__title-text"
            height="14px"
            width="60%"
          />
          <Skeleton
            className="catalogue-card__content__genres-text"
            height="14px"
            width="30%"
            style={{ display: "flex", marginTop: "-4px" }}
          />
        </div>

        <div
          className="catalogue-card__download-sources"
          style={{ marginTop: "-20px" }}
        >
          <Skeleton width="72px" height="32px" />
          <Skeleton width="52px" height="32px" />
          <Skeleton width="42px" height="32px" />
        </div>
      </SkeletonTheme>
    </div>
  );
};
