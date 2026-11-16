import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Clock, Flame, Leaf, MapPin } from "lucide-react";

import { DishCard } from "@/components/dish-card";
import { DishCustomizer } from "@/components/dish-customizer";
import { L } from "@/components/localized-text";
import { LocalizedNav } from "@/components/localized-nav";
import { SectionHeader } from "@/components/section-header";
import { SiteFooter } from "@/components/site-footer";
import { dishes, dishBySlug, type Dish } from "@/lib/data";
import { dishText } from "@/lib/i18n/localize";

const npr = new Intl.NumberFormat("en-NP");

const SPICE_FLAMES: Record<string, number> = {
  "Non-spicy": 0,
  Mild: 1,
  Medium: 2,
  Spicy: 3,
  Aromatic: 0,
};

/**
 * Only the dishes in `generateStaticParams` are built; unknown slugs are
 * rejected by the `notFound()` call below. `dynamicParams = false` is not
 * available while Cache Components is enabled.
 */
export function generateStaticParams() {
  return dishes.map((dish) => ({ slug: dish.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dish = dishes.find((item) => item.id === slug);
  if (!dish) return {};
  return {
    title: `${dish.name} — Local Organic Mart`,
    description: dish.desc,
  };
}

/** Unique gallery frames; duplicates dropped, one frame renders no thumbs. */
function galleryFrames(dish: Dish) {
  return [...new Set([dish.image, ...(dish.gallery ?? [])])];
}

/**
 * The page never awaits `params`: with Cache Components and Partial
 * Prefetching the App Shell is shared by every link, so URL data has to
 * resolve inside a Suspense boundary or Next reports it as blocking the
 * shell. `DishBody` receives the promise and suspends there.
 */
export default function DishPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <>
      <main className="flex flex-1 flex-col">
        <Suspense fallback={<DishSkeleton />}>
          <DishBody params={params} />
        </Suspense>
      </main>

      <SiteFooter />
    </>
  );
}

async function DishBody({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dish = dishBySlug(slug);
  if (!dish) notFound();

  const frames = galleryFrames(dish);
  const thumbs = frames.slice(1);
  const flames = SPICE_FLAMES[dish.spice] ?? 0;
  const ne = dishText(dish, "ne");

  // Prefer dishes sharing a tag, then fall back to the rest of the menu.
  const related = [
    ...dishes.filter(
      (item) =>
        item.id !== dish.id &&
        item.tags.some((tag) => dish.tags.includes(tag)),
    ),
    ...dishes.filter(
      (item) =>
        item.id !== dish.id &&
        !item.tags.some((tag) => dish.tags.includes(tag)),
    ),
  ].slice(0, 3);

  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-6 pt-8 pb-6">
        <LocalizedNav
          en="Breadcrumb"
          ne="ब्रेडक्रम्ब"
          className="text-xs text-muted-foreground"
        >
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="transition-colors hover:text-foreground">
                <L en="Home" ne="गृहपृष्ठ" />
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link
                href="/restaurant"
                className="transition-colors hover:text-foreground"
              >
                <L en="Restaurant" ne="रेस्टुरेन्ट" />
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-foreground">
              <L en={dish.name} ne={ne.name} />
            </li>
          </ol>
        </LocalizedNav>
      </div>

      <section className="mx-auto grid w-full max-w-7xl gap-10 px-6 pb-16 lg:grid-cols-2">
        {/* Gallery */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-4/3 overflow-hidden rounded-[2px] border border-border">
            <Image
              src={frames[0]}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 92vw"
              className="object-cover"
            />
          </div>
          {thumbs.length > 0 && (
            <ul className="grid grid-cols-2 gap-4">
              {thumbs.map((src) => (
                <li
                  key={src}
                  className="relative aspect-4/3 overflow-hidden rounded-[2px] border border-border"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 22vw, 46vw"
                    className="object-cover"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Detail */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl leading-tight tracking-tight sm:text-5xl">
              <L en={dish.name} ne={ne.name} />
            </h1>
            <p className="text-sage">
              {dish.nepaliName} &middot; <L en={dish.portion} ne={ne.portion} />
            </p>
            <p className="text-sm leading-relaxed">
              <L en={dish.desc} ne={ne.desc} />
            </p>
          </div>

          <div className="flex flex-wrap items-baseline gap-3 border-b border-border pb-5">
            <span className="font-heading text-3xl font-medium">
              <L
                en={`Rs ${npr.format(dish.price)}`}
                ne={`रु ${npr.format(dish.price)}`}
              />
            </span>
          </div>

          {/* Meta chips */}
          <ul className="flex flex-wrap items-center gap-2">
            <li className="inline-flex items-center gap-1.5 rounded-[2px] border border-border px-3 py-1 text-xs text-muted-foreground">
              <Clock className="size-3.5" aria-hidden />
              <L
                en={`Prep: ${dish.prepTime}`}
                ne={`तयारी: ${ne.prepTime}`}
              />
            </li>
            <li className="inline-flex items-center gap-1.5 rounded-[2px] border border-border px-3 py-1 text-xs text-muted-foreground">
              <L en={dish.spice} ne={ne.spice} />
              {flames > 0 && (
                <span className="flex items-center gap-0.5">
                  {Array.from({ length: flames }, (_, i) => (
                    <Flame key={i} className="size-3.5 fill-coral text-coral" aria-hidden />
                  ))}
                </span>
              )}
            </li>
            <li className="rounded-[2px] border border-border px-3 py-1 text-xs text-muted-foreground">
              <L en={dish.diet} ne={ne.diet} />
            </li>
          </ul>

          <DishCustomizer dish={dish} />

          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="size-3.5" aria-hidden />
            <L
              en="Delivered warm in 30–45 min inside Ring Road"
              ne="रिङ रोडभित्र 30–45 मिनेटमा तातै डेलिभरी"
            />
          </p>

          <button
            type="button"
            className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Leaf className="size-4" aria-hidden />
            <L en="Save to favorites" ne="मनपर्नेमा राख्नुहोस्" />
          </button>
        </div>
      </section>

      {/* Pairs well with */}
      {related.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-6 pb-24">
          <SectionHeader
            title="Pairs well with"
            titleNe="यससँग राम्रो लाग्छ"
            subline="More from the kitchen"
            sublineNe="भान्साबाट अरू पनि"
          />
          <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <li key={item.id}>
                <Link href={`/restaurant/${item.id}`} className="block h-full">
                  <DishCard dish={item} showCustomize={false} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

/** Holds the dish layout while `params` resolves. */
function DishSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 pt-8 pb-16" aria-hidden>
      <div className="h-3 w-56 rounded-[2px] bg-muted" />
      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div className="aspect-4/3 rounded-[2px] border border-border bg-card/40" />
        <div className="flex flex-col gap-4">
          <div className="h-10 w-2/3 rounded-[2px] bg-muted" />
          <div className="h-4 w-1/3 rounded-[2px] bg-muted" />
          <div className="mt-2 h-4 w-full rounded-[2px] bg-muted" />
          <div className="mt-2 h-px w-full bg-border" />
          <div className="h-8 w-1/2 rounded-[2px] bg-muted" />
          <div className="mt-2 h-10 w-40 rounded-[2px] border border-border bg-card/40" />
        </div>
      </div>
    </div>
  );
}
