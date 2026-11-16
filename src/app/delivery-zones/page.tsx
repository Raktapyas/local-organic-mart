import type { Metadata } from "next";
import { Check, Clock } from "lucide-react";

import { SectionHeader } from "@/components/section-header";
import { SiteFooter } from "@/components/site-footer";
import { L } from "@/components/localized-text";
import { deliveryZones, paymentMethods } from "@/lib/data";
import { paymentMethodLabel } from "@/lib/i18n/localize";
import { contentNe } from "@/lib/i18n/content-ne";

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
          titleNe="डेलिभरी क्षेत्र"
          subline="Cold-chain runs run every day. Estimates are for orders placed before the morning cut-off."
          sublineNe="कोल्ड चेन डेलिभरी हरेक दिन चल्छ। अनुमान बिहानको कटअफ अघि गरिएका अर्डरका लागि हो।"
        />

        <ul className="mt-12 flex flex-col">
          {deliveryZones.map((zone, index) => {
            const ne = contentNe.deliveryZones[index];
            return (
              <li
                key={zone.area}
                className="flex items-center justify-between gap-4 border-b border-border py-4 first:border-t"
              >
                <span className="flex items-center gap-2.5 text-sm">
                  <Clock className="size-4 shrink-0 text-sage" aria-hidden />
                  <L en={zone.area} ne={ne?.area ?? zone.area} />
                </span>
                <span className="text-sm text-sage">
                  <L en={zone.estimate} ne={ne?.estimate ?? zone.estimate} />
                </span>
              </li>
            );
          })}
        </ul>

        <section className="mt-16">
          <h2 className="text-xs tracking-wider text-sage uppercase">
            <L en="Payment methods" ne="भुक्तानी विधि" />
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {paymentMethods.map((method) => (
              <li
                key={method}
                className="inline-flex items-center gap-2 rounded-[2px] border border-border px-4 py-1.5 text-sm text-muted-foreground"
              >
                <Check className="size-3.5 text-mint" aria-hidden />
                <L en={method} ne={paymentMethodLabel(method, "ne")} />
              </li>
            ))}
          </ul>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
