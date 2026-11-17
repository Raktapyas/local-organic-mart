import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";

import { ComboCard } from "@/components/combo-card";
import { CountdownChip } from "@/components/countdown-chip";
import { L } from "@/components/localized-text";
import { ProductCard } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import {
  comboBundles,
  dealsCloseAt,
  offerProduct,
  offers,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "Offers — Local Organic Mart",
  description:
    "This week's flash allocations from the valley collectives, plus member pricing and two-dish bundles.",
};

export default function OffersPage() {
  // The deal set is the `offers` table, which only carries lines that are
  // genuinely reduced. Resolving through it keeps the grid and the Home rail
  // reading from one source.
  const dealProducts = offers
    .map(offerProduct)
    .filter((product): product is NonNullable<typeof product> => !!product);

  return (
    <>

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="mx-auto w-full max-w-7xl px-6 pt-12 pb-8">
          <div className="relative isolate overflow-hidden rounded-[2px] border border-border bg-card px-6 py-16 sm:px-12">
            <div className="flex flex-col items-start gap-5">
              <CountdownChip
                closesAt={dealsCloseAt}
                label="Deal window closes in"
                labelNe="अफर अवधि सकिन बाँकी"
              />
              <h1 className="max-w-2xl text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl md:text-6xl">
                <L
                  en="This week's big deals"
                  ne="यो हप्ताका मुख्य अफर"
                />
              </h1>
              <p className="max-w-xl text-base text-sage">
                <L
                  en="Monday–Thursday. Prices update automatically when the window ends."
                  ne="सोमबार–बिहीबार। अवधि सकिएपछि मूल्य आफैं अद्यावधिक हुन्छ।"
                />
              </p>
            </div>
          </div>
        </section>

        {/* Live now */}
        <section className="mx-auto w-full max-w-7xl px-6 pb-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-xs tracking-wider text-sage uppercase">
                <L en="Direct from orchard & field" ne="बगैंचा र खेतबाट सिधै" />
              </p>
              <h2 className="text-3xl tracking-tight">
                <L en="Live now" ne="अहिले उपलब्ध" />
              </h2>
              <p className="text-sm text-muted-foreground">
                <L
                  en={`${dealProducts.length} limited harvest allocations`}
                  ne={`${dealProducts.length} सीमित बाली आवंटन`}
                />
              </p>
            </div>
          </div>

          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {dealProducts.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </section>

        {/* Member band */}
        <section className="mx-auto w-full max-w-7xl px-6 pb-20">
          <div className="flex flex-col items-start gap-5 rounded-[2px] border border-gold/40 bg-card px-6 py-12 sm:px-12">
            <span className="inline-flex size-11 items-center justify-center rounded-[2px] border border-gold/40 text-gold">
              <Lock className="size-5" aria-hidden />
            </span>
            <h2 className="max-w-xl text-2xl tracking-tight sm:text-3xl">
              <L en="Member prices unlock here" ne="सदस्य मूल्य यहाँ खुल्छ" />
            </h2>
            <p className="max-w-lg text-sm text-muted-foreground">
              <L
                en="A flat 10% off Mart provisions, 2x reward points, and first refusal on the next allocation window."
                ne="मार्टका सामानमा स्थिर 10% छुट, 2× रिवार्ड अंक, र अर्को आवंटन अवधिमा पहिलो अधिकार।"
              />
            </p>
            <Button
              variant="outline"
              className="rounded-[2px] border-gold/50 px-8 text-gold hover:bg-gold/10 hover:text-gold"
              asChild
            >
              <Link href="/membership">
                <L en="Join membership" ne="सदस्यता लिनुहोस्" />
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </section>

        {/* Combos */}
        <section className="mx-auto w-full max-w-7xl px-6 pb-24">
          <div className="flex flex-col gap-2">
            <p className="text-xs tracking-wider text-sage uppercase">
              <L en="Kitchen pairings" ne="भान्साका जोडी" />
            </p>
            <h2 className="text-3xl tracking-tight">
              <L en="Combo & save" ne="कम्बो र बचत" />
            </h2>
            <p className="max-w-xl text-sm text-muted-foreground">
              <L
                en="Two Restaurant dishes, one tap. The saving is already taken off the second item when it lands in your bag."
                ne="दुई रेस्टुरेन्ट परिकार, एउटै क्लिक। झोलामा पुग्दा नै दोस्रो वस्तुबाट बचत घटाइएको हुन्छ।"
              />
            </p>
          </div>

          <ul className="mt-8 grid gap-6 md:grid-cols-2">
            {comboBundles.map((bundle) => (
              <li key={bundle.id} className="h-full">
                <ComboCard
                  dishIds={bundle.dishIds}
                  saving={bundle.saving}
                />
              </li>
            ))}
          </ul>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
