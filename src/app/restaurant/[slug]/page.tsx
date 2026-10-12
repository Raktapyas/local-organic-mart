import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Flame, Leaf, MapPin } from "lucide-react";

import { DishCard } from "@/components/dish-card";
import { DishCustomizer } from "@/components/dish-customizer";
import { SectionHeader } from "@/components/section-header";
import { SiteFooter } from "@/components/site-footer";
import { dishes, dishBySlug, type Dish } from "@/lib/data";

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

export default async function DishPage({
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

      <main className="flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-7xl px-6 pt-8 pb-6">
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="transition-colors hover:text-foreground">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link
                  href="/restaurant"
                  className="transition-colors hover:text-foreground"
                >
                  Restaurant
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-foreground">{dish.name}</li>
            </ol>
          </nav>
        </div>

        <section className="mx-auto grid w-full max-w-7xl gap-10 px-6 pb-16 lg:grid-cols-2">
          {/* Gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-4/3 overflow-hidden rounded-xl border border-border">
              <Image
                src={frames[0]}
                alt={dish.name}
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
                    className="relative aspect-4/3 overflow-hidden rounded-lg border border-border"
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
                {dish.name}
              </h1>
              <p className="text-sage">
                {dish.nepaliName} &middot; {dish.portion}
              </p>
              <p className="text-sm leading-relaxed">{dish.desc}</p>
            </div>

            <div className="flex flex-wrap items-baseline gap-3 border-b border-border pb-5">
              <span className="font-heading text-3xl font-medium">
                Rs {npr.format(dish.price)}
              </span>
            </div>

            {/* Meta chips */}
            <ul className="flex flex-wrap items-center gap-2">
              <li className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                <Clock className="size-3.5" aria-hidden />
                Prep: {dish.prepTime}
              </li>
              <li className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                {dish.spice}
                {flames > 0 && (
                  <span className="flex items-center gap-0.5">
                    {Array.from({ length: flames }, (_, i) => (
                      <Flame key={i} className="size-3.5 fill-coral text-coral" aria-hidden />
                    ))}
                  </span>
                )}
              </li>
              <li className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                {dish.diet}
              </li>
            </ul>

            <DishCustomizer dish={dish} />

            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="size-3.5" aria-hidden />
              Delivered warm in 30&ndash;45 min inside Ring Road
            </p>

            <button
              type="button"
              className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Leaf className="size-4" aria-hidden />
              Save to favorites
            </button>
          </div>
        </section>

        {/* Pairs well with */}
        {related.length > 0 && (
          <section className="mx-auto w-full max-w-7xl px-6 pb-24">
            <SectionHeader
              title="Pairs well with"
              subline="More from the kitchen"
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
      </main>

      <SiteFooter />
    </>
  );
}