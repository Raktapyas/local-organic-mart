import Image from "next/image";
import Link from "next/link";
import { Clock, Flame } from "lucide-react";

import { AddToCartButton } from "@/components/add-to-cart-button";
import { Button } from "@/components/ui/button";
import { T } from "@/components/translated";
import { spicePreset, type Dish, type Spice } from "@/lib/data";

const npr = new Intl.NumberFormat("en-NP");

/** How many flames each spice level renders. Non-spicy and aromatic are 0. */
const SPICE_FLAMES: Record<Spice, number> = {
  "Non-spicy": 0,
  Mild: 1,
  Medium: 2,
  Spicy: 3,
  Aromatic: 0,
};

/**
 * Dish card.
 *
 * Same square-edged plate and hairline rules as the product card, with the
 * kitchen's facts set as a single muted line rather than three separate
 * bordered tags. Diet and portion sit on the image as flat ink labels.
 */
export function DishCard({
  dish,
  /** Shows the "Customize" affordance linking to the dish detail route. */
  showCustomize = true,
}: {
  dish: Dish;
  showCustomize?: boolean;
}) {
  const flames = SPICE_FLAMES[dish.spice];

  return (
    <article className="group flex h-full flex-col border border-foreground/[0.08] bg-card/40 transition-colors duration-300 hover:border-gold/30">
      <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
        <Image
          src={dish.image}
          alt={dish.name}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 92vw"
          className="object-cover opacity-90 transition-all duration-700 group-hover:scale-[1.04] group-hover:opacity-100"
        />
        <span className="absolute top-3 left-3 bg-background/85 px-2 py-1 text-[9px] tracking-[0.18em] text-bone/80 uppercase backdrop-blur-sm">
          {dish.diet}
        </span>
        <span className="absolute right-3 bottom-3 bg-background/85 px-2 py-1 text-[9px] tracking-[0.14em] text-bone/70 backdrop-blur-sm">
          {dish.portion}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4 p-4">
        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
            <h3 className="font-heading text-lg leading-tight text-ivory">
              {dish.name}
            </h3>
            <span className="text-[10px] tracking-[0.06em] text-ash/60">
              {dish.nepaliName}
            </span>
          </div>
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ash">
            {dish.desc}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-foreground/[0.07] pt-3 text-[10px] tracking-[0.1em] text-ash/75 uppercase">
          <span className="flex items-center gap-1.5">
            <Clock className="size-3 text-gold/60" aria-hidden />
            {dish.prepTime}
          </span>
          <span aria-hidden className="size-1 rotate-45 bg-ash/25" />
          <span className="flex items-center gap-1.5">
            {dish.spice}
            {flames > 0 && (
              <span className="flex items-center gap-0.5" aria-label={`${dish.spice} spice`}>
                {Array.from({ length: flames }, (_, i) => (
                  <Flame key={i} className="size-2.5 fill-coral/80 text-coral/80" aria-hidden />
                ))}
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-foreground/[0.07] pt-3.5">
          <span className="tabular font-heading text-base text-ivory">
            Rs {npr.format(dish.price)}
          </span>
          <div className="flex items-center gap-2">
            {showCustomize && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-[9.5px] tracking-[0.16em] text-ash uppercase hover:bg-transparent hover:text-gold"
                asChild
              >
                <Link href={`/restaurant/${dish.id}`}>Customize</Link>
              </Button>
            )}
            <AddToCartButton
              className="inline-flex h-8 shrink-0 items-center justify-center bg-gold px-3.5 text-[9.5px] font-medium tracking-[0.16em] text-ink uppercase transition-opacity duration-200 hover:opacity-85"
              line={{
                kind: "dish",
                refId: dish.id,
                slug: dish.id,
                name: dish.name,
                nepaliName: dish.nepaliName,
                unit: dish.portions[0].serves,
                unitPrice: dish.price,
                qty: 1,
                image: dish.image,
                customizations: [spicePreset(dish)],
              }}
            >
              <T k="buttons.add" />
            </AddToCartButton>
          </div>
        </div>
      </div>
    </article>
  );
}
