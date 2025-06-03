import { Catalogue } from "../components/catalogue-page";
import { useCatalogueData } from "../hooks";
import { FILTERS } from "../components/catalogue-page/filters.config";

export default function CataloguePage() {
  const { form, catalogueData, search } = useCatalogueData();
  const { control } = form;

  if (!catalogueData) return null;

  return (
    <div className="catalogue-container">
      <Catalogue.Header form={form} />

      <div className="catalogue-content">
        <Catalogue.Grid search={search} />
        <Catalogue.Sidebar
          catalogueData={catalogueData}
          control={control}
          filterConfig={FILTERS}
        />
      </div>
    </div>
  );
}
