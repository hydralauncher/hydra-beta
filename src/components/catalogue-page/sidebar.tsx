import { useCatalogueAssets } from "@/hooks/use-catalogue-assets.hook";
import { useDownloadSources } from "@/hooks/use-download-sources.hook";
import { Catalogue } from "@/components";
import { FILTER_CONFIG } from "./index";

export default function Sidebar() {
  const { data: catalogueData, isError } = useCatalogueAssets();
  const { downloadSources } = useDownloadSources();

  if (isError)
    return <div className="sidebar-error">Failed to load filters</div>;
  if (!catalogueData) return null;

  const FILTER_DATA_MAPPING = {
    genres: catalogueData.genres.en,
    userTags: catalogueData.userTags.en,
    downloadSourceFingerprints: downloadSources.reduce(
      (acc, ds) => {
        acc[ds.name] = ds.fingerprint;
        return acc;
      },
      {} as Record<string, string>
    ),
    developers: catalogueData.developers,
    publishers: catalogueData.publishers,
  };

  return (
    <div className="catalogue__sidebar">
      {(Object.keys(FILTER_CONFIG) as Array<keyof typeof FILTER_CONFIG>).map(
        (filterKey) => {
          const config = FILTER_CONFIG[filterKey];
          const filterData = FILTER_DATA_MAPPING[filterKey];

          if (!filterData) return null;

          return (
            <Catalogue.Filters
              key={filterKey}
              filterKey={filterKey}
              config={config}
              data={filterData}
            />
          );
        }
      )}
    </div>
  );
}
