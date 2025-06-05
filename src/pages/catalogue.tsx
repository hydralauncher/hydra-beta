import { Catalogue } from "../components/catalogue-page";
import { useCatalogueData } from "../hooks";

export default function CataloguePage() {
  const { values, updateSearchParams, catalogueData, search } =
    useCatalogueData();

  if (!catalogueData) return null;

  return (
    <div className="catalogue-container">
      <Catalogue.Header
        values={values}
        updateSearchParams={updateSearchParams}
        catalogueData={catalogueData}
      />

      <div className="catalogue-content">
        <Catalogue.Grid search={search} />
        <Catalogue.Sidebar
          catalogueData={catalogueData}
          values={values}
          updateSearchParams={updateSearchParams}
        />
      </div>
    </div>
  );
}
