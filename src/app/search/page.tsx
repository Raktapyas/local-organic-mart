import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { Suspense } from "react";

import { DishCard } from "@/components/dish-card";
import { L } from "@/components/localized-text";
import { ProductCard } from "@/components/product-card";
import { SearchField } from "@/components/search-field";
import { SectionHeader } from "@/components/section-header";
import { SiteFooter } from "@/components/site-footer";
import { searchCatalogue, searchSuggestions } from "@/lib/data";

/** Display labels for the suggestion chips; the query string stays English. */
const SUGGESTION_NE: Record<string, string> = {
  milk: "दूध",
  rice: "चामल",
  momo: "मःम",
  honey: "मह",
};

export const metadata: Metadata = {
  title: "Search — Local Organic Mart",
  description: "Search Mart provisions and the Restaurant menu by name.",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

/**
 * The page is the prerendered shell only.
 *
 * Reading `searchParams` is runtime data, so touching it at the top level
 * blocks the whole route from prerendering. Everything that depends on the
 * query therefore sits behind a Suspense boundary: the chrome and the
 * heading paint immediately, and the results stream in behind them.
 */
export default function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <>

      <main className="flex flex-1 flex-col">
        <section className="mx-auto w-full max-w-7xl px-6 pt-12 pb-8">
          <Suspense fallback={<SearchSkeleton />}>
            <SearchResults searchParams={searchParams} />
          </Suspense>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

async function SearchResults({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const raw = params.q;
  const query = Array.isArray(raw) ? (raw[0] ?? "") : (raw ?? "");

  const { products, dishes, total } = searchCatalogue(query);

  return (
    <>
      {query ? (
        <SectionHeader
          as="h1"
          title={`${total} ${total === 1 ? "result" : "results"} for “${query}”`}
          titleNe={`“${query}” का लागि ${total} नतिजा`}
          subline={
            total === 0
              ? "Nothing matched that search."
              : "Across Mart provisions and the Restaurant menu."
          }
          sublineNe={
            total === 0
              ? "त्यो खोजसँग केही मिलेन।"
              : "मार्टका सामान र रेस्टुरेन्टको मेनुभर।"
          }
        />
      ) : (
        <SectionHeader
          as="h1"
          title="Search the mart"
          titleNe="मार्टमा खोज्नुहोस्"
          subline="Look up a provision or a dish by name, in English or Nepali."
          sublineNe="सामान वा परिकारको नाम अंग्रेजी वा नेपालीमा खोज्नुहोस्।"
        />
      )}

      <SearchField defaultValue={query} />

      {total > 0 ? (
        <SearchResultsBody
          products={products}
          dishes={dishes}
          total={total}
        />
      ) : (
        <EmptyState hasQuery={Boolean(query)} />
      )}
    </>
  );
}

function SearchResultsBody({
  products,
  dishes,
}: {
  products: ReturnType<typeof searchCatalogue>["products"];
  dishes: ReturnType<typeof searchCatalogue>["dishes"];
  total: number;
}) {
  return (
    <>
      {products.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-6 pb-14 pt-14">
          <h2 className="text-xs tracking-wider text-sage uppercase">
            <L en="Mart provisions" ne="मार्टका सामान" /> ({products.length})
          </h2>
          <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {dishes.length > 0 && (
        <section
          className={`mx-auto w-full max-w-7xl px-6 ${
            products.length > 0 ? "pb-24" : "pb-14 pt-14"
          }`}
        >
          <h2 className="text-xs tracking-wider text-sage uppercase">
            <L en="Restaurant" ne="रेस्टुरेन्ट" /> ({dishes.length})
          </h2>
          <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {dishes.map((dish) => (
              <li key={dish.id}>
                <DishCard dish={dish} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

function EmptyState({ hasQuery }: { hasQuery: boolean }) {
  return (
    <div className="flex flex-col items-center gap-5 rounded-[2px] border border-border bg-card/40 px-6 py-20 text-center">
      <span className="inline-flex size-11 items-center justify-center rounded-[2px] border border-border text-sage">
        <SearchX className="size-5" aria-hidden />
      </span>
      <h2 className="font-heading text-2xl tracking-tight">
        <L
          en={hasQuery ? "Nothing matched that search." : "Start typing to search."}
          ne={hasQuery ? "त्यो खोजसँग केही मिलेन।" : "खोज्न टाइप गर्न सुरु गर्नुहोस्।"}
        />
      </h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        <L
          en={
            hasQuery
              ? "Try a shorter word, or one of these instead."
              : "Search by product name, dish name, or category — Nepali works too."
          }
          ne={
            hasQuery
              ? "छोटो शब्द प्रयास गर्नुहोस्, वा तलकामध्ये एउटा।"
              : "उत्पादनको नाम, परिकारको नाम वा श्रेणीअनुसार खोज्नुहोस् — नेपालीमा पनि हुन्छ।"
          }
        />
      </p>

      <ul className="mt-2 flex flex-wrap justify-center gap-2">
        {searchSuggestions.map((suggestion) => (
          <li key={suggestion}>
            <Link
              href={`/search?q=${suggestion}`}
              className="inline-flex rounded-[2px] border border-border px-4 py-1.5 text-sm capitalize text-muted-foreground transition-colors hover:border-mint/40 hover:text-mint"
            >
              <L
                en={suggestion}
                ne={SUGGESTION_NE[suggestion] ?? suggestion}
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Holds the layout while the query resolves, so the page does not jump. */
function SearchSkeleton() {
  return (
    <div className="flex flex-col gap-8" aria-hidden>
      <div className="flex flex-col gap-3">
        <div className="h-9 w-64 rounded-[2px] bg-muted" />
        <div className="h-4 w-80 rounded-[2px] bg-muted" />
      </div>
      <div className="h-11 w-full max-w-xl rounded-[2px] bg-muted" />
    </div>
  );
}
