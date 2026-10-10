"use client";

import { useMemo, useState } from "react";

import { DishCard } from "@/components/dish-card";
import type { Dish, DishTag } from "@/lib/data";

const FILTERS: { id: DishTag | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "popular", label: "Popular" },
  { id: "healthy", label: "Healthy" },
  { id: "organic", label: "Organic" },
  { id: "nepali-traditional", label: "Nepali traditional" },
  { id: "snacks", label: "Snacks" },
  { id: "drinks", label: "Drinks" },
];

export function DishFilterGrid({ dishes }: { dishes: Dish[] }) {
  const [active, setActive] = useState<DishTag | "all">("all");

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
                      ? "inline-flex h-10 shrink-0 items-center rounded-full bg-mint px-5 text-sm font-medium text-primary-foreground transition-transform duration-150 active:scale-95"
                      : "inline-flex h-10 shrink-0 items-center rounded-full border border-border bg-card px-5 text-sm text-muted-foreground transition-colors duration-200 hover:border-mint/35 hover:text-foreground"
                  }
                >
                  {filter.label}
                </button>
              </li>
            );
          })}
        </ul>
        <p className="shrink-0 text-xs text-muted-foreground">
          Showing {visible.length} of {dishes.length} dishes
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
        <p className="text-sm text-muted-foreground">No dishes in this category</p>
      )}
    </div>
  );
}