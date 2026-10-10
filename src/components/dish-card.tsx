import Image from "next/image";
import Link from "next/link";
import { Clock, Flame } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Dish, Spice } from "@/lib/data";

const npr = new Intl.NumberFormat("en-NP");

/** How many flames each spice level renders. Non-spicy and aromatic are 0. */
const SPICE_FLAMES: Record<Spice, number> = {
  "Non-spicy": 0,
  Mild: 1,
  Medium: 2,
  Spicy: 3,
  Aromatic: 0,
};

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
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-mint/35">
      <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
        <Image
          src={dish.image}
          alt={dish.name}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 92vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 rounded-full border border-border bg-background/80 px-2.5 py-1 text-[11px] text-sage backdrop-blur-md">
          {dish.diet}
        </span>
        <span className="absolute right-3 bottom-3 rounded-full border border-border bg-background/80 px-2.5 py-0.5 text-[11px] backdrop-blur-md">
          {dish.portion}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4 p-5">
        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
            <h3 className="font-heading text-lg font-medium transition-colors group-hover:text-mint">
              {dish.name}
            </h3>
            <span className="text-xs text-muted-foreground">{dish.nepaliName}</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {dish.desc}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3 text-xs text-sage">
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" aria-hidden />
            {dish.prepTime}
          </span>

          <span className="flex items-center gap-1.5">
            {dish.spice}
            {flames > 0 && (
              <span className="flex items-center gap-0.5" aria-label={`${dish.spice} spice`}>
                {Array.from({ length: flames }, (_, i) => (
                  <Flame key={i} className="size-3.5 fill-coral text-coral" aria-hidden />
                ))}
              </span>
            )}
          </span>

          <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-muted-foreground">
            {dish.diet}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
          <span className="font-heading text-lg font-semibold">
            Rs {npr.format(dish.price)}
          </span>
          <div className="flex items-center gap-2">
            {showCustomize && (
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                asChild
              >
                <Link href={`/restaurant/${dish.id}`}>Customize</Link>
              </Button>
            )}
            <Button size="sm" className="rounded-full">
              Add
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}