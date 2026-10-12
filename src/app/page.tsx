import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";

import {
  Apple,
  Beef,
  CandlestickChart,
  FlaskConical,
  Globe2,
  Milk,
  Package,
  Sprout,
  UtensilsCrossed,
  Wheat,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { CountdownChip } from "@/components/countdown-chip";
import { HeroSlider } from "@/components/hero-slider";
import { DishCard } from "@/components/dish-card";
import { ProductCard } from "@/components/product-card";
import { SectionHeader } from "@/components/section-header";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";
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
  farmerBandImage,
  offerProduct,
  offers,
  restaurantBandImage,
  dealsCloseAt,
  type CategoryIconName,
  type Product,
} from "@/lib/data";

const categoryIcons: Record<CategoryIconName, LucideIcon> = {
  sprout: Sprout,
  apple: Apple,
  milk: Milk,
  flask: FlaskConical,
  wheat: Wheat,
  beef: Beef,
  candlestick: CandlestickChart,
  package: Package,
  globe: Globe2,
  utensils: UtensilsCrossed,
};

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
        <section className="relative isolate min-h-[calc(100svh-4rem)] overflow-hidden">
          {/* Slider sits behind at z-0 and paints the backgrounds + copy. */}
          <HeroSlider slides={heroSlides} />

          {/* Search floats above the slider, overlapping its lower third. */}
          <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-7xl flex-col items-start justify-end px-6 pb-14">
            <form
              action="/search"
              role="search"
              className="flex w-full max-w-xl items-center gap-3 rounded-full border border-foreground/15 bg-background/60 p-2 pl-5 shadow-lg backdrop-blur-xl transition-colors focus-within:border-mint/50"
            >
              <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              <input
                type="search"
                name="q"
                aria-label="Search produce, pantry, and menus"
                placeholder="Search produce, pantry, and menus"
                className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <Button type="submit" className="rounded-full px-5">
                Search
              </Button>
            </form>
          </div>
        </section>

        {/* Category rail */}
        <section className="mx-auto w-full max-w-7xl px-6 py-20">
          <SectionHeader
            title="Shop by category"
            titleKey="sections.shopByCategory"
            subline="Ten departments, filled from the morning harvest."
            sublineKey="sections.shopByCategorySub"
          />

          <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
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
                      sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4">
                      <Icon
                        className="size-4 text-mint transition-transform duration-300 group-hover:-translate-y-0.5"
                        aria-hidden
                      />
                      <h3 className="font-heading text-base leading-tight">
                        {category.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {category.note}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Deals rail */}
        <section className="border-y border-foreground/10 bg-card">
          <div className="mx-auto w-full max-w-7xl px-6 py-20">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeader
                title="This week's big deals"
                titleKey="sections.bigDeals"
                subline="Small allocations from this week's harvest."
                sublineKey="sections.bigDealsSub"
              />
              <div className="flex items-center gap-4">
                <CountdownChip closesAt={dealsCloseAt} />
                <Button variant="outline" className="rounded-full" asChild>
                  <Link href="/offers">
                    See all
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </Button>
              </div>
            </div>

            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {dealProducts.map((product) => (
                <li key={product.id}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Baskets */}
        <section className="mx-auto w-full max-w-7xl px-6 py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeader
              title="Baskets & bundles"
              titleKey="sections.baskets"
              subline="Curated weekly farm boxes, calibrated for Kathmandu households."
              sublineKey="sections.basketsSub"
            />
            <Button variant="outline" className="rounded-full" asChild>
              <Link href="/baskets">
                See all
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </div>

          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {baskets.slice(0, 3).map((basket) => (
              <li key={basket.id}>
                <Card className="h-full">
                  <CardHeader>
                    <Badge variant="outline" className="w-fit border-gold/60 text-gold">
                      {basket.tag}
                    </Badge>
                    <CardTitle className="pt-2">{basket.name}</CardTitle>
                    <CardDescription>
                      {basket.nepaliName} &middot; {basket.includes.length} items
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col gap-5">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {basket.desc}
                    </p>
                    <ul className="flex flex-col gap-1.5">
                      {basket.includes.map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <span
                            aria-hidden
                            className="size-1 shrink-0 rounded-full bg-gold"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto flex items-center justify-between gap-4 pt-2">
                      <span className="flex items-baseline gap-2">
                        <span className="font-heading text-2xl">
                          Rs {npr.format(basket.price)}
                        </span>
                        {basket.oldPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            Rs {npr.format(basket.oldPrice)}
                          </span>
                        )}
                      </span>
                      <Button className="rounded-full">Add basket</Button>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </section>

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
        <section className="mx-auto w-full max-w-7xl px-6 py-20">
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

          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {farmers.map((farmer) => (
              <li key={farmer.id}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>{farmer.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1.5">
                      <MapPin className="size-3.5 shrink-0" aria-hidden />
                      {farmer.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {farmer.story}
                    </p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <Button variant="outline" className="rounded-full" asChild>
              <Link href="/farmers">
                Meet the farmers
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </section>

        {/* Membership */}
        <section className="mx-auto w-full max-w-7xl px-6 pb-24">
          <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-accent p-10 sm:p-14">
            <Image
              src={farmerBandImage}
              alt=""
              aria-hidden
              fill
              sizes="100vw"
              className="object-cover opacity-20"
            />
            <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-3">
                <span className="flex items-center gap-2 text-sm text-gold">
                  <Star className="size-4" aria-hidden />
                  Membership
                </span>
                <h2 className="max-w-lg text-3xl tracking-tight text-balance">
                  Membership &mdash; 10% off, reward points, and early access to
                  every deal.
                </h2>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
                <Button className="rounded-full" asChild>
                  <Link href="/membership">Join membership</Link>
                </Button>
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Camera className="size-3.5" aria-hidden />
                  Member pricing unlocks at checkout
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}