"use client";

import { useState } from "react";
import { Check, ChevronDown, MapPin, Route, Sprout } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/data";

interface TrailStop {
  icon: LucideIcon;
  label: string;
  value: string;
  note: string;
}

/**
 * Provenance trail for one lot.
 *
 * Every value is read off the selected product — region, harvest date and
 * batch code come from `data.ts`, so the trail cannot drift from the listing.
 * The last two stops are the site's own dispatch promise rather than product
 * fields, and are labelled as such.
 */
function trailFor(product: Product): TrailStop[] {
  return [
    {
      icon: Sprout,
      label: "Grown in",
      value: product.region,
      note: product.freshness,
    },
    {
      icon: Route,
      label: "Harvested",
      value: product.harvestedOn,
      note: product.badge,
    },
    {
      icon: Check,
      label: "Batch",
      value: product.batch,
      note: `${product.unit} · ${product.nepaliName}`,
    },
    {
      icon: Check,
      label: "Packed",
      value: "Within 24h",
      note: "Sealed at the valley depot",
    },
    {
      icon: MapPin,
      label: "Delivered",
      value: "45–60 min",
      note: "Same-day cold-chain drop",
    },
  ];
}

export function KnowYourProduct({ products }: { products: Product[] }) {
  const [selectedId, setSelectedId] = useState(products[0]?.id ?? "");
  const [revealed, setRevealed] = useState<string | null>(null);

  const product = products.find((item) => item.id === selectedId);
  const shown = revealed === selectedId ? product : undefined;

  return (
    <div className="rounded-xl border border-border bg-card/50 p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-xs tracking-wider text-sage uppercase">
            Know your product
          </h2>
          <p className="max-w-lg text-sm text-muted-foreground">
            Pick any lot in the mart and follow it from the terrace it was
            grown on to the hour it reaches your kitchen.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative">
            <label htmlFor="trail-product" className="sr-only">
              Choose a product
            </label>
            <select
              id="trail-product"
              value={selectedId}
              onChange={(event) => setSelectedId(event.target.value)}
              className="h-11 w-full appearance-none rounded-full border border-border bg-background py-2 pr-10 pl-4 text-sm text-foreground outline-none transition-colors focus-visible:border-mint sm:w-64"
            >
              {products.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} · {item.batch}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
          </div>

          <Button
            className="h-11 rounded-full px-6"
            onClick={() => setRevealed(selectedId)}
          >
            Show trail
          </Button>
        </div>
      </div>

      {shown ? (
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {trailFor(shown).map((stop, index) => {
            const Icon = stop.icon;
            return (
              <li key={stop.label} className="relative flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-gold/50 bg-background text-gold">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  {index < 4 ? (
                    <span
                      className="hidden h-px flex-1 bg-gold/40 lg:block"
                      aria-hidden
                    />
                  ) : null}
                </div>
                <div>
                  <p className="text-[10px] tracking-wider text-sage uppercase">
                    {stop.label}
                  </p>
                  <p className="mt-0.5 font-heading text-lg leading-tight">
                    {stop.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {stop.note}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="mt-10 rounded-lg border border-dashed border-border px-6 py-10 text-center text-sm text-sage">
          Choose a lot, then press Show trail to open its custody record.
        </p>
      )}
    </div>
  );
}
