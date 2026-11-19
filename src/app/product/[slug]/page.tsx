import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  BadgeCheck,
  CalendarDays,
  Heart,
  Leaf,
  MapPin,
  QrCode,
} from "lucide-react";

import { L } from "@/components/localized-text";
import { LocalizedNav } from "@/components/localized-nav";
import { PhotoFallback } from "@/components/photo-fallback";
import { ProductCard } from "@/components/product-card";
import { ProductPurchase } from "@/components/product-purchase";
import { SectionHeader } from "@/components/section-header";
import { SiteFooter } from "@/components/site-footer";
import { Stars } from "@/components/stars";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  discountPercent,
  productBySlug,
  products,
  type Product,
} from "@/lib/data";
import { productText } from "@/lib/i18n/localize";

const npr = new Intl.NumberFormat("en-NP");

/**
 * Only the products in `generateStaticParams` are built. Unknown slugs are
 * rejected by the `notFound()` call below.
 *
 * `dynamicParams = false` would express this directly, but it is not
 * available while Cache Components is enabled (next.config.ts), so the guard
 * below is what actually returns the 404.
 */

/** Prerender every product at build time. */
export function generateStaticParams() {
  return products.map((product) => ({ slug: product.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} — Local Organic Mart`,
    description: product.desc,
  };
}

/**
 * Unique gallery frames for a product, main photo first. Duplicates are
 * dropped so a product never shows the same frame twice, and a product with
 * only one frame renders no thumbnail strip at all. A product with no photo
 * returns no frames and renders the gradient fallback instead.
 */
function galleryFrames(product: Product) {
  if (!product.image) return [];
  return [...new Set([product.image, ...(product.gallery ?? [])])];
}

/**
 * The page never awaits `params`: with Cache Components and Partial
 * Prefetching the App Shell is shared by every link, so URL data has to
 * resolve inside a Suspense boundary or Next reports it as blocking the
 * shell. `ProductBody` receives the promise and suspends there.
 */
export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <>
      <main className="flex flex-1 flex-col">
        <Suspense fallback={<ProductSkeleton />}>
          <ProductBody params={params} />
        </Suspense>
      </main>

      <SiteFooter />
    </>
  );
}

async function ProductBody({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) notFound();

  const off = discountPercent(product);
  const frames = galleryFrames(product);
  const thumbs = frames.slice(1);

  /*
    The page is a server component, so it renders one tree and the language
    store swaps strings after hydration. Resolving the Nepali copy here — it is
    a pure function over the same product — lets `<L>` carry both versions
    without shipping the catalogue to the client.
  */
  const ne = productText(product, "ne");

  const related = products
    .filter((item) => item.id !== product.id && item.category === product.category)
    .slice(0, 4);

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
              <Link href="/mart" className="transition-colors hover:text-foreground">
                <L en="Mart" ne="मार्ट" />
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-foreground">
              <L en={product.category} ne={ne.category} />
            </li>
          </ol>
        </LocalizedNav>
      </div>

      <section className="mx-auto grid w-full max-w-7xl gap-10 px-6 pb-16 lg:grid-cols-2">
        {/* Gallery */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square overflow-hidden rounded-[2px] border border-border">
            {frames[0] ? (
              <Image
                src={frames[0]}
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 92vw"
                className="object-cover"
              />
            ) : (
              <PhotoFallback
                label={ne.category}
                className="absolute inset-0"
              />
            )}
          </div>
          {thumbs.length > 0 && (
            <ul className="grid grid-cols-3 gap-4">
              {thumbs.map((src) => (
                <li
                  key={src}
                  className="relative aspect-square overflow-hidden rounded-[2px] border border-border"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 15vw, 30vw"
                    className="object-cover"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Detail */}
        <div className="flex flex-col">
          {(product.flags.organic || product.flags.local) && (
            <div className="flex flex-wrap gap-2">
              {product.flags.organic && (
                <span className="inline-flex items-center gap-1.5 rounded-[2px] border border-gold/40 bg-card px-3 py-1 text-xs text-gold">
                  <Leaf className="size-3.5" aria-hidden />
                  <L en="Organic" ne="जैविक" />
                </span>
              )}
              {product.flags.local && (
                <span className="inline-flex items-center gap-1.5 rounded-[2px] border border-gold/40 bg-card px-3 py-1 text-xs text-gold">
                  <MapPin className="size-3.5" aria-hidden />
                  <L en="Local" ne="स्थानीय" />
                </span>
              )}
            </div>
          )}

          <h1 className="mt-4 text-4xl leading-tight tracking-tight sm:text-5xl">
            <L en={product.name} ne={ne.name} />
          </h1>
          <p className="mt-1 text-sage">
            {product.nepaliName} &middot; <L en={product.unit} ne={ne.unit} />
          </p>

          <div className="mt-6 flex flex-wrap items-baseline gap-3 border-b border-border pb-6">
            <span className="text-3xl font-medium">
              <L
                en={`Rs ${npr.format(product.price)}`}
                ne={`रु ${npr.format(product.price)}`}
              />
            </span>
            {product.oldPrice && (
              <span className="text-sm text-muted-foreground line-through">
                <L
                  en={`Rs ${npr.format(product.oldPrice)}`}
                  ne={`रु ${npr.format(product.oldPrice)}`}
                />
              </span>
            )}
            {off !== null && (
              <span className="rounded-[2px] border border-coral/30 bg-coral/12 px-2 py-0.5 text-xs font-semibold text-coral">
                &minus;{off}%
              </span>
            )}
          </div>

          <p className="mt-6 text-sm leading-relaxed">
            <L en={product.desc} ne={ne.desc} />
          </p>

          <dl className="mt-6 divide-y divide-border overflow-hidden rounded-[2px] border border-border bg-card">
            <div className="flex items-center gap-3 px-4 py-3">
              <CalendarDays className="size-4 shrink-0 text-mint" aria-hidden />
              <dt className="sr-only">
                <L en="Harvest" ne="बाली" />
              </dt>
              <dd className="text-sm">
                <L
                  en={`Harvested ${product.harvestedOn} · ${product.region}`}
                  ne={`टिपिएको ${ne.harvestedOn} · ${ne.region}`}
                />
              </dd>
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <QrCode className="size-4 shrink-0 text-mint" aria-hidden />
              <dt className="sr-only">
                <L en="Batch" ne="ब्याच" />
              </dt>
              <dd className="text-sm">
                <L en={`Batch #${product.batch}`} ne={`ब्याच #${product.batch}`} />
              </dd>
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <BadgeCheck className="size-4 shrink-0 text-mint" aria-hidden />
              <dt className="sr-only">
                <L en="Freshness" ne="ताजापन" />
              </dt>
              <dd className="text-sm">
                <L en={product.freshness} ne={ne.freshness} />
              </dd>
            </div>
          </dl>

          {product.bulkTiers && (
            <div className="mt-6">
              <h2 className="text-xs tracking-wider text-sage uppercase">
                <L
                  en="Volume & Collective Reserve"
                  ne="थोक र सामूहिक आरक्षित"
                />
              </h2>
              <ul className="mt-2 grid grid-cols-3 gap-2">
                {product.bulkTiers.map((tier, index) => (
                  <li key={tier.label}>
                    <span
                      className={
                        index === 0
                          ? "block rounded-[2px] border border-mint bg-card px-3 py-2.5 text-left"
                          : "block rounded-[2px] border border-border bg-card px-3 py-2.5 text-left"
                      }
                    >
                      <span
                        className={
                          index === 0
                            ? "block text-sm text-mint"
                            : "block text-sm"
                        }
                      >
                        <L
                          en={tier.label}
                          ne={ne.bulkTiers?.[index]?.label ?? tier.label}
                        />
                      </span>
                      <span className="mt-0.5 block text-[11px] text-muted-foreground">
                        <L
                          en={tier.note}
                          ne={ne.bulkTiers?.[index]?.note ?? tier.note}
                        />
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6">
            <ProductPurchase product={product} />
          </div>

          <button
            type="button"
            className="mt-5 inline-flex min-h-9 w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Heart className="size-4" aria-hidden />
            <L en="Save to wishlist" ne="इच्छासूचीमा राख्नुहोस्" />
          </button>
        </div>
      </section>

      {/* Tabs */}
      <section className="mx-auto w-full max-w-7xl px-6 pb-16">
        <Tabs defaultValue="description">
          {/* The three labels need ~325px at the full size, so below `sm`
              they drop to the label scale and tighten their padding rather
              than pushing the page into horizontal scroll. */}
          <TabsList variant="line" className="gap-0.5 sm:gap-1">
            <TabsTrigger
              value="description"
              className="px-1.5 text-[12px] sm:px-4 sm:text-sm"
            >
              <L en="Description" ne="विवरण" />
            </TabsTrigger>
            <TabsTrigger
              value="traceability"
              className="px-1.5 text-[12px] sm:px-4 sm:text-sm"
            >
              <L en="Traceability" ne="उत्पत्ति विवरण" />
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="px-1.5 text-[12px] sm:px-4 sm:text-sm"
            >
              <L en="Reviews" ne="समीक्षा" />
              {product.reviews ? ` (${product.reviews.length})` : ""}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="pt-6">
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              <L
                en={`${product.desc} Every lot is dispatched within three hours of harvest, and every crate carries the batch code printed above.`}
                ne={`${ne.desc} हरेक लट बाली उठाएको तीन घण्टाभित्र पठाइन्छ, र हरेक क्रेटमा माथि छापिएको ब्याच कोड हुन्छ।`}
              />
            </p>
          </TabsContent>

          <TabsContent value="traceability" className="pt-6">
            <dl className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[2px] border border-border bg-card p-4">
                <dt className="text-xs tracking-wider text-sage uppercase">
                  <L en="Harvest" ne="बाली" />
                </dt>
                <dd className="mt-1 text-sm">
                  <L
                    en={`${product.harvestedOn} · ${product.region}`}
                    ne={`${ne.harvestedOn} · ${ne.region}`}
                  />
                </dd>
              </div>
              <div className="rounded-[2px] border border-border bg-card p-4">
                <dt className="text-xs tracking-wider text-sage uppercase">
                  <L en="Batch" ne="ब्याच" />
                </dt>
                <dd className="mt-1 text-sm">#{product.batch}</dd>
              </div>
              <div className="rounded-[2px] border border-border bg-card p-4">
                <dt className="text-xs tracking-wider text-sage uppercase">
                  <L en="Freshness" ne="ताजापन" />
                </dt>
                <dd className="mt-1 text-sm">
                  <L en={product.freshness} ne={ne.freshness} />
                </dd>
              </div>
            </dl>
          </TabsContent>

          <TabsContent value="reviews" className="pt-6">
            {product.reviews ? (
              <ul className="grid gap-4 sm:grid-cols-2">
                {product.reviews.map((review, index) => (
                  <li
                    key={review.id}
                    className="rounded-[2px] border border-border bg-card p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm">
                        <L
                          en={`${review.author} · ${review.locality}`}
                          ne={`${ne.reviews?.[index]?.author ?? review.author} · ${ne.reviews?.[index]?.locality ?? review.locality}`}
                        />
                      </span>
                      <Stars rating={review.rating} />
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      <L
                        en={review.body}
                        ne={ne.reviews?.[index]?.body ?? review.body}
                      />
                    </p>
                    {review.verified && (
                      <span className="mt-3 inline-flex items-center gap-1.5 text-xs text-sage">
                        <BadgeCheck className="size-3.5" aria-hidden />
                        <L en="Verified patron" ne="प्रमाणित ग्राहक" />
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                <L en="No reviews yet" ne="अझै कुनै समीक्षा छैन" />
              </p>
            )}
          </TabsContent>
        </Tabs>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-6 pb-24">
          <SectionHeader
            title="You may also like"
            titleNe="तपाईंलाई यी पनि मन पर्न सक्छ"
            subline={`More from ${product.category.toLowerCase()}`}
            sublineNe={`${ne.category} मा अरू पनि`}
          />
          <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <li key={item.id}>
                {/* The card owns its own links. Wrapping it in another <a>
                    produced nested anchors, which the browser silently
                    rewrites and React reports as a hydration mismatch. */}
                <ProductCard product={item} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

/** Holds the two-column detail layout while `params` resolves. */
function ProductSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 pt-8 pb-16" aria-hidden>
      <div className="h-3 w-48 rounded-[2px] bg-muted" />
      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div className="aspect-square rounded-[2px] border border-border bg-card/40" />
        <div className="flex flex-col gap-4">
          <div className="h-10 w-3/4 rounded-[2px] bg-muted" />
          <div className="h-4 w-1/3 rounded-[2px] bg-muted" />
          <div className="mt-2 h-px w-full bg-border" />
          <div className="mt-2 h-8 w-1/2 rounded-[2px] bg-muted" />
          <div className="mt-2 h-4 w-full rounded-[2px] bg-muted" />
          <div className="h-4 w-5/6 rounded-[2px] bg-muted" />
          <div className="mt-4 h-28 w-full rounded-[2px] border border-border bg-card/40" />
        </div>
      </div>
    </div>
  );
}
