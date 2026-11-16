"use client";

import { Search as SearchIcon } from "lucide-react";

import { useLang } from "@/lib/use-lang";

/**
 * The search box on `/search`.
 *
 * A leaf client component: the page around it stays a server component, and
 * only this form ships to the browser. It exists because `aria-label` and
 * `placeholder` are attributes, and no amount of server-rendered copy can swap
 * them once the language changes.
 */
export function SearchField({ defaultValue }: { defaultValue?: string }) {
  const { tr } = useLang();

  return (
    <form action="/search" role="search" className="relative mt-8 max-w-xl">
      <SearchIcon
        className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        aria-label={tr("Search the mart", "मार्टमा खोज्नुहोस्")}
        placeholder={tr(
          "Search provisions, dishes, or harvest dates",
          "सामान, परिकार वा बाली उठाएको मिति खोज्नुहोस्",
        )}
        className="h-11 w-full rounded-[2px] border border-input bg-card/70 pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-mint focus-visible:ring-3 focus-visible:ring-ring/40"
      />
    </form>
  );
}
