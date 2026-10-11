import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";

import { ComboCard } from "@/components/combo-card";
import { CountdownChip } from "@/components/countdown-chip";
import { ProductCard } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
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
      <SiteHeader />

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="mx-auto w-full max-w-7xl px-6 pt-12 pb-8">
          <div className="relative isolate overflow-hidden rounded-2xl border border-border bg-card px-6 py-16 sm:px-12">
            <div className="flex flex-col items-start gap-5">
              <CountdownChip
                closesAt={dealsCloseAt}
                label="Deal window closes in"
                className="text-base"
              />
              <h1 className="max-w-2xl text-4xl tracking-tight text-balance sm:text-5xl md:text-6xl">
                This week&rsquo;s big deals
              </h1>
              <p className="max-w-xl text-base text-sage">
                Monday&ndash;Thursday. Prices update automatically when the
                window ends.
              </p>
            </div>
          </div>
        </section>

        {/* Live now */}
        <section className="mx-auto w-full max-w-7xl px-6 pb-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-xs tracking-wider text-sage uppercase">
                Direct from orchard &amp; field
              </h2>
              <h3 className="text-3xl tracking-tight">Live now</h3>
              <p className="text-sm text-muted-foreground">
                {dealProducts.length} limited harvest allocations
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
          <div className="flex flex-col items-start gap-5 rounded-2xl border border-gold/40 bg-card px-6 py-12 sm:px-12">
            <span className="inline-flex size-11 items-center justify-center rounded-full border border-gold/40 text-gold">
              <Lock className="size-5" aria-hidden />
            </span>
            <h2 className="max-w-xl text-2xl tracking-tight sm:text-3xl">
              Member prices unlock here
            </h2>
            <p className="max-w-lg text-sm text-muted-foreground">
              A flat 10% off Mart provisions, 2x reward points, and first
              refusal on the next allocation window.
            </p>
            <Button
              variant="outline"
              className="rounded-full border-gold/50 px-8 text-gold hover:bg-gold/10 hover:text-gold"
              asChild
            >
              <Link href="/membership">
                Join membership
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </section>

        {/* Combos */}
        <section className="mx-auto w-full max-w-7xl px-6 pb-24">
          <div className="flex flex-col gap-2">
            <h2 className="text-xs tracking-wider text-sage uppercase">
              Kitchen pairings
            </h2>
            <h3 className="text-3xl tracking-tight">Combo &amp; save</h3>
            <p className="max-w-xl text-sm text-muted-foreground">
              Two Restaurant dishes, one tap. The saving is already taken off
              the second item when it lands in your bag.
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
