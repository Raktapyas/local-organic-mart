"use client";

import { useMemo, useState } from "react";

import { DishCard } from "@/components/dish-card";
import type { Dish, DishTag } from "@/lib/data";
import { useLang } from "@/lib/use-lang";

const FILTERS: { id: DishTag | "all"; label: string; labelNe: string }[] = [
  { id: "all", label: "All", labelNe: "सबै" },
  { id: "popular", label: "Popular", labelNe: "लोकप्रिय" },
  { id: "healthy", label: "Healthy", labelNe: "स्वस्थ" },
  { id: "organic", label: "Organic", labelNe: "जैविक" },
  {
    id: "nepali-traditional",
    label: "Nepali traditional",
    labelNe: "परम्परागत नेपाली",
  },
  { id: "snacks", label: "Snacks", labelNe: "खाजा" },
  { id: "drinks", label: "Drinks", labelNe: "पेय" },
];

export function DishFilterGrid({ dishes }: { dishes: Dish[] }) {
  const [active, setActive] = useState<DishTag | "all">("all");
  const { tr } = useLang();

  const visible = useMemo(
    () =>
      active === "all"
        ? dishes
        : dishes.filter((dish) => dish.tags.includes(active)),
    [active, dishes],
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <ul className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 sm:mx-0 sm:px-0">
          {FILTERS.map((filter) => {
            const isActive = filter.id === active;
            return (
              <li key={filter.id}>
                <button
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActive(filter.id)}
                  className={
                    isActive
                      ? "inline-flex h-10 shrink-0 items-center rounded-[2px] bg-mint px-5 text-sm font-medium text-primary-foreground transition-transform duration-150 active:scale-95"
                      : "inline-flex h-10 shrink-0 items-center rounded-[2px] border border-border bg-card px-5 text-sm text-muted-foreground transition-colors duration-200 hover:border-mint/35 hover:text-foreground"
                  }
                >
                  {tr(filter.label, filter.labelNe)}
                </button>
              </li>
            );
          })}
        </ul>
        <p className="shrink-0 text-xs text-muted-foreground">
          {tr(
            `Showing ${visible.length} of ${dishes.length} dishes`,
            `${dishes.length} मध्ये ${visible.length} परिकार देखाइएका`,
          )}
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((dish) => (
          <li key={dish.id}>
            <DishCard dish={dish} />
          </li>
        ))}
      </ul>

      {visible.length === 0 && (
        <p className="text-sm text-muted-foreground">
          {tr("No dishes in this category", "यो श्रेणीमा कुनै परिकार छैन")}
        </p>
      )}
    </div>
  );
}