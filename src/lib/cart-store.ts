"use client";

import { create } from "zustand";

import { DELIVERY_FEE_FLAT } from "@/lib/data";

export type CartKind = "product" | "dish";

export interface CartLine {
  /** Derived: `${kind}:${refId}:${sorted customizations}`. */
  id: string;
  kind: CartKind;
  /** Product or dish id in `data.ts`. */
  refId: string;
  /** URL slug, for a link back to the item. */
  slug: string;
  name: string;
  nepaliName: string;
  /** Selling unit or portion, e.g. "1 bunch" or "1 Thali". */
  unit: string;
  /** Price for one unit after customizations, in NPR. */
  unitPrice: number;
  qty: number;
  /** Optional: absent when the product has no photo yet. */
  image?: string;
  /** Human-readable selections, e.g. ["Large portion", "Fiery"]. */
  customizations?: string[];
}

/**
 * Stable line id. Two lines are the same purchase when they are the same kind
 * of item with the same customizations, so a repeated identical add merges
 * into one line while a different spice stays separate. Customization order is
 * normalised so selection order does not create duplicates.
 */
export function lineId(
  kind: CartKind,
  refId: string,
  customizations: string[] = [],
): string {
  const normalized = [...customizations].sort().join("|");
  return `${kind}:${refId}:${normalized}`;
}

interface CartState {
  lines: CartLine[];
  addItem: (line: Omit<CartLine, "id">) => void;
  /** Quantity of 0 removes the line. */
  setQty: (id: string, qty: number) => void;
  removeLine: (id: string) => void;
  clear: () => void;
}

// TODO: persist to localStorage + server-side recalc. Until then the cart is
// session-only and unit prices are whatever the client computed.
export const useCartStore = create<CartState>()((set) => ({
  lines: [],

  addItem: (line) =>
    set((state) => {
      const id = lineId(line.kind, line.refId, line.customizations);
      const existing = state.lines.find((l) => l.id === id);

      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.id === id ? { ...l, qty: l.qty + line.qty } : l,
          ),
        };
      }

      return { lines: [...state.lines, { ...line, id }] };
    }),

  setQty: (id, qty) =>
    set((state) => ({
      lines:
        qty <= 0
          ? state.lines.filter((l) => l.id !== id)
          : state.lines.map((l) => (l.id === id ? { ...l, qty } : l)),
    })),

  removeLine: (id) =>
    set((state) => ({ lines: state.lines.filter((l) => l.id !== id) })),

  clear: () => set({ lines: [] }),
}));

/** Total number of units in the cart, across all lines. */
export function itemCount(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.qty, 0);
}

/** Sum of line totals, before delivery. */
export function subtotal(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.unitPrice * line.qty, 0);
}

/**
 * Single source of truth for cart money. The bag and the checkout summary both
 * call this so their totals can never disagree. An empty cart charges no
 * delivery.
 */
export function cartTotals(lines: CartLine[]) {
  const itemSubtotal = subtotal(lines);
  const delivery = lines.length > 0 ? DELIVERY_FEE_FLAT : 0;
  return {
    itemSubtotal,
    delivery,
    total: itemSubtotal + delivery,
  };
}