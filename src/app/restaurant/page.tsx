import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { DishFilterGrid } from "@/components/dish-filter-grid";
import { L } from "@/components/localized-text";
import { SectionHeader } from "@/components/section-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { dishes, restaurantBandImage } from "@/lib/data";

const ETA_CHIPS = [
  {
    en: "30–45 min inside Ring Road",
    ne: "रिङ रोडभित्र 30–45 मिनेट",
  },
  {
    en: "45–60 min Lalitpur & Bhaktapur",
    ne: "ललितपुर र भक्तपुरमा 45–60 मिनेट",
  },
];

export default function RestaurantPage() {
  return (
    <>

      <main className="flex flex-1 flex-col">
        {/* Hero band */}
        <section className="mx-auto w-full max-w-7xl px-6 pt-8">
          <div className="relative isolate flex min-h-[22rem] items-end overflow-hidden rounded-[2px] border border-border">
            <Image
              src={restaurantBandImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />

            <div className="relative flex w-full flex-col gap-6 p-8 sm:p-12">
              <div className="flex flex-col gap-3">
                <h1 className="max-w-2xl text-4xl leading-tight tracking-tight text-balance sm:text-5xl">
                  <L
                    en="Local Organic Restaurant"
                    ne="लोकल अर्गानिक रेस्टुरेन्ट"
                  />
                </h1>
                <p className="text-sm text-sage">
                  <L
                    en="Order → Prepare → Express deliver."
                    ne="अर्डर → पकाइ → छिटो डेलिभरी।"
                  />
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {ETA_CHIPS.map((chip) => (
                  <span
                    key={chip.en}
                    className="rounded-[2px] border border-border bg-background/70 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-sm"
                  >
                    <L en={chip.en} ne={chip.ne} />
                  </span>
                ))}
                <span className="rounded-[2px] border border-gold/40 bg-background/70 px-3 py-1.5 text-xs text-gold backdrop-blur-sm">
                  <L
                    en="Kathmandu Valley only"
                    ne="काठमाडौं उपत्यकाभित्र मात्र"
                  />
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Menu */}
        <section className="mx-auto w-full max-w-7xl px-6 py-16">
          <SectionHeader
            title="Menu"
            titleNe="मेनु"
            subline="Cooked to order on stone hearths."
            sublineNe="ढुंगाको चुलोमा अर्डरअनुसार पकाइन्छ।"
          />

          <div className="mt-10">
            <DishFilterGrid dishes={dishes} />
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto w-full max-w-7xl px-6 pb-24">
          <div className="flex flex-col items-start gap-6 rounded-[2px] border border-border bg-card p-10 sm:p-14">
            <div className="flex flex-col gap-3">
              <h2 className="max-w-xl text-3xl tracking-tight text-balance">
                <L
                  en="Dine with us, or have it delivered hot."
                  ne="हामीसँगै खानुहोस्, वा तातै डेलिभरी गराउनुहोस्।"
                />
              </h2>
              <p className="max-w-lg text-sm leading-relaxed text-sage">
                <L
                  en="Every dish is cooked when you order it. Delivery runs inside Ring Road in 30–45 minutes."
                  ne="हरेक परिकार अर्डर गरेपछि मात्र पकाइन्छ। रिङ रोडभित्र 30–45 मिनेटमा डेलिभरी हुन्छ।"
                />
              </p>
            </div>
            <Button className="rounded-[2px]" asChild>
              <Link href="/mart">
                <L en="Browse the mart" ne="मार्ट हेर्नुहोस्" />
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}