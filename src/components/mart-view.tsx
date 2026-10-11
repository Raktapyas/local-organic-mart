import Link from "next/link";
import {
  BadgeCheck,
  ChevronDown,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { CountdownChip } from "@/components/countdown-chip";
import { ProductCard } from "@/components/product-card";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import {
  categories,
  dealsCloseAt,
  filterAttributes,
  priceCeiling,
  products,
  productsInCategory,
  provenanceMarks,
  sortOptions,
  type Product,
} from "@/lib/data";

export interface MartViewProps {
  /** Nav category id from `/mart/[category]`. Absent on `/mart`. */
  categoryId?: string;
  /** Resolved products. Ignored when `categoryId` is set. */
  items?: Product[];
  /** Category name, used as the h1 and in the result count. */
  categoryName?: string;
  /** Terroir note, used as the subline. */
  categoryNote?: string;
}

/**
 * Shared Mart body for `/mart` and `/mart/[category]`.
 *
 * The category pages are the same grid and the same sidebar with one filter
 * pre-applied: the matching pill is marked current, the matching sidebar
 * checkbox is checked, and the result count names the department. Everything
 * else — search, sort, price rail, provenance — is unchanged.
 */
export function MartView({
  categoryId,
  items,
  categoryName,
  categoryNote,
}: MartViewProps) {
  const filtered = categoryId ? productsInCategory(categoryId) : products;
  const list = categoryId ? filtered : (items ?? products);

  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-6 pt-12 pb-8">
        <SectionHeader
          as="h1"
          title={categoryName ?? "Mart"}
          subline={
            categoryNote ?? "Fresh produce, dairy, pantry, meat and more."
          }
          aside={<CountdownChip closesAt={dealsCloseAt} label="Deals end" />}
        />

        <div className="mt-8 flex flex-col gap-4">
          <form action="/search" role="search" className="relative max-w-xl">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              type="search"
              name="q"
              aria-label="Search the mart"
              placeholder="Search provisions, farms, or harvest dates"
              className="h-11 w-full rounded-full border border-input bg-card/70 pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-mint focus-visible:ring-3 focus-visible:ring-ring/40"
            />
          </form>

          <nav aria-label="Product categories">
            <ul className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1">
              <li>
                <Link
                  href="/mart"
                  aria-current={categoryId ? undefined : "page"}
                  className={
                    categoryId
                      ? "inline-flex h-9 shrink-0 items-center rounded-full border border-border px-4 text-sm text-muted-foreground transition-colors hover:border-mint/35 hover:text-foreground"
                      : "inline-flex h-9 shrink-0 items-center rounded-full bg-mint px-4 text-sm font-medium text-primary-foreground"
                  }
                >
                  All
                </Link>
              </li>
              {categories.map((category) => {
                const isActive = category.id === categoryId;
                return (
                  <li key={category.id}>
                    <Link
                      href={category.href}
                      aria-current={isActive ? "page" : undefined}
                      className={
                        isActive
                          ? "inline-flex h-9 shrink-0 items-center rounded-full bg-mint px-4 text-sm font-medium text-primary-foreground"
                          : "inline-flex h-9 shrink-0 items-center rounded-full border border-border px-4 text-sm text-muted-foreground transition-colors hover:border-mint/35 hover:text-foreground"
                      }
                    >
                      {category.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-10 px-6 pb-20 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-heading text-base">
              <SlidersHorizontal className="size-4 text-sage" aria-hidden />
              Filters
            </h2>
            <button
              type="button"
              className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-3" aria-hidden />
              Clear all
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-8">
            <fieldset>
              <legend className="text-xs tracking-wider text-sage uppercase">
                Filter Attributes
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {filterAttributes.map((attribute) => (
                  <label
                    key={attribute.id}
                    className="cursor-pointer rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-mint/35 has-checked:border-mint has-checked:bg-mint/12 has-checked:text-mint"
                  >
                    <input
                      type="checkbox"
                      name={attribute.id}
                      className="sr-only"
                    />
                    {attribute.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-xs tracking-wider text-sage uppercase">
                Categories
              </legend>
              <ul className="mt-3 flex flex-col gap-2.5">
                {categories.map((category) => (
                  <li key={category.id}>
                    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
                      <input
                        type="checkbox"
                        name="category"
                        value={category.name}
                        defaultChecked={category.id === categoryId}
                        className="size-4 shrink-0 rounded border-input accent-mint"
                      />
                      {category.name}
                    </label>
                  </li>
                ))}
              </ul>
            </fieldset>

            <fieldset>
              <legend className="text-xs tracking-wider text-sage uppercase">
                Price Ceiling
              </legend>
              <p className="mt-3 font-heading text-lg">
                Rs 0 &ndash; Rs {priceCeiling.toLocaleString("en-NP")}
              </p>
              <label className="mt-3 block">
                <span className="sr-only">Maximum price</span>
                <input
                  type="range"
                  name="maxPrice"
                  min={0}
                  max={priceCeiling}
                  defaultValue={priceCeiling}
                  className="w-full accent-[#8FE3B0]"
                />
              </label>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>Min: Rs 0</span>
                <span>Max: Rs {priceCeiling.toLocaleString("en-NP")}</span>
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-xs tracking-wider text-sage uppercase">
                Verified Provenance
              </legend>
              <ul className="mt-2 flex flex-col gap-2">
                {provenanceMarks.map((mark) => (
                  <li
                    key={mark.id}
                    className="flex items-center justify-between gap-2 rounded-md border border-border bg-card/50 px-3 py-2 text-xs text-muted-foreground"
                  >
                    {mark.label}
                    <BadgeCheck className="size-4 shrink-0 text-sage" aria-hidden />
                  </li>
                ))}
              </ul>
            </fieldset>
          </div>
        </aside>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[17px]">
              {categoryName ? `${categoryName} · ` : ""}
              {list.length} {list.length === 1 ? "product" : "products"}
            </p>

            <div className="flex items-center gap-3">
              <label
                htmlFor="sort"
                className="text-xs tracking-wider text-sage uppercase"
              >
                Sort:
              </label>
              <div className="relative">
                <select
                  id="sort"
                  name="sort"
                  className="appearance-none rounded-full border border-border bg-card py-2 pr-9 pl-4 text-xs text-foreground outline-none transition-colors focus:border-mint"
                >
                  {sortOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
              </div>
            </div>
          </div>

          {list.length > 0 ? (
            <>
              <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {list.map((product) => (
                  <li key={product.id}>
                    <ProductCard product={product} />
                  </li>
                ))}
              </ul>

              <div className="flex flex-col items-center gap-3 pt-4">
                <Button variant="outline" className="rounded-full px-8">
                  Load more
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card/40 px-6 py-20 text-center">
              <h3 className="font-heading text-xl tracking-tight">
                Nothing here yet.
              </h3>
              <p className="max-w-sm text-sm text-sage">
                {categoryName
                  ? `No ${categoryName.toLowerCase()} lines are in the mart at the moment. The rest of the harvest is on the shelves.`
                  : "No products match these filters."}
              </p>
              <Button className="mt-2 rounded-full" asChild>
                <Link href="/mart">Browse everything</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
