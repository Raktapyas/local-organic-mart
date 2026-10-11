"use client";

import { useState } from "react";
import Link from "next/link";
import { BellRing, Check, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import {
  subscriptionFrequencies,
  type Basket,
  type SubscriptionFrequency,
  type SubscriptionPlan,
} from "@/lib/data";

const npr = new Intl.NumberFormat("en-NP");

/**
 * Recurring plan rows.
 *
 * TODO: real recurring engine (Laravel scheduler phase). Subscribing only
 * tags the cart line with the chosen cadence — nothing repeats on its own
 * yet, and the confirmation says as much.
 */
export function SubscriptionRows({
  plans,
  baskets,
}: {
  plans: SubscriptionPlan[];
  baskets: Basket[];
}) {
  const addItem = useCartStore((state) => state.addItem);
  const [frequency, setFrequency] = useState<SubscriptionFrequency>("Weekly");
  const [toast, setToast] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col">
        {plans.map((plan) => {
          const basket = baskets.find((b) => b.id === plan.basketId);
          if (!basket) return null;

          return (
            <li
              key={plan.basketId}
              className="flex flex-wrap items-center justify-between gap-4 border-b border-border py-5 first:border-t"
            >
              <div className="flex flex-col gap-1">
                <span className="font-heading text-base">{basket.name}</span>
                <span className="text-xs text-muted-foreground">
                  {plan.note} · Rs {npr.format(basket.price)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <label htmlFor={`freq-${plan.basketId}`} className="sr-only">
                    Delivery frequency for {basket.name}
                  </label>
                  <select
                    id={`freq-${plan.basketId}`}
                    value={frequency}
                    onChange={(event) =>
                      setFrequency(event.target.value as SubscriptionFrequency)
                    }
                    className="h-9 appearance-none rounded-full border border-border bg-card py-1 pr-8 pl-4 text-xs text-foreground outline-none transition-colors focus-visible:border-mint"
                  >
                    {subscriptionFrequencies.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                  />
                </div>

                <Button
                  size="sm"
                  className="rounded-full px-4"
                  onClick={() => {
                    addItem({
                      kind: "basket",
                      refId: basket.id,
                      slug: basket.id,
                      name: basket.name,
                      nepaliName: basket.nepaliName,
                      unit: `${basket.includes.length} items`,
                      unitPrice: basket.price,
                      qty: 1,
                      customizations: [
                        basket.name,
                        `Repeats ${frequency.toLowerCase()}`,
                      ],
                    });
                    setToast(basket.name);
                  }}
                >
                  <BellRing className="size-4" aria-hidden />
                  Subscribe
                </Button>
              </div>
            </li>
          );
        })}
      </ul>

      {/*
        Inline toast. There is no toast primitive in this project yet, and a
        fixed overlay for a single confirmation would be heavier than the
        confirmation itself.
      */}
      <div aria-live="polite" className="min-h-6">
        {toast ? (
          <p className="flex items-center gap-2 text-sm text-sage">
            <Check className="size-4 shrink-0 text-mint" aria-hidden />
            <span>
              {toast} added. We&rsquo;ll repeat this — manage in{" "}
              <Link href="/account" className="text-mint underline-offset-4 hover:underline">
                My Home
              </Link>
              .
            </span>
          </p>
        ) : null}
      </div>
    </div>
  );
}
