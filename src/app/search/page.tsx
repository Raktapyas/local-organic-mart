import type { Metadata } from "next";
import Link from "next/link";
import { Search as SearchIcon, SearchX } from "lucide-react";
import { Suspense } from "react";

import { DishCard } from "@/components/dish-card";
import { ProductCard } from "@/components/product-card";
import { SectionHeader } from "@/components/section-header";
import { SiteFooter } from "@/components/site-footer";
import { searchCatalogue, searchSuggestions } from "@/lib/data";

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
          subline={
            total === 0
              ? "Nothing matched that search."
              : "Across Mart provisions and the Restaurant menu."
          }
        />
      ) : (
        <SectionHeader
          as="h1"
          title="Search the mart"
          subline="Look up a provision or a dish by name, in English or Nepali."
        />
      )}

      <form action="/search" role="search" className="relative mt-8 max-w-xl">
        <SearchIcon
          className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          type="search"
          name="q"
          defaultValue={query}
          aria-label="Search the mart"
          placeholder="Search provisions, dishes, or harvest dates"
          className="h-11 w-full rounded-full border border-input bg-card/70 pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-mint focus-visible:ring-3 focus-visible:ring-ring/40"
        />
      </form>

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
            Mart provisions ({products.length})
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
            Restaurant ({dishes.length})
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
    <div className="flex flex-col items-center gap-5 rounded-xl border border-border bg-card/40 px-6 py-20 text-center">
      <span className="inline-flex size-11 items-center justify-center rounded-full border border-border text-sage">
        <SearchX className="size-5" aria-hidden />
      </span>
      <h2 className="font-heading text-2xl tracking-tight">
        {hasQuery ? "Nothing matched that search." : "Start typing to search."}
      </h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        {hasQuery
          ? "Try a shorter word, or one of these instead."
          : "Search by product name, dish name, or category — Nepali works too."}
      </p>

      <ul className="mt-2 flex flex-wrap justify-center gap-2">
        {searchSuggestions.map((suggestion) => (
          <li key={suggestion}>
            <Link
              href={`/search?q=${suggestion}`}
              className="inline-flex rounded-full border border-border px-4 py-1.5 text-sm capitalize text-muted-foreground transition-colors hover:border-mint/40 hover:text-mint"
            >
              {suggestion}
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
        <div className="h-9 w-64 rounded-md bg-muted" />
        <div className="h-4 w-80 rounded-md bg-muted" />
      </div>
      <div className="h-11 w-full max-w-xl rounded-full bg-muted" />
    </div>
  );
}
