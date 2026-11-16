"use client";

import type { ReactNode } from "react";

import { useCartStore, type CartLine } from "@/lib/cart-store";
import { lineName } from "@/lib/i18n/localize";
import { useLang } from "@/lib/use-lang";
import { cn } from "@/lib/utils";

/**
 * The single add-to-cart affordance used by every card and purchase block.
 * Wraps a trigger (a mint button by default) and pushes one line to the store.
 */
export function AddToCartButton({
  line,
  children,
  className,
  onAdded,
}: {
  line: Omit<CartLine, "id">;
  children: ReactNode;
  className?: string;
  onAdded?: () => void;
}) {
  const addItem = useCartStore((state) => state.addItem);
  const { lang, tr } = useLang();

  return (
    <button
      type="button"
      aria-label={tr(
        `Add ${line.name} to basket`,
        `${lineName(line, lang)} झोलामा थप्नुहोस्`,
      )}
      className={cn(
        "inline-flex items-center justify-center gap-2",
        className,
      )}
      onClick={() => {
        addItem(line);
        onAdded?.();
      }}
    >
      {children}
    </button>
  );
}