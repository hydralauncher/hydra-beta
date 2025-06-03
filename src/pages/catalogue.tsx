import { Catalogue } from "@/components";
import { useCatalogueSync } from "@/hooks/use-catalogue-sync.hook";

export default function CataloguePage() {
  useCatalogueSync();

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
