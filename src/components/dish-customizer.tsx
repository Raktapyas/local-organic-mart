"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";

import { QuantityStepper } from "@/components/quantity-stepper";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import {
  spiceLevels,
  spicePreset,
  type Dish,
  type DishSpice,
} from "@/lib/data";
import { dishText } from "@/lib/i18n/localize";
import { contentNe } from "@/lib/i18n/content-ne";
import { useLang } from "@/lib/use-lang";

function spiceLevelLabel(spice: DishSpice): string {
  return spiceLevels.find((level) => level.id === spice)?.label ?? spice;
}

export function DishCustomizer({ dish }: { dish: Dish }) {
  const addItem = useCartStore((state) => state.addItem);
  const [portionId, setPortionId] = useState(dish.portions[0].id);
  const [spice, setSpice] = useState<DishSpice>(() => spicePreset(dish));
  const [addons, setAddons] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const { lang, money, tr } = useLang();
  const copy = dishText(dish, lang);

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
      <fieldset className="rounded-[2px] border border-border bg-card p-5">
        <legend className="px-1 text-sm">{tr("Portion", "भाग")}</legend>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {dish.portions.map((option, index) => {
            const selected = option.id === portionId;
            const copyOption = copy.portions[index];
            return (
              <label
                key={option.id}
                className={
                  selected
                    ? "flex cursor-pointer items-center justify-between rounded-[2px] border border-mint bg-mint/10 p-3.5"
                    : "flex cursor-pointer items-center justify-between rounded-[2px] border border-border p-3.5 transition-colors hover:border-mint/35"
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
                        : "flex size-4 items-center justify-center rounded-full border border-foreground/30"
                    }
                  >
                    {selected && <span className="size-2 rounded-full bg-mint" />}
                  </span>
                  <span className={selected ? "text-sm text-mint" : "text-sm"}>
                    {copyOption.label}
                  </span>
                </span>
                <span className="text-xs text-sage">
                  {option.price === 0
                    ? copyOption.serves
                    : `+${money(option.price)}`}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Spice level */}
      <fieldset className="rounded-[2px] border border-border bg-card p-5">
        <legend className="px-1 text-sm">{tr("Spice level", "पिरो स्तर")}</legend>
        <div className="mt-3 grid grid-cols-3 gap-2.5">
          {spiceLevels.map((level) => {
            const selected = level.id === spice;
            return (
              <label
                key={level.id}
                className={
                  selected
                    ? "flex cursor-pointer items-center justify-center rounded-[2px] border border-mint bg-mint/10 p-3 text-sm text-mint"
                    : "flex cursor-pointer items-center justify-center rounded-[2px] border border-border p-3 text-sm text-muted-foreground transition-colors hover:border-mint/35 hover:text-foreground"
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
                {tr(
                  level.label,
                  contentNe.enums.dishSpice[level.id] ?? level.label,
                )}
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Add-ons */}
      <fieldset className="rounded-[2px] border border-border bg-card p-5">
        <legend className="px-1 text-sm">{tr("Add-ons", "थप विकल्प")}</legend>
        <ul className="mt-3 flex flex-col gap-2.5">
          {dish.addons.map((addon, index) => {
            const checked = addons.includes(addon.id);
            const copyAddon = copy.addons[index];
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
                          ? "flex size-4 items-center justify-center rounded border border-gold bg-gold text-ink"
                          : "flex size-4 items-center justify-center rounded border border-foreground/30"
                      }
                    >
                      {checked && <Check className="size-3" />}
                    </span>
                    <span className={checked ? "text-foreground" : "text-muted-foreground"}>
                      {copyAddon.label}
                    </span>
                  </span>
                  <span className="text-xs text-sage">+{money(addon.price)}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>

      <div className="flex flex-wrap items-center gap-3">
        <QuantityStepper onChange={setQuantity} />
        <span className="text-sm text-sage">
          {copy.portions.find((p) => p.id === portionId)?.serves ?? portion.serves}
          {portion.id !== dish.portions[0].id &&
            tr(" (large)", " (ठूलो)")}
        </span>
      </div>

      <Button
        className="h-12 w-full rounded-[2px] text-[10.5px] tracking-[0.2em] uppercase"
        // TODO: server-side recalc — the client total is a preview only. The API
        // owns pricing, portion availability, and the authoritative line total.
        onClick={() =>
          addItem({
            kind: "dish",
            refId: dish.id,
            slug: dish.id,
            name: dish.name,
            nepaliName: dish.nepaliName,
            unit: portion.serves,
            unitPrice:
              dish.price +
              portion.price +
              dish.addons
                .filter((addon) => addons.includes(addon.id))
                .reduce((sum, addon) => sum + addon.price, 0),
            qty: quantity,
            image: dish.image,
            customizations: [
              `${portion.label} portion`,
              spiceLevelLabel(spice),
              ...dish.addons
                .filter((addon) => addons.includes(addon.id))
                .map((addon) => addon.label),
            ],
          })
        }
      >
        {tr("Add to bag", "झोलामा थप्नुहोस्")} &middot; {money(total)}
      </Button>
    </div>
  );
}