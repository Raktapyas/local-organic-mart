"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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
  provenanceMarks,
  sortOptions,
  type Product,
} from "@/lib/data";
import { categoryText } from "@/lib/i18n/localize";
import { contentNe } from "@/lib/i18n/content-ne";
import { useLang } from "@/lib/use-lang";
import {
  applyMartFilters,
  hasActiveFilters,
  priceCeilingFor,
  type MartCategoryFilter,
  type MartFilterState,
  type MartSort,
} from "@/lib/mart-filters";

/** Cards shown before "Load more" adds the next batch. */
const PAGE_SIZE = 12;

type ViewState = MartFilterState & { visible: number };

export interface MartViewProps {
  /** Products already scoped to the route — every item on `/mart`. */
  items: Product[];
  /** Nav category id from `/mart/[category]`. Absent on `/mart`. */
  categoryId?: string;
  /** Category name, used as the h1 and in the result count. */
  categoryName?: string;
  /** Terroir note, used as the subline. */
  categoryNote?: string;
  /** Sidebar department options. Omitted on a scoped department route. */
  categoryFilters?: MartCategoryFilter[];
}

/**
 * Shared Mart body for `/mart` and `/mart/[category]`.
 *
 * The category pages are the same grid and the same sidebar with one filter
 * pre-applied: the route scopes `items` before it reaches this component, the
 * matching pill is marked current, and the result count names the department.
 * Attribute, department, price and sort controls filter the list in place; the
 * server only sends the catalogue, so every change is immediate.
 */
export function MartView({
  items,
  categoryId,
  categoryName,
  categoryNote,
  categoryFilters,
}: MartViewProps) {
  const ceiling = useMemo(() => priceCeilingFor(items), [items]);
  const { lang, money, tr } = useLang();

  /*
    The department name arrives in English from the server, which cannot read
    the language store. Resolving it here from `categoryId` keeps the h1, the
    result count and the subline in step with the toggle without shipping a
    second copy of the catalogue.
  */
  const department = categoryId
    ? categories.find((category) => category.id === categoryId)
    : undefined;
  const heading = department
    ? categoryText(department, lang).name
    : (categoryName ?? tr("Mart", "मार्ट"));
  const note = department
    ? categoryText(department, lang).note
    : (categoryNote ?? tr("Fresh produce, dairy, pantry, meat and more.", "ताजा तरकारी, दुग्ध पदार्थ, भण्डार, मासु र थप।"));

  const [state, setState] = useState<ViewState>(() => ({
    attributes: [],
    categories: [],
    maxPrice: priceCeilingFor(items),
    sort: "Featured",
    visible: PAGE_SIZE,
  }));
  const [filtersOpen, setFiltersOpen] = useState(false);

  const list = useMemo(
    () => applyMartFilters(items, state, categoryFilters),
    [items, state, categoryFilters],
  );
  const visible = list.slice(0, state.visible);
  const filtering = hasActiveFilters(state, ceiling);
  const activeCount =
    state.attributes.length +
    state.categories.length +
    (state.maxPrice < ceiling ? 1 : 0);

  function toggleAttribute(id: string) {
    setState((current) => ({
      ...current,
      attributes: current.attributes.includes(id)
        ? current.attributes.filter((item) => item !== id)
        : [...current.attributes, id],
      visible: PAGE_SIZE,
    }));
  }

  function toggleCategory(id: string) {
    setState((current) => ({
      ...current,
      categories: current.categories.includes(id)
        ? current.categories.filter((item) => item !== id)
        : [...current.categories, id],
      visible: PAGE_SIZE,
    }));
  }

  function setMaxPrice(maxPrice: number) {
    setState((current) => ({ ...current, maxPrice, visible: PAGE_SIZE }));
  }

  function setSort(sort: MartSort) {
    setState((current) => ({ ...current, sort, visible: PAGE_SIZE }));
  }

  function clearAll() {
    setState({
      attributes: [],
      categories: [],
      maxPrice: ceiling,
      sort: "Featured",
      visible: PAGE_SIZE,
    });
  }

  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-6 pt-12 pb-8">
        <SectionHeader
          as="h1"
          title={heading}
          subline={note}
          aside={
            <CountdownChip
              closesAt={dealsCloseAt}
              label="Deals end"
              labelNe="अफर समाप्त"
            />
          }
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
              aria-label={tr("Search the mart", "मार्टमा खोज्नुहोस्")}
              placeholder={tr(
                "Search provisions, farms, dates",
                "सामान, खेत वा बाली उठाएको मिति खोज्नुहोस्",
              )}
              className="h-11 w-full rounded-[2px] border border-input bg-card/70 pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-mint focus-visible:ring-3 focus-visible:ring-ring/40"
            />
          </form>

          <nav aria-label={tr("Product categories", "उत्पादन श्रेणी")}>
            <ul className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <li>
                <Link
                  href="/mart"
                  aria-current={categoryId ? undefined : "page"}
                  className={
                    categoryId
                      ? "inline-flex h-10 shrink-0 items-center whitespace-nowrap rounded-[2px] border border-border px-4 text-sm text-muted-foreground transition-colors hover:border-mint/35 hover:text-foreground"
                      : "inline-flex h-10 shrink-0 items-center whitespace-nowrap rounded-[2px] bg-mint px-4 text-sm font-medium text-primary-foreground"
                  }
                >
                  {tr("All", "सबै")}
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
                          ? "inline-flex h-10 shrink-0 items-center whitespace-nowrap rounded-[2px] bg-mint px-4 text-sm font-medium text-primary-foreground"
                          : "inline-flex h-10 shrink-0 items-center whitespace-nowrap rounded-[2px] border border-border px-4 text-sm text-muted-foreground transition-colors hover:border-mint/35 hover:text-foreground"
                      }
                    >
                      {categoryText(category, lang).name}
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
            <h2 className="hidden items-center gap-2 font-heading text-base lg:flex">
              <SlidersHorizontal className="size-4 text-sage" aria-hidden />
              {tr("Filters", "फिल्टर")}
            </h2>

            {/* Below `lg` the panel collapses so the grid is the first thing
                on screen; the toggle carries the active-filter count. */}
            <button
              type="button"
              onClick={() => setFiltersOpen((open) => !open)}
              aria-expanded={filtersOpen}
              aria-controls="mart-filters"
              aria-label={
                activeCount > 0
                  ? tr(
                      `Filters, ${activeCount} active`,
                      `फिल्टर, ${activeCount} सक्रिय`,
                    )
                  : tr("Filters", "फिल्टर")
              }
              className="flex items-center gap-2 font-heading text-base lg:hidden"
            >
              <SlidersHorizontal className="size-4 text-sage" aria-hidden />
              {tr("Filters", "फिल्टर")}
              {activeCount > 0 ? (
                <span className="rounded-full bg-mint px-1.5 text-[10px] leading-4 text-primary-foreground">
                  {activeCount}
                </span>
              ) : null}
              <ChevronDown
                className={`size-4 text-sage transition-transform ${
                  filtersOpen ? "rotate-180" : ""
                }`}
                aria-hidden
              />
            </button>

            <button
              type="button"
              onClick={clearAll}
              className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-3" aria-hidden />
              {tr("Clear all", "सबै हटाउनुहोस्")}
            </button>
          </div>

          <div
            id="mart-filters"
            className={`mt-6 flex-col gap-8 ${
              filtersOpen ? "flex" : "hidden"
            } lg:flex`}
          >
            <fieldset>
              <legend className="text-xs tracking-wider text-sage uppercase">
                {tr("Filter Attributes", "फिल्टर विशेषता")}
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {filterAttributes.map((attribute, index) => (
                  <label
                    key={attribute.id}
                    className="cursor-pointer rounded-[2px] border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-mint/35 has-checked:border-mint has-checked:bg-mint/12 has-checked:text-mint"
                  >
                    <input
                      type="checkbox"
                      name={attribute.id}
                      checked={state.attributes.includes(attribute.id)}
                      onChange={() => toggleAttribute(attribute.id)}
                      className="sr-only"
                    />
                    {tr(
                      attribute.label,
                      contentNe.filters.attributes[index] ?? attribute.label,
                    )}
                  </label>
                ))}
              </div>
            </fieldset>

            {categoryFilters && categoryFilters.length > 0 ? (
              <fieldset>
                <legend className="text-xs tracking-wider text-sage uppercase">
                  {tr("Categories", "श्रेणी")}
                </legend>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {categoryFilters.map((category) => {
                    const source = categories.find(
                      (entry) => entry.id === category.id,
                    );
                    return (
                      <li key={category.id}>
                        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
                          <input
                            type="checkbox"
                            name="category"
                            value={category.id}
                            checked={state.categories.includes(category.id)}
                            onChange={() => toggleCategory(category.id)}
                            className="size-3.5 shrink-0 appearance-none border border-foreground/25 bg-transparent transition-colors checked:border-gold checked:bg-gold"
                          />
                          {source
                            ? categoryText(source, lang).name
                            : category.name}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </fieldset>
            ) : null}

            <fieldset>
              <legend className="text-xs tracking-wider text-sage uppercase">
                {tr("Price Ceiling", "अधिकतम मूल्य")}
              </legend>
              <p className="mt-3 font-heading text-lg">
                {money(0)} &ndash; {money(state.maxPrice)}
              </p>
              <label className="mt-3 block">
                <span className="sr-only">
                  {tr("Maximum price", "अधिकतम मूल्य")}
                </span>
                <input
                  type="range"
                  name="maxPrice"
                  min={0}
                  max={ceiling}
                  step={10}
                  value={state.maxPrice}
                  onChange={(event) => setMaxPrice(Number(event.target.value))}
                  className="w-full accent-gold"
                />
              </label>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>
                  {tr("Min", "न्यूनतम")}: {money(0)}
                </span>
                <span>
                  {tr("Max", "अधिकतम")}: {money(ceiling)}
                </span>
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-xs tracking-wider text-sage uppercase">
                {tr("Verified Provenance", "प्रमाणित उत्पत्ति")}
              </legend>
              <ul className="mt-2 flex flex-col gap-2">
                {provenanceMarks.map((mark) => (
                  <li
                    key={mark.id}
                    className="flex items-center justify-between gap-2 rounded-[2px] border border-border bg-card/50 px-3 py-2 text-xs text-muted-foreground"
                  >
                    {tr(
                      mark.label,
                      contentNe.provenance[
                        mark.id as keyof typeof contentNe.provenance
                      ] ?? mark.label,
                    )}
                    <BadgeCheck
                      className="size-4 shrink-0 text-sage"
                      aria-hidden
                    />
                  </li>
                ))}
              </ul>
            </fieldset>
          </div>
        </aside>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[17px]" aria-live="polite">
              {department || categoryName ? `${heading} · ` : ""}
              {tr(
                `${list.length} ${list.length === 1 ? "product" : "products"}`,
                `${list.length} उत्पादन`,
              )}
            </p>

            <div className="flex items-center gap-3">
              <label
                htmlFor="sort"
                className="text-xs tracking-wider text-sage uppercase"
              >
                {tr("Sort:", "क्रम:")}
              </label>
              <div className="relative">
                <select
                  id="sort"
                  name="sort"
                  value={state.sort}
                  onChange={(event) => setSort(event.target.value as MartSort)}
                  className="appearance-none rounded-[2px] border border-border bg-card py-2 pr-9 pl-4 text-xs text-foreground outline-none transition-colors focus:border-mint"
                >
                  {sortOptions.map((option, index) => (
                    <option key={option} value={option}>
                      {tr(
                        option,
                        contentNe.filters.sortOptions[index] ?? option,
                      )}
                    </option>
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
                {visible.map((product, index) => (
                  <li key={product.id}>
                    <ProductCard product={product} priority={index === 0} />
                  </li>
                ))}
              </ul>

              {list.length > state.visible ? (
                <div className="flex flex-col items-center gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-[2px] px-8"
                    onClick={() =>
                      setState((current) => ({
                        ...current,
                        visible: current.visible + PAGE_SIZE,
                      }))
                    }
                  >
                    {tr("Load more", "अझै देखाउनुहोस्")}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    {tr(
                      `Showing ${visible.length} of ${list.length}`,
                      `${list.length} मध्ये ${visible.length} देखाइएका`,
                    )}
                  </p>
                </div>
              ) : null}
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 rounded-[2px] border border-border bg-card/40 px-6 py-20 text-center">
              <h3 className="font-heading text-xl tracking-tight">
                {tr("Nothing here yet.", "यहाँ अझै केही छैन।")}
              </h3>
              <p className="max-w-sm text-sm text-sage">
                {filtering
                  ? tr(
                      "No products match these filters. Loosen one, or clear them all.",
                      "यी फिल्टरसँग मिल्ने उत्पादन छैन। एउटा फुकाउनुहोस् वा सबै हटाउनुहोस्।",
                    )
                  : department || categoryName
                    ? tr(
                        `No ${(department?.name ?? categoryName ?? "").toLowerCase()} lines are in the mart at the moment. The rest of the harvest is on the shelves.`,
                        `अहिले मार्टमा ${heading} का उत्पादन छैनन्। बाँकी बाली र्‍याकमै छ।`,
                      )
                    : tr(
                        "No products are in the mart at the moment.",
                        "अहिले मार्टमा कुनै उत्पादन छैन।",
                      )}
              </p>
              {filtering ? (
                <Button
                  type="button"
                  className="mt-2 rounded-[2px]"
                  onClick={clearAll}
                >
                  {tr("Clear filters", "फिल्टर हटाउनुहोस्")}
                </Button>
              ) : (
                <Button className="mt-2 rounded-[2px]" asChild>
                  <Link href="/mart">{tr("Browse everything", "सबै हेर्नुहोस्")}</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
