"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";

import { QuantityStepper } from "@/components/quantity-stepper";
import { Button } from "@/components/ui/button";
import {
  spiceLevels,
  spicePreset,
  type Dish,
  type DishSpice,
} from "@/lib/data";

const npr = new Intl.NumberFormat("en-NP");

export function DishCustomizer({ dish }: { dish: Dish }) {
  const [portionId, setPortionId] = useState(dish.portions[0].id);
  const [spice, setSpice] = useState<DishSpice>(() => spicePreset(dish));
  const [addons, setAddons] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  const portion = dish.portions.find((p) => p.id === portionId) ?? dish.portions[0];

  const total = useMemo(() => {
    const sides = dish.addons
      .filter((addon) => addons.includes(addon.id))
      .reduce((sum, addon) => sum + addon.price, 0);
    return (dish.price + portion.price + sides) * quantity;
  }, [addons, dish, portion, quantity]);

  function toggleAddon(id: string) {
    setAddons((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Portion */}
      <fieldset className="rounded-xl border border-border bg-card p-5">
        <legend className="px-1 text-sm">Portion</legend>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {dish.portions.map((option) => {
            const selected = option.id === portionId;
            return (
              <label
                key={option.id}
                className={
                  selected
                    ? "flex cursor-pointer items-center justify-between rounded-lg border border-mint bg-mint/10 p-3.5"
                    : "flex cursor-pointer items-center justify-between rounded-lg border border-border p-3.5 transition-colors hover:border-mint/35"
                }
              >
                <input
                  type="radio"
                  name="portion"
                  value={option.id}
                  checked={selected}
                  onChange={() => setPortionId(option.id)}
                  className="sr-only"
                />
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className={
                      selected
                        ? "flex size-4 items-center justify-center rounded-full border border-mint"
                        : "flex size-4 items-center justify-center rounded-full border border-border"
                    }
                  >
                    {selected && <span className="size-2 rounded-full bg-mint" />}
                  </span>
                  <span className={selected ? "text-sm text-mint" : "text-sm"}>
                    {option.label}
                  </span>
                </span>
                <span className="text-xs text-sage">
                  {option.price === 0 ? option.serves : `+Rs ${option.price}`}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Spice level */}
      <fieldset className="rounded-xl border border-border bg-card p-5">
        <legend className="px-1 text-sm">Spice level</legend>
        <div className="mt-3 grid grid-cols-3 gap-2.5">
          {spiceLevels.map((level) => {
            const selected = level.id === spice;
            return (
              <label
                key={level.id}
                className={
                  selected
                    ? "flex cursor-pointer items-center justify-center rounded-lg border border-mint bg-mint/10 p-3 text-sm text-mint"
                    : "flex cursor-pointer items-center justify-center rounded-lg border border-border p-3 text-sm text-muted-foreground transition-colors hover:border-mint/35 hover:text-foreground"
                }
              >
                <input
                  type="radio"
                  name="spice"
                  value={level.id}
                  checked={selected}
                  onChange={() => setSpice(level.id)}
                  className="sr-only"
                />
                {level.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Add-ons */}
      <fieldset className="rounded-xl border border-border bg-card p-5">
        <legend className="px-1 text-sm">Add-ons</legend>
        <ul className="mt-3 flex flex-col gap-2.5">
          {dish.addons.map((addon) => {
            const checked = addons.includes(addon.id);
            return (
              <li key={addon.id}>
                <label className="flex cursor-pointer items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      name="addon"
                      value={addon.id}
                      checked={checked}
                      onChange={() => toggleAddon(addon.id)}
                      className="sr-only"
                    />
                    <span
                      aria-hidden
                      className={
                        checked
                          ? "flex size-4 items-center justify-center rounded border-mint bg-mint text-primary-foreground"
                          : "flex size-4 items-center justify-center rounded border-border"
                      }
                    >
                      {checked && <Check className="size-3" />}
                    </span>
                    <span className={checked ? "text-foreground" : "text-muted-foreground"}>
                      {addon.label}
                    </span>
                  </span>
                  <span className="text-xs text-sage">+Rs {addon.price}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>

      <div className="flex flex-wrap items-center gap-3">
        <QuantityStepper onChange={setQuantity} />
        <span className="text-sm text-sage">
          {portion.serves}
          {portion.id !== dish.portions[0].id && " (large)"}
        </span>
      </div>

      <Button
        className="h-12 w-full rounded-full"
        onClick={() =>
          // TODO: server-side recalc — the client total is a preview only. The API
          // owns pricing, portion availability, and the authoritative line total.
          console.log("cart:add", {
            type: "dish",
            dishId: dish.id,
            portionId: portion.id,
            spice,
            addons,
            quantity,
            total,
          })
        }
      >
        Add to bag &middot; Rs {npr.format(total)}
      </Button>
    </div>
  );
}