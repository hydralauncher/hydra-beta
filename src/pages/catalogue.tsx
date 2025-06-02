import { Catalogue } from "@/components";
import { useCatalogueFormSync } from "@/hooks/use-catalogue-sync.hook";

export default function CataloguePage() {
  useCatalogueFormSync();

  return (
    <div className="catalogue">
      <div className="catalogue__content">
        <Catalogue.Header />
        <Catalogue.Grid />
      </div>

      <Catalogue.Sidebar />
    </div>
  );
}
