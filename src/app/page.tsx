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
  Sparkles,
  Star,
  Truck,
} from "lucide-react";

import { CountdownChip } from "@/components/countdown-chip";
import { HeroSlider } from "@/components/hero-slider";
import { HomeSearch } from "@/components/home-search";
import { TrustStack } from "@/components/trust-stack";
import { StoryCards } from "@/components/story-cards";
import { TrustStrip } from "@/components/trust-strip";
import { WeeklyEssentials } from "@/components/weekly-essentials";
import { BannerTrio } from "@/components/banner-trio";
import { BestsellersRail } from "@/components/bestsellers-rail";
import { categoryIcons } from "@/components/category-icons";

const MEMBERSHIP_ICONS = {
  percent: Percent,
  stars: Star,
  clock: Clock,
  truck: Truck,
  gift: Gift,
  headset: Headset,
} as const;
import { DishCard } from "@/components/dish-card";
import { ProductCard } from "@/components/product-card";
import { SectionHeader } from "@/components/section-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  restaurantBandImage,
  dealsCloseAt,
  type Product,
} from "@/lib/data";

/** Deal lines resolved against the product table, discounted lines only. */
const dealProducts = offers
  .map(offerProduct)
  .filter((product): product is Product => product !== undefined && !product.outOfStock);

/** Featured dishes for the restaurant band. */
const featuredDishes = dishes.slice(0, 3);

const npr = new Intl.NumberFormat("en-NP");

export default function Home() {
  return (
    <>

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="relative isolate h-[72svh] overflow-hidden md:min-h-[calc(100svh-4rem)] md:h-auto">
          {/* Slider sits behind at z-0 and paints the backgrounds + copy. */}
          <HeroSlider slides={heroSlides} />

          {/* Search floats above the slider, overlapping its lower third. */}
          <div className="relative z-10 mx-auto flex h-[72svh] w-full max-w-7xl flex-col items-start justify-end px-6 pb-10 md:min-h-[calc(100svh-4rem)] md:h-auto md:pb-14">
            <HomeSearch />
          </div>
        </section>

        {/* Trust strip, then the three banners — both directly under the hero */}
        <TrustStrip />
        <BannerTrio />

        {/* Category rail */}
        <section className="mx-auto w-full max-w-7xl px-6 py-10 lg:py-12">
          <SectionHeader
            title="Shop by category"
            titleKey="sections.shopByCategory"
            subline="Ten departments, filled from the morning harvest."
            sublineKey="sections.shopByCategorySub"
          />

          <ul className="mt-5 grid grid-cols-3 gap-2.5 sm:gap-3 lg:grid-cols-10">
            {categories.map((category) => {
              const Icon = categoryIcons[category.icon];
              return (
                <li key={category.id}>
                  <Link
                    href={category.href}
                    className="group relative block aspect-square overflow-hidden rounded-xl ring-1 ring-foreground/10 transition-all hover:ring-mint/35"
                  >
                    <Image
                      src={category.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 10vw, (min-width: 640px) 33vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-2.5 lg:p-2">
                      <Icon
                        className="size-3.5 text-mint transition-transform duration-300 group-hover:-translate-y-0.5 lg:hidden"
                        aria-hidden
                      />
                      {/* Ten across leaves no room for the note at any width. */}
                      <h3 className="font-heading text-[11px] leading-tight lg:text-xs">
                        {category.name}
                      </h3>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Weekly essentials — `id` is the target for the mega menu */}
        <section
          id="weekly"
          className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 py-10 lg:py-12"
        >
          {/* One line, then a single strip — no second heading block. */}
          <h2 className="font-heading text-2xl tracking-tight">
            Weekly essentials
          </h2>
          <div className="mt-4">
            <WeeklyEssentials products={products} />
          </div>
        </section>

        {/* Bestsellers — tabbed rail, above the deals section */}
        <BestsellersRail excludeIds={dealProducts.map((product) => product.id)} />

        {/* Deals rail */}
        <section className="border-y border-foreground/10 bg-card">
          <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:py-12">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeader
                title="This week's big deals"
                titleKey="sections.bigDeals"
                subline="Small allocations from this week's harvest."
                sublineKey="sections.bigDealsSub"
              />
              <div className="flex items-center gap-4">
                <CountdownChip closesAt={dealsCloseAt} />
              </div>
            </div>

            <ul className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
              {dealProducts.map((product) => (
                <li key={product.id}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>

            <div className="mt-8 flex justify-center">
              <Button className="rounded-full" asChild>
                <Link href="/offers">See all deals</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Baskets */}
        <section className="mx-auto w-full max-w-7xl px-6 py-10 lg:py-12">
          <SectionHeader
            title="Baskets & bundles"
            titleKey="sections.baskets"
            subline="Curated weekly farm boxes, calibrated for Kathmandu households."
            sublineKey="sections.basketsSub"
          />

          <ul className="mt-5 grid gap-4 sm:grid-cols-3">
            {baskets.slice(0, 3).map((basket) => (
              <li key={basket.id}>
                {/* Photo background + scrim. Item detail lives on /baskets. */}
                <Link
                  href="/baskets"
                  className="group relative flex aspect-4/3 flex-col justify-end overflow-hidden rounded-xl"
                >
                  <Image
                    src={basket.image ?? "/images/category-local.jpg"}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />

                  <div className="relative p-5">
                    <span className="text-[10px] tracking-wider text-gold uppercase">
                      {basket.tag}
                    </span>
                    <h3 className="mt-1 font-heading text-lg leading-tight">
                      {basket.name}
                    </h3>
                    <p className="mt-1 text-xs text-sage">
                      {basket.includes.length} items &middot;{" "}
                      <span className="text-foreground">
                        Rs {npr.format(basket.price)}
                      </span>
                      {basket.oldPrice ? (
                        <span className="ml-1.5 text-muted-foreground line-through">
                          Rs {npr.format(basket.oldPrice)}
                        </span>
                      ) : null}
                    </p>
                    <span className="mt-3 inline-flex rounded-full bg-mint px-5 py-2 text-xs font-medium text-primary-foreground">
                      Add basket
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex justify-center">
            <Button className="rounded-full" asChild>
              <Link href="/baskets">See all baskets</Link>
            </Button>
          </div>
        </section>

        {/* Story cards */}
        <StoryCards />

        {/* Restaurant split band */}
        <section className="border-y border-foreground/10">
          <div className="mx-auto grid w-full max-w-7xl gap-0 px-6 lg:grid-cols-2">
            <div className="relative aspect-4/3 lg:aspect-auto lg:min-h-[34rem]">
              <Image
                src={restaurantBandImage}
                alt="A brass thali of Nepali dishes set for a feast"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>

            <div className="flex flex-col justify-center gap-8 py-16 lg:py-24 lg:pl-16">
              <div className="flex flex-col gap-3">
                <span className="flex items-center gap-2 text-sm text-mint">
                  <Sparkles className="size-4" aria-hidden />
                  Cooked to order
                </span>
                <h2 className="text-4xl leading-tight tracking-tight text-balance">
                  Local Organic Restaurant
                </h2>
                <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                  Cooked to order on stone hearths and delivered hot across
                  Kathmandu Valley in 30&ndash;60 minutes.
                </p>
              </div>

              <ul className="grid gap-4 sm:grid-cols-3">
                {featuredDishes.map((dish) => (
                  <li key={dish.id}>
                    <DishCard dish={dish} showCustomize={false} />
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Truck className="size-3.5" aria-hidden />
                  Valley-wide delivery
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5" aria-hidden />
                  Cooked in A2 ghee and cold mustard oil
                </span>
              </div>

              <div>
                <Button variant="outline" className="rounded-full" asChild>
                  <Link href="/restaurant">
                    Browse the menu
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Farmer story band */}
        <section className="mx-auto w-full max-w-7xl px-6 py-10 lg:py-12">
          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-2 text-sm text-mint">
              <ShieldCheck className="size-4" aria-hidden />
              From our farmers to your home
            </span>
            <h2 className="max-w-2xl text-3xl tracking-tight text-balance">
              From our farmers to your home
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              Kavre greens picked within a day of delivery. Every lot carries the
              name and elevation of the steward who grew it.
            </p>
          </div>

          <ul className="mt-5 grid gap-4 md:grid-cols-3">
            {farmers.map((farmer) => (
              <li key={farmer.id}>
                <Card className="flex h-full flex-col gap-3">
                  <CardHeader>
                    <CardTitle className="text-base">{farmer.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1.5">
                      <MapPin className="size-3.5 shrink-0" aria-hidden />
                      {farmer.location}
                    </CardDescription>
                  </CardHeader>

                  {/* First sentence only — the full story is on /farmers. */}
                  <CardContent className="flex-1">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {farmer.story.split(/(?<=\.)\s/)[0]}
                    </p>
                  </CardContent>

                  <CardContent>
                    <Button variant="outline" size="sm" className="rounded-full" asChild>
                      <Link href="/farmers">Meet the farmers</Link>
                    </Button>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>

          <div className="mt-5">
            <Button variant="outline" className="rounded-full" asChild>
              <Link href="/farmers">
                Meet the farmers
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </section>

        {/* Membership — photo card with the panel overlapping it, reference style */}
        <section className="mx-auto w-full max-w-7xl px-6 pb-10 lg:pb-14">
          <div className="relative">
            <div className="relative aspect-16/9 overflow-hidden rounded-2xl sm:aspect-21/9">
              <Image
                src="/images/farmer-highlands.jpg"
                alt=""
                aria-hidden
                fill
                sizes="100vw"
                className="object-cover"
              />
              {/* Darker than the last pass so the panel reads as the subject. */}
              <div className="absolute inset-0 bg-background/60" />
            </div>

            {/* Gold-bordered panel sitting over the photo's lower left. */}
            <div className="relative -mt-10 ml-3 mr-3 rounded-2xl border border-gold/40 bg-card/95 p-6 backdrop-blur-sm sm:-mt-16 sm:ml-8 sm:max-w-2xl sm:p-8">
              <div className="flex flex-col gap-5">
                <div>
                  <span className="flex items-center gap-2 text-xs tracking-wider text-gold uppercase">
                    <Star className="size-3.5" aria-hidden />
                    Membership
                  </span>
                  <h2 className="mt-2 max-w-lg text-xl leading-tight tracking-tight text-balance sm:text-2xl">
                    Membership &mdash; 10% off, reward points, early access.
                  </h2>
                </div>

                {/* Three benefits, one line each, drawn from the real data. */}
                <ul className="grid gap-3 sm:grid-cols-3">
                  {membershipBenefits.slice(0, 3).map((benefit) => {
                    const Icon = MEMBERSHIP_ICONS[benefit.icon];
                    return (
                      <li key={benefit.title} className="flex items-start gap-2">
                        <Icon className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
                        <span className="text-xs leading-snug text-muted-foreground">
                          {benefit.title}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <Button className="w-fit rounded-full bg-gold text-background hover:opacity-90" asChild>
                  <Link href="/membership">Join membership</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Auto delivery band — warm brown is the reference's secondary accent */}
        <section className="mx-auto w-full max-w-7xl px-6 py-10 lg:py-12">
          <div className="flex flex-col items-start gap-4 rounded-2xl border border-[#3A2A1A] bg-[#3A2A1A]/40 p-5 sm:p-7">
            <div className="flex flex-col gap-2">
              <h2 className="font-heading text-xl tracking-tight text-balance sm:text-2xl">
                Milk, vegetables or fruit on repeat.
              </h2>
              <p className="max-w-lg text-sm text-sage">
                Skip, pause or cancel anytime.
              </p>
            </div>
            <Button className="rounded-full" asChild>
              <Link href="/baskets#subscriptions">Set up a plan</Link>
            </Button>
          </div>
        </section>

        {/* Trust stack + payment chips */}
        <section className="mx-auto w-full max-w-7xl px-6 pb-16 sm:pb-24">
          <TrustStack />

          <ul className="mt-5 flex flex-wrap items-center gap-2">
            {paymentMethods.map((method) => (
              <li
                key={method}
                className="rounded-full border border-foreground/10 px-3 py-1.5 text-xs text-muted-foreground"
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