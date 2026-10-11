"use client";

import { create } from "zustand";

import { useCartStore, type CartLine } from "@/lib/cart-store";

export interface OrderTotals {
  itemSubtotal: number;
  delivery: number;
  total: number;
}

export interface Order {
  /** Human-facing reference, e.g. "LOM-4712". */
  id: string;
  /** Copy of the cart lines as they were when the order was placed. */
  lines: CartLine[];
  totals: OrderTotals;
  /** Label of the chosen saved address. */
  address: string;
  /** Label of the chosen delivery slot. */
  slot: string;
  /** Chosen payment method. */
  payment: string;
  placedAt: string;
}

interface OrderState {
  lastOrder: Order | null;
  placeOrder: (input: {
    lines: CartLine[];
    totals: OrderTotals;
    address: string;
    slot: string;
    payment: string;
  }) => Order;
}

/** `LOM-` plus four digits. Demo only; the server owns real references. */
function orderId(): string {
  return `LOM-${Math.floor(1000 + Math.random() * 9000)}`;
}

// TODO: POST /api/orders — the server owns order creation, payment
// verification, and reference generation. Demo keeps only the last order in
// memory and has no persistence.
export const useOrderStore = create<OrderState>()((set) => ({
  lastOrder: null,

  placeOrder: (input) => {
    const order: Order = {
      id: orderId(),
      lines: input.lines,
      totals: input.totals,
      address: input.address,
      slot: input.slot,
      payment: input.payment,
      placedAt: new Date().toISOString(),
    };

    set({ lastOrder: order });
    useCartStore.getState().clear();

    return order;
  },
}));