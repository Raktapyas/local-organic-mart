import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPin } from "lucide-react";

import { KnowYourProduct } from "@/components/know-your-product";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  categoriesFromFarmer,
  farmToHome,
  farmers,
  products,
  productsFromFarmer,
  traceabilitySteps,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "Farm to Home — Local Organic Mart",
  description:
    "Three farmer collectives across the valley and high hills, and the provenance trail behind every lot they send.",
};

export default function FarmersPage() {
  return (
    <>

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="relative isolate flex min-h-[70svh] items-center overflow-hidden">
          <Image
            src={farmToHome.heroImage}
            alt={farmToHome.heroAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />

          <div className="relative mx-auto flex w-full max-w-7xl flex-col items-start gap-6 px-6 py-24">
            <Badge
              variant="outline"
              className="border-gold/60 text-gold backdrop-blur-sm"
            >
              {farmToHome.kicker}
            </Badge>
            <h1 className="max-w-3xl text-5xl leading-[1.02] tracking-tight text-balance sm:text-6xl md:text-7xl">
              {farmToHome.headline}
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-sage">
              {farmToHome.subline}
            </p>
          </div>
        </section>

        {/* Traceability bar */}
        <section
          aria-label="Custody stages"
          className="border-y border-border bg-card/30"
        >
          <ol className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:gap-0 sm:overflow-x-auto">
            {traceabilitySteps.map((step, index) => (
              <li
                key={step.label}
                className="flex shrink-0 items-center gap-4 sm:flex-1"
              >
                <div className="flex flex-col gap-1">
                  <span className="flex items-center gap-2">
                    <span className="font-heading text-sm whitespace-nowrap">
                      {step.label}
                    </span>
                  </span>
                  <span className="text-[11px] whitespace-nowrap text-muted-foreground">
                    {step.note}
                  </span>
                </div>
                {index < traceabilitySteps.length - 1 ? (
                  <span
                    className="hidden h-px min-w-6 flex-1 bg-gold/40 sm:block"
                    aria-hidden
                  />
                ) : null}
              </li>
            ))}
          </ol>
        </section>

        {/* Farmer cards */}
        <section className="mx-auto w-full max-w-7xl px-6 py-20">
          <div className="flex flex-col gap-3">
            <h2 className="text-xs tracking-wider text-sage uppercase">
              Smallholder alliances
            </h2>
            <h3 className="text-3xl tracking-tight sm:text-4xl">
              Farmer collective spotlights
            </h3>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Every harvest batch carries the face, elevation profile, and
              cultivation ethics of the stewards who nurture it. The chips
              below are the departments that collective actually supplies.
            </p>
          </div>

          <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {farmers.map((farmer) => {
              const supplied = productsFromFarmer(farmer);
              const chips = categoriesFromFarmer(farmer);

              return (
                <li
                  key={farmer.id}
                  className="flex flex-col overflow-hidden rounded-xl border border-border bg-card"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                    <Image
                      src={farmer.photo}
                      alt={`${farmer.name} at work in ${farmer.location}`}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                  </div>

                  <div className="flex flex-1 flex-col gap-4 p-6">
                    <div>
                      <h4 className="font-heading text-xl leading-tight">
                        {farmer.name}
                      </h4>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-sage">
                        <MapPin className="size-3.5 shrink-0" aria-hidden />
                        {farmer.location} ({farmer.elevation})
                      </p>
                    </div>

                    <dl className="flex flex-col gap-3 border-t border-border pt-4 text-sm">
                      <div>
                        <dt className="text-[10px] tracking-wider text-sage uppercase">
                          How it&rsquo;s produced
                        </dt>
                        <dd className="mt-1 text-muted-foreground">
                          {farmer.story}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[10px] tracking-wider text-sage uppercase">
                          Why it&rsquo;s special
                        </dt>
                        <dd className="mt-1 text-muted-foreground">
                          {farmer.special}
                        </dd>
                      </div>
                    </dl>

                    <ul className="flex flex-wrap gap-2">
                      {chips.map((chip) => (
                        <li key={chip.id}>
                          <Link
                            href={chip.href}
                            className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-mint/40 hover:text-mint"
                          >
                            {chip.name}
                          </Link>
                        </li>
                      ))}
                    </ul>

                    <p className="mt-auto flex items-center gap-1.5 pt-2 text-xs text-sage">
                      <BadgeCheck className="size-3.5 shrink-0" aria-hidden />
                      {supplied.length}{" "}
                      {supplied.length === 1 ? "lot" : "lots"} in the mart
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Know your product */}
        <section className="mx-auto w-full max-w-7xl px-6 pb-24">
          <KnowYourProduct products={products} />
        </section>

        <section className="mx-auto w-full max-w-7xl px-6 pb-24">
          <Button variant="outline" className="rounded-full px-8" asChild>
            <Link href="/mart">
              Shop the harvest
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
