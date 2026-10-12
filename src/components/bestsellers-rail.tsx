"use client";

import { useState } from "react";
import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import { T } from "@/components/translated";
import { products, productsInCategory } from "@/lib/data";

/**
 * Tabbed bestsellers rail.
 *
 * Tabs are department slugs resolved through the existing
 * `productsInCategory` bridge, so a tab can never point at a department with
 * nothing in it — the same membership map the Mart pages use.
 *
 * The rail is deliberately a client island: only the tab strip and the four
 * visible cards hydrate, not the rest of Home.
 */
const TABS = [
  { id: "all", label: "All" },
  { id: "produce", label: "Fresh produce" },
  { id: "dairy", label: "Dairy" },
  { id: "pantry", label: "Pantry" },
  { id: "herbs", label: "Herbs" },
] as const;

export function BestsellersRail({
  /** Ids already on the adjacent Deals rail. */
  excludeIds = [],
}: {
  excludeIds?: string[];
}) {
  const [tab, setTab] = useState<string>("all");
  const excluded = new Set(excludeIds);

  /*
    The catalogue is 21 lines across ten departments, so no department holds
    four products — dairy has two. A fixed four-column grid would therefore
    leave dead slots on most tabs, so the rail lays out whatever the tab
    actually holds and centres it. Four columns is what it reaches when the
    data supports it.
  */
  /*
    The Deals rail sits directly below this one, and the catalogue happens to
    declare all four discounted items first — so an unfiltered "All" tab
    rendered an identical set twice. `excludeIds` keeps the two rails
    disjoint. Per-category tabs are left unfiltered: departments hold two to
    four products each, so excluding there would empty them out.
  */
  const list =
    tab === "all"
      ? products.filter((p) => !excluded.has(p.id)).slice(0, 4)
      : productsInCategory(tab).slice(0, 4);

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-10 sm:py-20">
      <h2 className="font-heading text-3xl tracking-tight">
        <T k="sections.bestsellers" />
      </h2>

      <div
        role="tablist"
        aria-label="Bestseller departments"
        className="mt-6 flex flex-wrap gap-2"
      >
        {TABS.map((entry) => {
          const active = tab === entry.id;
          return (
            <button
              key={entry.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(entry.id)}
              className={
                active
                  ? "rounded-full bg-mint px-4 py-2 text-sm text-primary-foreground transition-colors"
                  : "rounded-full border border-foreground/10 px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-mint/40 hover:text-mint"
              }
            >
              {entry.label}
            </button>
          );
        })}
      </div>

      <ul className="mt-8 flex flex-wrap justify-center gap-4">
        {list.map((product) => (
          <li
            key={product.id}
            className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)]"
          >
            <ProductCard product={product} />
          </li>
        ))}
      </ul>

      <div className="mt-8 flex justify-center">
        <Link
          href="/mart"
          className="rounded-full bg-mint px-7 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Shop all bestsellers
        </Link>
      </div>
    </section>
  );
}
