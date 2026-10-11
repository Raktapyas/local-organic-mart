"use client";

import Image from "next/image";
import Link from "next/link";

import { QuantityStepper } from "@/components/quantity-stepper";
import { Button } from "@/components/ui/button";
import { useCartStore, type CartLine } from "@/lib/cart-store";
import { DELIVERY_FEE_FLAT, paymentMethods } from "@/lib/data";

const npr = new Intl.NumberFormat("en-NP");

const GROUPS = [
  { kind: "product" as const, title: "Grocery" },
  { kind: "dish" as const, title: "Restaurant" },
];

function BagRow({ line }: { line: CartLine }) {
  const setQty = useCartStore((state) => state.setQty);
  const removeLine = useCartStore((state) => state.removeLine);

  return (
    <li className="flex gap-4 py-6 first:pt-0 last:pb-0">
      <Link
        href={
          line.kind === "product" ? `/product/${line.slug}` : `/restaurant/${line.slug}`
        }
        className="relative size-20 shrink-0 overflow-hidden rounded-lg border border-border"
      >
        <Image src={line.image} alt="" fill sizes="80px" className="object-cover" />
      </Link>

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <span className="flex flex-col gap-0.5">
            <Link
              href={
                line.kind === "product"
                  ? `/product/${line.slug}`
                  : `/restaurant/${line.slug}`
              }
              className="font-heading text-base transition-colors hover:text-mint"
            >
              {line.name}
            </Link>
            <span className="text-xs text-muted-foreground">
              {line.nepaliName} &middot; {line.unit}
            </span>
          </span>
          <span className="shrink-0 font-heading text-base">
            Rs {npr.format(line.unitPrice * line.qty)}
          </span>
        </div>

        {line.customizations && line.customizations.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {line.customizations.map((option) => (
              <li
                key={option}
                className="rounded-full border border-border px-2 py-0.5 text-[11px] text-sage"
              >
                {option}
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center justify-between gap-3">
          <QuantityStepper
            quantity={line.qty}
            onChange={(qty) => setQty(line.id, qty)}
            className="h-9 w-28"
          />
          <button
            type="button"
            onClick={() => removeLine(line.id)}
            className="text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}

export function BagView() {
  const lines = useCartStore((state) => state.lines);
  const clear = useCartStore((state) => state.clear);

  const food = lines.filter((line) => line.kind === "product");
  const dishes = lines.filter((line) => line.kind === "dish");
  const isEmpty = lines.length === 0;

  const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.qty, 0);
  const total = isEmpty ? 0 : subtotal + DELIVERY_FEE_FLAT;

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="font-heading text-3xl tracking-tight">Your bag is empty.</h1>
        <p className="max-w-sm text-sm text-sage">
          Nothing here yet. Browse the mart for produce, pantry, and foraged
          goods.
        </p>
        <Button className="mt-2 rounded-full" asChild>
          <Link href="/mart">Browse the Mart</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
      <div className="flex flex-col gap-10">
        {GROUPS.map((group) => {
          const groupLines = group.kind === "product" ? food : dishes;
          if (groupLines.length === 0) return null;
          return (
            <section key={group.kind}>
              <h2 className="font-heading text-sm tracking-tight">{group.title}</h2>
              <ul className="mt-4 divide-y divide-border border-b border-border">
                {groupLines.map((line) => (
                  <BagRow key={line.id} line={line} />
                ))}
              </ul>
            </section>
          );
        })}

        <button
          type="button"
          onClick={clear}
          className="w-fit text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          Clear bag
        </button>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>Rs {npr.format(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Delivery</span>
            <span>Rs {npr.format(DELIVERY_FEE_FLAT)}</span>
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <span className="font-heading text-lg">Total</span>
              <span className="font-heading text-2xl">Rs {npr.format(total)}</span>
            </div>
          </div>

          <ul className="flex flex-wrap gap-2 pt-1">
            {paymentMethods.map((method) => (
              <li
                key={method}
                className="rounded-full border border-foreground/10 px-2.5 py-1 text-[11px] text-muted-foreground"
              >
                {method}
              </li>
            ))}
          </ul>

          <Button className="h-12 w-full rounded-full" asChild>
            <Link href="/checkout">Checkout &middot; Rs {npr.format(total)}</Link>
          </Button>
        </div>
      </aside>
    </div>
  );
}