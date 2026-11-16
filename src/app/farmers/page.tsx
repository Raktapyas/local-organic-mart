import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPin } from "lucide-react";

import { KnowYourProduct } from "@/components/know-your-product";
import { L } from "@/components/localized-text";
import { LocalizedSection } from "@/components/localized-section";
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
import { farmerText } from "@/lib/i18n/localize";
import { contentNe } from "@/lib/i18n/content-ne";

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
            alt=""
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
              <L en={farmToHome.kicker} ne={contentNe.farmToHome.kicker} />
            </Badge>
            <h1 className="max-w-3xl text-5xl leading-[1.02] tracking-tight text-balance sm:text-6xl md:text-7xl">
              <L
                en={farmToHome.headline}
                ne={contentNe.farmToHome.headline}
              />
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-sage">
              <L en={farmToHome.subline} ne={contentNe.farmToHome.subline} />
            </p>
          </div>
        </section>

        {/* Traceability bar */}
        <LocalizedSection
          en="Custody stages"
          ne="अभिरक्षण चरण"
          className="border-y border-border bg-card/30"
        >
          <ol className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:gap-0 sm:overflow-x-auto">
            {traceabilitySteps.map((step, index) => {
              const ne = contentNe.traceability[index];
              return (
                <li
                  key={step.label}
                  className="flex shrink-0 items-center gap-4 sm:flex-1"
                >
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-2">
                      <span className="font-heading text-sm whitespace-nowrap">
                        <L en={step.label} ne={ne?.label ?? step.label} />
                      </span>
                    </span>
                    <span className="text-[11px] whitespace-nowrap text-muted-foreground">
                      <L en={step.note} ne={ne?.note ?? step.note} />
                    </span>
                  </div>
                  {index < traceabilitySteps.length - 1 ? (
                    <span
                      className="hidden h-px min-w-6 flex-1 bg-gold/40 sm:block"
                      aria-hidden
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </LocalizedSection>

        {/* Farmer cards */}
        <section className="mx-auto w-full max-w-7xl px-6 py-20">
          <div className="flex flex-col gap-3">
            <h2 className="text-xs tracking-wider text-sage uppercase">
              <L en="Smallholder alliances" ne="साना किसान समूह" />
            </h2>
            <h3 className="text-3xl tracking-tight sm:text-4xl">
              <L
                en="Farmer collective spotlights"
                ne="किसान समूहको परिचय"
              />
            </h3>
            <p className="max-w-2xl text-sm text-muted-foreground">
              <L
                en="Every harvest batch carries the face, elevation profile, and cultivation ethics of the stewards who nurture it. The chips below are the departments that collective actually supplies."
                ne="हरेक बाली ब्याचमा उमार्ने परिवारको परिचय, उचाइ र खेतीको मूल्य उल्लेख छ। तलका चिपहरू ती समूहले वास्तवमै आपूर्ति गर्ने विभाग हुन्।"
              />
            </p>
          </div>

          <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {farmers.map((farmer) => {
              const supplied = productsFromFarmer(farmer);
              const chips = categoriesFromFarmer(farmer);
              const ne = farmerText(farmer, "ne");

              return (
                <li
                  key={farmer.id}
                  className="flex flex-col overflow-hidden rounded-[2px] border border-border bg-card"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                    <Image
                      src={farmer.photo}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                  </div>

                  <div className="flex flex-1 flex-col gap-4 p-6">
                    <div>
                      <h4 className="font-heading text-xl leading-tight">
                        <L en={farmer.name} ne={ne.name} />
                      </h4>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-sage">
                        <MapPin className="size-3.5 shrink-0" aria-hidden />
                        <L
                          en={`${farmer.location} (${farmer.elevation})`}
                          ne={`${ne.location} (${ne.elevation})`}
                        />
                      </p>
                    </div>

                    <dl className="flex flex-col gap-3 border-t border-border pt-4 text-sm">
                      <div>
                        <dt className="text-[10px] tracking-wider text-sage uppercase">
                          <L en="How it's produced" ne="कसरी उत्पादन हुन्छ" />
                        </dt>
                        <dd className="mt-1 text-muted-foreground">
                          <L en={farmer.story} ne={ne.story} />
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[10px] tracking-wider text-sage uppercase">
                          <L en="Why it's special" ne="किन विशेष छ" />
                        </dt>
                        <dd className="mt-1 text-muted-foreground">
                          <L en={farmer.special} ne={ne.special} />
                        </dd>
                      </div>
                    </dl>

                    <ul className="flex flex-wrap gap-2">
                      {chips.map((chip) => (
                        <li key={chip.id}>
                          <Link
                            href={chip.href}
                            className="inline-flex items-center rounded-[2px] border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-mint/40 hover:text-mint"
                          >
                            <L
                              en={chip.name}
                              ne={contentNe.categories[chip.id]?.name ?? chip.name}
                            />
                          </Link>
                        </li>
                      ))}
                    </ul>

                    <p className="mt-auto flex items-center gap-1.5 pt-2 text-xs text-sage">
                      <BadgeCheck className="size-3.5 shrink-0" aria-hidden />
                      <L
                        en={`${supplied.length} ${supplied.length === 1 ? "lot" : "lots"} in the mart`}
                        ne={`मार्टमा ${supplied.length} लट`}
                      />
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
          <Button variant="outline" className="rounded-[2px] px-8" asChild>
            <Link href="/mart">
              <L en="Shop the harvest" ne="बाली किन्नुहोस्" />
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
