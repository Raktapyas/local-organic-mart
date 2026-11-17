"use client";

import Image from "next/image";
import { useState } from "react";
import { Check, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import type { Basket } from "@/lib/data";
import { basketText } from "@/lib/i18n/localize";
import { useLang } from "@/lib/use-lang";

export interface BasketCardProps {
  basket: Basket;
  /** Festival cards get a gold hairline; smart bundles stay quiet. */
  accent?: "gold" | "quiet";
  /** Overrides the mint "Add entire basket" label for festival wording. */
  ctaLabel?: string;
  ctaLabelNe?: string;
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
  ctaLabelNe = "सम्पूर्ण टोकरी थप्नुहोस्",
}: BasketCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);
  const { lang, money, tr } = useLang();
  const copy = basketText(basket, lang);
  const label = lang === "ne" ? ctaLabelNe : ctaLabel;

  return (
    <div
      className={`group relative flex min-h-72 flex-col justify-end overflow-hidden rounded-[2px] border ${
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
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/45" />

      <div className="relative flex flex-col gap-3 p-6">
        <div>
          <p
            className={`text-[9.5px] tracking-[0.24em] uppercase ${
              accent === "gold" ? "text-gold" : "text-ash"
            }`}
          >
            {copy.tag}
          </p>
          <h3 className="mt-1 font-heading text-xl leading-tight">
            {copy.name}
          </h3>
          {lang === "en" ? (
            <p className="text-xs text-sage">{basket.nepaliName}</p>
          ) : null}
        </div>

        <p className="text-sm text-muted-foreground">
          {tr(
            `${copy.includes.length} items`,
            `${copy.includes.length} वस्तु`,
          )}{" "}
          ·{" "}
          <span className="font-heading text-base text-foreground">
            {money(basket.price)}
          </span>
        </p>

        <Button
          variant={accent === "gold" ? "default" : "outline"}
          className={
            accent === "gold"
              ? "h-10 w-fit rounded-[2px] px-5 text-[11px] tracking-[0.18em] uppercase"
              : "h-10 w-fit rounded-[2px] border-gold/35 px-5 text-[11px] tracking-[0.18em] text-gold uppercase hover:border-gold hover:bg-gold hover:text-ink"
          }
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
              {tr("Added to bag", "झोलामा थपियो")}
            </>
          ) : (
            <>
              <Plus className="size-4" aria-hidden />
              {label}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
