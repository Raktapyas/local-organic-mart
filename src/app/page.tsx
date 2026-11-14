import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Gift,
  Headset,
  MapPin,
  Percent,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";

import { CountdownChip } from "@/components/countdown-chip";
import { HeroSlider } from "@/components/hero-slider";
import { TrustStack } from "@/components/trust-stack";
import { StoryCards } from "@/components/story-cards";
import { TrustStrip } from "@/components/trust-strip";
import { WeeklyEssentials } from "@/components/weekly-essentials";
import { BannerTrio } from "@/components/banner-trio";
import { BestsellersRail } from "@/components/bestsellers-rail";
import { categoryIcons } from "@/components/category-icons";
import { DishCard } from "@/components/dish-card";
import { ProductCard } from "@/components/product-card";
import { SectionHeader } from "@/components/section-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import {
  baskets,
  categories,
  dishes,
  farmers,
  heroSlides,
  offerProduct,
  membershipBenefits,
  offers,
  paymentMethods,
  products,
  kitchenBandImage,
  dealsCloseAt,
  type Product,
} from "@/lib/data";

const MEMBERSHIP_ICONS = {
  percent: Percent,
  stars: Star,
  clock: Clock,
  truck: Truck,
  gift: Gift,
  headset: Headset,
} as const;

/** Deal lines resolved against the product table, discounted lines only. */
const dealProducts = offers
  .map(offerProduct)
  .filter((product): product is Product => product !== undefined && !product.outOfStock);

/** Featured dishes for the restaurant band. */
const featuredDishes = dishes.slice(0, 3);

const npr = new Intl.NumberFormat("en-NP");

/** Shared page gutter. One width, one rhythm, every band. */
const shell = "mx-auto w-full max-w-[88rem] px-6 lg:px-10";

export default function Home() {
  return (
    <>
      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="relative isolate min-h-[82svh] overflow-hidden sm:min-h-[86svh] lg:min-h-[calc(100svh-6.75rem)]">
          <HeroSlider slides={heroSlides} />
        </section>

        {/* Trust strip, then the three banners — both directly under the hero */}
        <TrustStrip />
        <BannerTrio />

        {/* Category rail — hairline grid, portrait plates, catalogue numerals */}
        <section id="categories" className="scroll-mt-24 border-b border-foreground/[0.06]">
          <div className={`${shell} py-16 lg:py-24`}>
            <SectionHeader
              eyebrow="The departments"
              title="Shop by category"
              titleKey="sections.shopByCategory"
              subline="Ten departments, filled from the morning harvest."
              sublineKey="sections.shopByCategorySub"
            />

            <ul className="mt-10 grid grid-cols-2 gap-px border border-foreground/[0.07] bg-foreground/[0.07] sm:grid-cols-3 lg:grid-cols-5">
              {categories.map((category, index) => {
                const Icon = categoryIcons[category.icon];
                return (
                  <li key={category.id} className="bg-background">
                    <Link
                      href={category.href}
                      className="group relative flex aspect-4/5 flex-col justify-end overflow-hidden p-4"
                    >
                      <Image
                        src={category.image}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                        className="object-cover opacity-75 transition-all duration-700 group-hover:scale-[1.04] group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />

                      <div className="relative flex items-end justify-between gap-2">
                        <span className="flex items-center gap-2">
                          <Icon
                            className="size-3.5 shrink-0 text-gold/80 lg:hidden"
                            aria-hidden
                          />
                          <h3 className="font-heading text-base leading-tight text-ivory">
                            {category.name}
                          </h3>
                        </span>
                        <span className="tabular text-[9px] tracking-[0.2em] text-gold/60">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Weekly essentials — `id` is the target for the mega menu */}
        <section
          id="weekly"
          className="scroll-mt-28 border-b border-foreground/[0.06]"
        >
          <div className={`${shell} py-16 lg:py-24`}>
            <SectionHeader
              eyebrow="The weekly list"
              title="Weekly essentials"
              subline="Restocked every Thursday from the valley floor."
              aside={
                <Link
                  href="/mart"
                  className="group inline-flex items-center gap-2 text-[10px] tracking-[0.2em] text-gold uppercase"
                >
                  All produce
                  <ArrowRight
                    className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden
                  />
                </Link>
              }
            />
            <div className="mt-10">
              <WeeklyEssentials products={products} />
            </div>
          </div>
        </section>

        {/* Bestsellers — tabbed rail, above the deals section */}
        <BestsellersRail excludeIds={dealProducts.map((product) => product.id)} />

        {/* Deals rail */}
        <section id="deals" className="scroll-mt-24 border-b border-foreground/[0.06] bg-[#080d0a]">
          <div className={`${shell} py-16 lg:py-24`}>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeader
                eyebrow="Small allocations"
                title="This week's big deals"
                titleKey="sections.bigDeals"
                subline="Small allocations from this week's harvest."
                sublineKey="sections.bigDealsSub"
              />
              <CountdownChip closesAt={dealsCloseAt} />
            </div>

            {/* Four deals this week, so four columns — a fifth empty slot read as a missing card. */}
            <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
              {dealProducts.map((product) => (
                <li key={product.id}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>

            <div className="mt-14 flex justify-center">
              <Button variant="outline" className="h-11 px-7 text-[10.5px] tracking-[0.2em] uppercase" asChild>
                <Link href="/offers">
                  See all deals
                  <ArrowRight className="size-3.5" aria-hidden />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Baskets */}
        <section id="baskets" className="scroll-mt-24 border-b border-foreground/[0.06]">
          <div className={`${shell} py-16 lg:py-24`}>
            <SectionHeader
              eyebrow="Curated"
              title="Baskets & bundles"
              titleKey="sections.baskets"
              subline="Calibrated for Kathmandu households."
              sublineKey="sections.basketsSub"
            />

            <ul className="mt-10 grid gap-px border border-foreground/[0.07] bg-foreground/[0.07] sm:grid-cols-3">
              {baskets.slice(0, 3).map((basket) => (
                <li key={basket.id} className="bg-background">
                  {/* Photo plate + scrim. Item detail lives on /baskets. */}
                  <Link
                    href="/baskets"
                    className="group flex h-full flex-col overflow-hidden"
                  >
                    <div className="relative aspect-4/3 overflow-hidden">
                      <Image
                        src={basket.image ?? "/images/category-local.jpg"}
                        alt=""
                        fill
                        sizes="(min-width: 640px) 33vw, 100vw"
                        className="object-cover opacity-85 transition-all duration-700 group-hover:scale-[1.04] group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
                    </div>

                    <div className="flex flex-1 flex-col gap-2 p-5">
                      <span className="text-[9px] tracking-[0.26em] text-gold uppercase">
                        {basket.tag}
                      </span>
                      <h3 className="font-heading text-xl leading-tight text-ivory">
                        {basket.name}
                      </h3>
                      <p className="text-xs text-ash">
                        {basket.includes.length} items &middot;{" "}
                        <span className="tabular text-ivory">
                          Rs {npr.format(basket.price)}
                        </span>
                        {basket.oldPrice ? (
                          <span className="tabular ml-1.5 text-ash/50 line-through">
                            Rs {npr.format(basket.oldPrice)}
                          </span>
                        ) : null}
                      </p>
                      <span className="mt-auto flex items-center gap-2 pt-4 text-[10px] tracking-[0.2em] text-gold uppercase">
                        Add basket
                        <ArrowRight
                          className="size-3 transition-transform duration-300 group-hover:translate-x-1"
                          aria-hidden
                        />
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-14 flex justify-center">
              <Button variant="outline" className="h-11 px-7 text-[10.5px] tracking-[0.2em] uppercase" asChild>
                <Link href="/baskets">
                  See all baskets
                  <ArrowRight className="size-3.5" aria-hidden />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Story cards */}
        <StoryCards />

        {/* Restaurant split band */}
        <section id="kitchen" className="scroll-mt-24 border-b border-foreground/[0.06]">
          <div className="mx-auto grid w-full max-w-[88rem] lg:grid-cols-12">
            <div className="relative aspect-4/3 lg:col-span-6 lg:aspect-auto lg:min-h-[38rem]">
              <Image
                src={kitchenBandImage}
                alt="A steel thali of dal, rice, curries and hot roti"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/55 to-transparent lg:bg-gradient-to-r lg:from-background/40" />
            </div>

            <div className="flex flex-col justify-center gap-9 px-6 py-16 lg:col-span-6 lg:py-24 lg:pr-10 lg:pl-16">
              <div className="flex flex-col gap-4">
                <span className="eyebrow">Cooked to order</span>
                <h2 className="max-w-lg text-[clamp(2rem,3.4vw,3rem)] leading-[1.02] font-light tracking-[-0.025em] text-ivory text-balance">
                  The kitchen at Local Organic
                </h2>
                <p className="max-w-md text-sm leading-relaxed text-ash">
                  Stone hearths, A2 ghee and cold-pressed mustard oil. Delivered
                  hot across the valley in 30&ndash;60 minutes.
                </p>
              </div>

              <ul className="grid gap-6 sm:grid-cols-3">
                {featuredDishes.map((dish) => (
                  <li key={dish.id}>
                    <DishCard dish={dish} showCustomize={false} />
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] tracking-[0.16em] text-ash uppercase">
                <span className="flex items-center gap-2">
                  <Truck className="size-3.5 text-gold/70" aria-hidden />
                  Valley-wide delivery
                </span>
                <span className="flex items-center gap-2">
                  <ShieldCheck className="size-3.5 text-gold/70" aria-hidden />
                  A2 ghee only
                </span>
              </div>

              <div>
                <Button variant="outline" className="h-11 px-7 text-[10.5px] tracking-[0.2em] uppercase" asChild>
                  <Link href="/restaurant">
                    Browse the menu
                    <ArrowRight className="size-3.5" aria-hidden />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Farmer story band */}
        <section id="farmers" className="scroll-mt-24 border-b border-foreground/[0.06]">
          <div className={`${shell} py-16 lg:py-24`}>
            <SectionHeader
              eyebrow="From the hills"
              title="From our farmers to your home"
              subline="Kavre greens picked within a day of delivery."
            />

            <ul className="mt-10 grid gap-px border border-foreground/[0.07] bg-foreground/[0.07] md:grid-cols-3">
              {farmers.map((farmer, index) => (
                <li
                  key={farmer.id}
                  className="flex flex-col gap-4 bg-background p-6 lg:p-8"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="tabular text-[10px] tracking-[0.24em] text-gold/70">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="flex items-center gap-1.5 text-[9px] tracking-[0.2em] text-ash uppercase">
                      <MapPin className="size-3 shrink-0" aria-hidden />
                      {farmer.location}
                    </span>
                  </div>
                  <h3 className="font-heading text-2xl leading-tight text-ivory">
                    {farmer.name}
                  </h3>
                  <p className="text-sm leading-relaxed text-ash">
                    {farmer.story.split(/(?<=\.)\s/)[0]}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-12">
              <Button variant="outline" className="h-11 px-7 text-[10.5px] tracking-[0.2em] uppercase" asChild>
                <Link href="/farmers">
                  Meet the farmers
                  <ArrowRight className="size-3.5" aria-hidden />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Membership — photo band with an inset gold panel */}
        <section id="membership" className="scroll-mt-24 border-b border-foreground/[0.06]">
          <div className={`${shell} py-16 lg:py-24`}>
            <div className="relative">
              <div className="relative aspect-16/9 overflow-hidden sm:aspect-21/9">
                <Image
                  src="/images/atelier-garlic.jpg"
                  alt="Garlic bulbs in a terracotta bowl on brick, lit like a Dutch still life"
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-background/45" />
              </div>

              <div className="relative -mt-12 mr-3 ml-3 border border-gold/30 bg-[#080d0a] p-6 sm:-mt-20 sm:ml-10 sm:max-w-2xl sm:p-10">
                <div className="flex flex-col gap-6">
                  <div>
                    <span className="flex items-center gap-2 text-[10px] tracking-[0.26em] text-gold uppercase">
                      <Star className="size-3" aria-hidden />
                      Membership
                    </span>
                    <h2 className="mt-3 max-w-lg text-2xl leading-[1.1] font-light tracking-[-0.02em] text-ivory text-balance sm:text-[1.75rem]">
                      Ten percent, always. Reward points, early access, and a
                      standing order we keep for you.
                    </h2>
                  </div>

                  <ul className="grid gap-3 sm:grid-cols-3">
                    {membershipBenefits.slice(0, 3).map((benefit) => {
                      const Icon = MEMBERSHIP_ICONS[benefit.icon];
                      return (
                        <li key={benefit.title} className="flex items-start gap-2">
                          <Icon className="mt-0.5 size-3.5 shrink-0 text-gold" aria-hidden />
                          <span className="text-xs leading-snug text-ash">
                            {benefit.title}
                          </span>
                        </li>
                      );
                    })}
                  </ul>

                  <Button className="h-11 w-fit px-7 text-[10.5px] tracking-[0.2em] uppercase" asChild>
                    <Link href="/membership">Join membership</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Standing order band */}
        <section id="standing-order" className="scroll-mt-24 border-b border-foreground/[0.06]">
          <div className={`${shell} py-16 lg:py-20`}>
            <div className="flex flex-col items-start justify-between gap-8 border border-gold/25 p-7 sm:p-10 lg:flex-row lg:items-center">
              <div className="flex flex-col gap-3">
                <span className="eyebrow">Standing order</span>
                <h2 className="max-w-xl text-[clamp(1.6rem,2.6vw,2.2rem)] leading-[1.05] font-light tracking-[-0.02em] text-ivory text-balance">
                  Milk, vegetables or fruit on repeat.
                </h2>
                <p className="max-w-lg text-sm text-ash">
                  Skip, pause or cancel whenever the week changes shape.
                </p>
              </div>
              <Button className="h-11 shrink-0 px-7 text-[10.5px] tracking-[0.2em] uppercase" asChild>
                <Link href="/baskets#subscriptions">Set up a plan</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Trust stack + payment chips */}
        <section className={`${shell} py-16 pb-20 lg:py-24`}>
          <TrustStack />

          <ul className="mt-10 flex flex-wrap items-center gap-2">
            {paymentMethods.map((method) => (
              <li
                key={method}
                className="border border-foreground/10 px-3 py-1.5 text-[10px] tracking-[0.16em] text-ash/70 uppercase"
              >
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
