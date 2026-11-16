"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ProductCard } from "@/components/product-card";
import { T } from "@/components/translated";
import { products, productsInCategory } from "@/lib/data";
import { useLang } from "@/lib/use-lang";

/**
 * Tabbed bestsellers rail.
 *
 * Tabs are department slugs resolved through the existing
 * `productsInCategory` bridge, so a tab can never point at a department with
 * nothing in it — the same membership map the Mart pages use.
 *
 * The rail is deliberately a client island: only the tab strip and the four
 * visible cards hydrate, not the rest of Home.
 *
 * Presentation: the tab strip is a hairline row of labels with a gold
 * underline on the active one. Pills would have made the strip the loudest
 * thing in the band, which is the opposite of what a register should do.
 */
const TABS = [
  { id: "all", label: "All", labelNe: "सबै" },
  { id: "produce", label: "Fresh produce", labelNe: "ताजा तरकारी" },
  { id: "dairy", label: "Dairy", labelNe: "दुग्ध पदार्थ" },
  { id: "pantry", label: "Pantry", labelNe: "भण्डार" },
  { id: "herbs", label: "Herbs", labelNe: "जडीबुटी" },
] as const;

export function BestsellersRail({
  /** Ids already on the adjacent Deals rail. */
  excludeIds = [],
}: {
  excludeIds?: string[];
}) {
  const [tab, setTab] = useState<string>("all");
  const excluded = new Set(excludeIds);
  const { tr } = useLang();

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
    <section className="border-b border-foreground/[0.06]">
      <div className="mx-auto w-full max-w-[88rem] px-6 py-16 lg:px-10 lg:py-24">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <span className="eyebrow shrink-0">
              {tr("The register", "बिक्रीको सूची")}
            </span>
            <span aria-hidden className="rule-fade flex-1" />
          </div>

          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <h2 className="text-[clamp(1.65rem,2.6vw,2.4rem)] leading-[1.05] font-light tracking-[-0.025em] text-ivory">
              <T k="sections.bestsellers" />
            </h2>
            <p className="max-w-sm text-xs leading-relaxed text-ash">
              {tr(
                "Ranked by what leaves the cold store fastest.",
                "चिसो भण्डारबाट सबैभन्दा छिटो बिक्नेका आधारमा क्रमबद्ध।",
              )}
            </p>
          </div>
        </div>

        <div
          role="tablist"
          aria-label={tr("Bestseller departments", "सर्वाधिक बिक्रीका विभाग")}
          className="mt-10 flex flex-wrap gap-x-7 gap-y-2 border-b border-foreground/[0.08]"
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
                className={`relative -mb-px pb-3 text-[10px] tracking-[0.2em] uppercase transition-colors duration-200 ${
                  active
                    ? "text-gold"
                    : "text-ash/70 hover:text-ivory"
                }`}
              >
                {tr(entry.label, entry.labelNe)}
                <span
                  aria-hidden
                  className={`absolute inset-x-0 -bottom-px h-px bg-gold transition-transform duration-300 ${
                    active ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>
            );
          })}
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {list.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>

        <div className="mt-14 flex justify-center">
          <Link
            href="/mart"
            className="group inline-flex h-11 items-center gap-2 border border-foreground/15 px-7 text-[10.5px] tracking-[0.2em] text-ivory uppercase transition-colors duration-200 hover:border-gold/60 hover:text-gold"
          >
            {tr("Shop all bestsellers", "सबै सर्वाधिक बिक्री हेर्नुहोस्")}
            <ArrowRight
              className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
