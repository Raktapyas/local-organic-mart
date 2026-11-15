import { MartView } from "@/components/mart-view";
import { SiteFooter } from "@/components/site-footer";
import { martCategories, products, productsInCategory } from "@/lib/data";

export default function MartPage() {
  /*
   * Department membership lives in `data.ts`, so resolve it once here and hand
   * the client plain id lists. The alternative — importing `productsInCategory`
   * in the client component — would ship the whole catalogue twice.
   */
  const categoryFilters = martCategories.map((category) => ({
    id: category.id,
    name: category.name,
    productIds: productsInCategory(category.id).map((product) => product.id),
  }));

  return (
    <>
      <main className="flex flex-1 flex-col">
        <MartView items={products} categoryFilters={categoryFilters} />
      </main>

      <SiteFooter />
    </>
  );
}
