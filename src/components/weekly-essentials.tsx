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
 * The ids come from the real catalogue, so every chip is something the mart
 * stocks and "Reorder all" pushes genuine `kind: "product"` lines into the
 * cart — quantities included, which is why the milk goes in as three.
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
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <ul className="flex flex-wrap gap-2">
        {items.map(({ entry, product }) => (
          <li
            key={product.id}
            className="flex items-baseline gap-1.5 rounded-full border border-foreground/10 px-3 py-1.5 text-xs"
          >
            <span className="text-foreground">
              {entry.qty > 1 ? `${entry.qty}× ` : ""}
              {product.name}
            </span>
            <span className="text-muted-foreground">
              Rs {npr.format(product.price)}
            </span>
          </li>
        ))}
      </ul>

      <Button className="mt-5 rounded-full" onClick={reorderAll}>
        {added ? (
          <>
            <Check className="size-4" aria-hidden />
            Added to bag
          </>
        ) : (
          <>
            <RotateCcw className="size-4" aria-hidden />
            Reorder all
          </>
        )}
      </Button>
    </div>
  );
}
