"use client";

import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { WEEKLY_ESSENTIALS, type Product } from "@/lib/data";

const npr = new Intl.NumberFormat("en-NP");

/**
 * Weekly restock card.
 *
 * The ids come from the real catalogue, so every row is something the mart
 * stocks and "Reorder all" pushes genuine `kind: "product"` lines into the
 * cart — quantities included, which is why the milk goes in as three.
 *
 * Laid out as a ledger: a label column, hairline-separated rows with the price
 * aligned right, and one action. Chips were compact but read as tags, not as
 * things you were about to buy again.
 */
export function WeeklyEssentials({ products }: { products: Product[] }) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const items = WEEKLY_ESSENTIALS.map((entry) => ({
    entry,
    product: products.find((p) => p.id === entry.productId),
  })).filter((row): row is { entry: (typeof WEEKLY_ESSENTIALS)[number]; product: Product } =>
    Boolean(row.product),
  );

  function reorderAll() {
    for (const { entry, product } of items) {
      addItem({
        kind: "product",
        refId: product.id,
        slug: product.id,
        name: product.name,
        nepaliName: product.nepaliName,
        unit: product.unit,
        unitPrice: product.price,
        qty: entry.qty,
        image: product.image,
      });
    }
    setAdded(true);
  }

  return (
    <div className="flex flex-col gap-7 border border-foreground/[0.08] bg-card/40 p-6 lg:flex-row lg:items-center lg:gap-12 lg:p-8">
      <div className="flex shrink-0 flex-col gap-1.5 lg:max-w-[13rem]">
        <span className="eyebrow">The usual</span>
        <p className="text-xs leading-relaxed text-ash">
          Last week&rsquo;s basket, ready to repeat.
        </p>
      </div>

      <ul className="grid flex-1 gap-x-10 sm:grid-cols-2">
        {items.map(({ entry, product }) => (
          <li
            key={product.id}
            className="flex items-baseline justify-between gap-3 border-b border-foreground/[0.07] py-2.5"
          >
            <span className="text-sm text-ivory">
              {entry.qty > 1 ? (
                <span className="tabular mr-1.5 text-gold/80">{entry.qty}×</span>
              ) : null}
              {product.name}
            </span>
            <span className="tabular text-xs text-ash">
              Rs {npr.format(product.price)}
            </span>
          </li>
        ))}
      </ul>

      <Button
        size="sm"
        className="h-10 shrink-0 px-5 text-[10px] tracking-[0.18em] uppercase"
        onClick={reorderAll}
      >
        {added ? (
          <>
            <Check className="size-3.5" aria-hidden />
            Added to bag
          </>
        ) : (
          <>
            <RotateCcw className="size-3.5" aria-hidden />
            Reorder all
          </>
        )}
      </Button>
    </div>
  );
}
