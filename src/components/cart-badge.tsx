"use client";

import { useSyncExternalStore } from "react";

import { itemCount, useCartStore } from "@/lib/cart-store";

/** Server snapshot is "not mounted"; the client snapshot is always mounted. */
const subscribeToNothing = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Cart count for the header bag icon.
 *
 * The store is client-only, so the server has no count to render. Rendering
 * only after hydration keeps the first client paint identical to the server
 * HTML, which avoids a hydration mismatch.
 */
export function CartBadge() {
  const lines = useCartStore((state) => state.lines);
  const mounted = useSyncExternalStore(
    subscribeToNothing,
    getClientSnapshot,
    getServerSnapshot,
  );

  if (!mounted) return null;

  const count = itemCount(lines);
  if (count === 0) return null;

  return (
    <span className="absolute -right-1 -top-1 inline-flex min-w-4 items-center justify-center rounded-full bg-mint px-1 text-[10px] font-semibold text-primary-foreground">
      {count}
    </span>
  );
}