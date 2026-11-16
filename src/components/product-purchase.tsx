"use client";

import { useState } from "react";

import { QuantityStepper } from "@/components/quantity-stepper";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import type { Product } from "@/lib/data";
import { useLang } from "@/lib/use-lang";

/**
 * Basket action block. Holds quantity locally and pushes a line to the cart
 * store on add.
 */
export function ProductPurchase({
  product,
  bulkDiscountPct = 0,
}: {
  product: Product;
  /** Extra percent off applied by the selected volume tier. */
  bulkDiscountPct?: number;
}) {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const { money, tr } = useLang();
  // TODO: server-side recalc — these client totals are a preview only. The API
  // owns real pricing, tier eligibility, and the authoritative line total.
  const unit = Math.round(product.price * (1 - bulkDiscountPct / 100));
  const total = unit * quantity;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <QuantityStepper onChange={setQuantity} />
        <span className="text-sm text-muted-foreground">
          {tr(`${money(total)} total`, `जम्मा ${money(total)}`)}
        </span>
      </div>

      {product.outOfStock ? (
        <Button variant="outline" className="h-12 w-full rounded-[2px] text-[10.5px] tracking-[0.2em] uppercase">
          {tr("Notify me", "मलाई खबर गर्नुहोस्")}
        </Button>
      ) : (
        <Button
          className="h-12 w-full rounded-[2px] text-[10.5px] tracking-[0.2em] uppercase"
          // TODO: server-side recalc — the client total is a preview only. The
          // API owns pricing, tier eligibility, and the authoritative total.
          onClick={() =>
            addItem({
              kind: "product",
              refId: product.id,
              slug: product.id,
              name: product.name,
              nepaliName: product.nepaliName,
              unit: product.unit,
              unitPrice: unit,
              qty: quantity,
              image: product.image,
            })
          }
        >
          {tr("Add to bag", "झोलामा थप्नुहोस्")} &middot; {money(total)}
        </Button>
      )}
    </div>
  );
}