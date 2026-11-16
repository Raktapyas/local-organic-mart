import type { Metadata } from "next";

import { BasketCard } from "@/components/basket-card";
import { L } from "@/components/localized-text";
import { SectionHeader } from "@/components/section-header";
import { SiteFooter } from "@/components/site-footer";
import { SubscriptionRows } from "@/components/subscription-rows";
import { baskets, subscriptionPlans } from "@/lib/data";

export const metadata: Metadata = {
  title: "Baskets, Gifts & Plans — Local Organic Mart",
  description:
    "Pre-curated baskets, festival reserves, and recurring plans for the pantry.",
};

/** Festival reserves, identified by the baskets that carry an image here. */
const FESTIVAL_IDS = ["dashain-family", "tihar-basket", "teej-basket"];

export default function BasketsPage() {
  const festivalIds = new Set(FESTIVAL_IDS);
  const smart = baskets.filter((basket) => !festivalIds.has(basket.id));
  const festival = baskets.filter((basket) => festivalIds.has(basket.id));

  return (
    <>

      <main className="flex flex-1 flex-col">
        <section className="mx-auto w-full max-w-7xl px-6 pt-16 pb-10">
          <SectionHeader
            as="h1"
            title="Baskets, gifts & plans"
            titleNe="टोकरी, उपहार र योजना"
            subline="Skip the shopping. Add a full basket in one tap."
            sublineNe="किनमेलको झन्झट छोड्नुहोस्। एउटै क्लिकमा पूरै टोकरी थप्नुहोस्।"
          />
        </section>

        {/* Smart bundles */}
        <section className="mx-auto w-full max-w-7xl px-6 pb-20">
          <h2 className="text-xs tracking-wider text-sage uppercase">
            <L en="Smart bundles" ne="स्मार्ट बन्डल" />
          </h2>
          <ul className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {smart.map((basket) => (
              <li key={basket.id}>
                <BasketCard basket={basket} />
              </li>
            ))}
          </ul>
        </section>

        {/* Festival baskets */}
        <section className="mx-auto w-full max-w-7xl px-6 pb-20">
          <h2 className="text-xs tracking-wider text-sage uppercase">
            <L en="Festival baskets" ne="चाडपर्व टोकरी" />
          </h2>
          <ul className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {festival.map((basket) => (
              <li key={basket.id}>
                <BasketCard
                  basket={basket}
                  accent="gold"
                  ctaLabel="Reserve basket"
                  ctaLabelNe="टोकरी आरक्षित गर्नुहोस्"
                />
              </li>
            ))}
          </ul>
        </section>

        {/* Subscriptions — `id` is the target for Home's "Set up a plan" band. */}
        <section
          id="subscriptions"
          className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 pb-24"
        >
          <h2 className="text-xs tracking-wider text-sage uppercase">
            <L en="Recurring plans" ne="दोहोरिने योजना" />
          </h2>
          <div className="mt-4">
            <SubscriptionRows plans={subscriptionPlans} baskets={baskets} />
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
