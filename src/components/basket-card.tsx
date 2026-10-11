"use client";

import Image from "next/image";
import { useState } from "react";
import { Check, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import type { Basket } from "@/lib/data";

const npr = new Intl.NumberFormat("en-NP");

export interface BasketCardProps {
  basket: Basket;
  /** Festival cards get a gold hairline; smart bundles stay quiet. */
  accent?: "gold" | "quiet";
  /** Overrides the mint "Add entire basket" label for festival wording. */
  ctaLabel?: string;
}

/**
 * One tap puts the whole basket in the bag as a single line.
 *
 * The basket is *not* expanded into its individual items — it lands as one
 * `kind: "basket"` line so the bag shows a readable basket group instead of
 * a wall of produce. The bundle name rides as the customization, which also
 * gives the line its own id so it never merges with a differently-configured
 * add of the same basket.
 */
export function BasketCard({
  basket,
  accent = "quiet",
  ctaLabel = "Add entire basket",
}: BasketCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  return (
    <div
      className={`group relative flex min-h-72 flex-col justify-end overflow-hidden rounded-xl border ${
        accent === "gold" ? "border-gold/40" : "border-border"
      }`}
    >
      <Image
        src={basket.image ?? "/images/category-local.jpg"}
        alt=""
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      {/* Scrim carries the contrast; the card stays one short block of copy. */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />

      <div className="relative flex flex-col gap-3 p-6">
        <div>
          <p
            className={`text-[10px] tracking-wider uppercase ${
              accent === "gold" ? "text-gold" : "text-sage"
            }`}
          >
            {basket.tag}
          </p>
          <h3 className="mt-1 font-heading text-xl leading-tight">
            {basket.name}
          </h3>
          <p className="text-xs text-sage">{basket.nepaliName}</p>
        </div>

        <p className="text-sm text-muted-foreground">
          {basket.includes.length} items ·{" "}
          <span className="font-heading text-base text-foreground">
            Rs {npr.format(basket.price)}
          </span>
        </p>

        <Button
          className="w-fit rounded-full px-5"
          onClick={() => {
            addItem({
              kind: "basket",
              refId: basket.id,
              slug: basket.id,
              name: basket.name,
              nepaliName: basket.nepaliName,
              unit: `${basket.includes.length} items`,
              unitPrice: basket.price,
              qty: 1,
              customizations: [basket.name],
            });
            setAdded(true);
          }}
        >
          {added ? (
            <>
              <Check className="size-4" aria-hidden />
              Added to bag
            </>
          ) : (
            <>
              <Plus className="size-4" aria-hidden />
              {ctaLabel}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
