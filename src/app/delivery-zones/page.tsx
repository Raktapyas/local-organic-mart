import type { Metadata } from "next";
import { Check, Clock } from "lucide-react";

import { SectionHeader } from "@/components/section-header";
import { SiteFooter } from "@/components/site-footer";
import { deliveryZones, paymentMethods } from "@/lib/data";

export const metadata: Metadata = {
  title: "Delivery Zones — Local Organic Mart",
  description:
    "Where we deliver across the Valley and how long each run takes.",
};

export default function DeliveryZonesPage() {
  return (
    <>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-20">
        <SectionHeader
          as="h1"
          title="Delivery zones"
          subline="Cold-chain runs run every day. Estimates are for orders placed before the morning cut-off."
        />

        <ul className="mt-12 flex flex-col">
          {deliveryZones.map((zone) => (
            <li
              key={zone.area}
              className="flex items-center justify-between gap-4 border-b border-border py-4 first:border-t"
            >
              <span className="flex items-center gap-2.5 text-sm">
                <Clock className="size-4 shrink-0 text-sage" aria-hidden />
                {zone.area}
              </span>
              <span className="text-sm text-sage">{zone.estimate}</span>
            </li>
          ))}
        </ul>

        <section className="mt-16">
          <h2 className="text-xs tracking-wider text-sage uppercase">
            Payment methods
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {paymentMethods.map((method) => (
              <li
                key={method}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground"
              >
                <Check className="size-3.5 text-mint" aria-hidden />
                {method}
              </li>
            ))}
          </ul>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
