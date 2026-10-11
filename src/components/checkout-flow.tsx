"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, CreditCard, MapPin, Plus, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cartTotals, useCartStore } from "@/lib/cart-store";
import {
  ADDRESSES,
  DELIVERY_SLOTS,
  paymentMethods,
} from "@/lib/data";
import { useOrderStore } from "@/lib/order-store";

const npr = new Intl.NumberFormat("en-NP");

const STEPS = ["Address", "Delivery", "Payment"] as const;

export function CheckoutFlow() {
  const router = useRouter();
  const lines = useCartStore((state) => state.lines);
  const placeOrder = useOrderStore((state) => state.placeOrder);

  const [address, setAddress] = useState(ADDRESSES[0]?.id);
  const [slot, setSlot] = useState(DELIVERY_SLOTS[0]?.id);
  const [payment, setPayment] = useState<string>(paymentMethods[0]);

  const { itemSubtotal, delivery, total } = cartTotals(lines);

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="font-heading text-3xl tracking-tight">
          Nothing to check out.
        </h1>
        <p className="max-w-sm text-sm text-sage">
          Your bag is empty, so there is nothing to pay for yet.
        </p>
        <Button className="mt-2 rounded-full" asChild>
          <Link href="/bag">Return to bag</Link>
        </Button>
      </div>
    );
  }

  const addressLabel = ADDRESSES.find((a) => a.id === address)?.label ?? "";
  const slotLabel = DELIVERY_SLOTS.find((s) => s.id === slot)?.label ?? "";

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
      <div className="flex flex-col gap-10">
        {/* Step rail */}
        <ol className="flex items-center gap-2 border-b border-border pb-5">
          {STEPS.map((step, index) => (
            <li key={step} className="flex items-center gap-2">
              <span className="inline-flex size-6 items-center justify-center rounded-full bg-mint text-[11px] font-semibold text-primary-foreground">
                {index + 1}
              </span>
              <span className="text-sm text-mint">{step}</span>
              {index < STEPS.length - 1 && (
                <span aria-hidden className="mx-1 h-px w-6 bg-border" />
              )}
            </li>
          ))}
        </ol>

        {/* Address */}
        <section className="flex flex-col gap-3">
          <h2 className="flex items-center gap-2 font-heading text-base">
            <MapPin className="size-4 text-sage" aria-hidden />
            Address
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {ADDRESSES.map((option) => (
              <li key={option.id}>
                <OptionCard
                  selected={option.id === address}
                  onSelect={() => setAddress(option.id)}
                  title={option.label}
                  detail={option.detail}
                />
              </li>
            ))}
          </ul>
          <Button variant="ghost" size="sm" className="w-fit rounded-full">
            <Plus className="size-4" aria-hidden />
            Add new address
          </Button>
        </section>

        {/* Delivery */}
        <section className="flex flex-col gap-3">
          <h2 className="flex items-center gap-2 font-heading text-base">
            <Truck className="size-4 text-sage" aria-hidden />
            Delivery
          </h2>
          <ul className="flex flex-wrap gap-2">
            {DELIVERY_SLOTS.map((option) => (
              <li key={option.id}>
                <button
                  type="button"
                  aria-pressed={option.id === slot}
                  onClick={() => setSlot(option.id)}
                  className={
                    option.id === slot
                      ? "h-10 rounded-full bg-mint px-5 text-sm font-medium text-primary-foreground"
                      : "h-10 rounded-full border border-border bg-card px-5 text-sm text-muted-foreground transition-colors hover:border-mint/35 hover:text-foreground"
                  }
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Payment */}
        <section className="flex flex-col gap-3">
          <h2 className="flex items-center gap-2 font-heading text-base">
            <CreditCard className="size-4 text-sage" aria-hidden />
            Payment
          </h2>
          <ul className="flex flex-col gap-2.5">
            {paymentMethods.map((method) => (
              <li key={method}>
                <OptionCard
                  selected={method === payment}
                  onSelect={() => setPayment(method)}
                  title={method}
                />
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Summary */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
          <h2 className="font-heading text-lg">Summary</h2>

          <ul className="flex flex-col gap-2 border-y border-border py-4">
            {lines.map((line) => (
              <li key={line.id} className="flex justify-between gap-3 text-sm">
                <span className="text-muted-foreground">
                  {line.name}
                  {line.qty > 1 && ` × ${line.qty}`}
                </span>
                <span>Rs {npr.format(line.unitPrice * line.qty)}</span>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>Rs {npr.format(itemSubtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Delivery</span>
            <span>Rs {npr.format(delivery)}</span>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-4">
            <span className="font-heading text-lg">Total</span>
            <span className="font-heading text-2xl">Rs {npr.format(total)}</span>
          </div>

          <Button
            className="h-12 w-full rounded-full"
            onClick={() => {
              const order = placeOrder({
                lines,
                totals: { itemSubtotal, delivery, total },
                address: addressLabel,
                slot: slotLabel,
                payment,
              });
              router.push(`/order/${order.id}`);
            }}
          >
            Place order &middot; Rs {npr.format(total)}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Delivered to {addressLabel || "your address"} &middot;{" "}
            {slotLabel || "soon"}
          </p>
        </div>
      </aside>
    </div>
  );
}

function OptionCard({
  selected,
  onSelect,
  title,
  detail,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  detail?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={
        selected
          ? "flex w-full items-center justify-between gap-3 rounded-xl border border-mint bg-mint/10 p-4 text-left"
          : "flex w-full items-center justify-between gap-3 rounded-xl border border-border p-4 text-left transition-colors hover:border-mint/35"
      }
    >
      <span className="flex flex-col gap-0.5">
        <span className={selected ? "text-sm text-mint" : "text-sm"}>{title}</span>
        {detail && (
          <span className="text-xs text-muted-foreground">{detail}</span>
        )}
      </span>
      <span
        aria-hidden
        className={
          selected
            ? "flex size-5 shrink-0 items-center justify-center rounded-full bg-mint text-primary-foreground"
            : "flex size-5 shrink-0 items-center justify-center rounded-full border border-border"
        }
      >
        {selected && <Check className="size-3" />}
      </span>
    </button>
  );
}
