"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { dishBySlug, type Dish } from "@/lib/data";
import { dishText } from "@/lib/i18n/localize";
import { useLang } from "@/lib/use-lang";

/**
 * A two-dish bundle. Pressing "Add combo" pushes *both* dishes to the cart as
 * separate lines rather than a synthetic bundle line, so the bag, the totals,
 * and the Restaurant group in `/bag` all keep working unchanged.
 */
export function ComboCard({
  dishIds,
  saving,
}: {
  dishIds: [string, string];
  saving: number;
}) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);
  const { lang, money, tr } = useLang();

  const dishes = dishIds
    .map((id) => dishBySlug(id))
    .filter((dish): dish is Dish => dish !== undefined);

  if (dishes.length < 2) return null;

  const copies = dishes.map((dish) => dishText(dish, lang));

  const listPrice = dishes.reduce((sum, dish) => sum + dish.price, 0);
  const comboPrice = listPrice - saving;
  const bundleLabel = copies.map((copy) => copy.name).join(" + ");

  return (
    <div className="flex h-full flex-col gap-4 rounded-[2px] border border-border bg-card p-6">
      <div>
        <h3 className="font-heading text-lg leading-tight">{bundleLabel}</h3>
        <p className="mt-1 text-xs text-sage">
          {tr(`Save ${money(saving)}`, `${money(saving)} बचत`)}
        </p>
      </div>

      <ul className="flex flex-col gap-2">
        {dishes.map((dish, index) => (
          <li
            key={dish.id}
            className="flex items-baseline justify-between gap-3 text-sm"
          >
            <span className="min-w-0 text-muted-foreground">
              {copies[index].name}
              <span className="text-xs text-sage">
                {" · "}
                {copies[index].portion}
              </span>
            </span>
            <span className="shrink-0 whitespace-nowrap text-xs text-muted-foreground line-through">
              {money(dish.price)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-baseline gap-1.5">
          <span className="font-heading text-2xl">{money(comboPrice)}</span>
          <span className="text-xs text-muted-foreground line-through">
            {money(listPrice)}
          </span>
        </p>

        <Button
          className="h-10 w-full rounded-[2px] px-5 sm:w-auto"
          onClick={() => {
            // The saving is taken off the second line so the bag totals match
            // the price advertised here. The combo note rides along as a
            // customization, which also gives the line its own id — a combo
            // never merges with, or undercuts, a plain add of the same dish.
            dishes.forEach((dish, index) => {
              const discount = index === 0 ? 0 : saving;
              addItem({
                kind: "dish",
                refId: dish.id,
                slug: dish.id,
                name: dish.name,
                nepaliName: dish.nepaliName,
                unit: dish.portion,
                unitPrice: dish.price - discount,
                qty: 1,
                image: dish.image,
                customizations: [
                  `${dishes.map((entry) => entry.name).join(" + ")} combo`,
                ],
              });
            });
            setAdded(true);
          }}
        >
          {added ? (
            <>
              <Check className="size-4" aria-hidden />
              {tr("Added", "थपियो")}
            </>
          ) : (
            <>
              <Plus className="size-4" aria-hidden />
              {tr("Add combo", "कम्बो थप्नुहोस्")}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
