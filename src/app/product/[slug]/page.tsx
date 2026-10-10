import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
  CalendarDays,
  Heart,
  Leaf,
  MapPin,
  QrCode,
  Star,
} from "lucide-react";

import { ProductCard } from "@/components/product-card";
import { ProductPurchase } from "@/components/product-purchase";
import { SectionHeader } from "@/components/section-header";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  categories,
  discountPercent,
  productBySlug,
  products,
  type Product,
} from "@/lib/data";

const npr = new Intl.NumberFormat("en-NP");

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

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          aria-hidden
          className={
            star <= rating
              ? "size-3.5 fill-gold text-gold"
              : "size-3.5 text-muted-foreground/40"
          }
        />
      ))}
    </span>
  );
}

/** Category tile photo for a product, used as the gallery's second frame. */
function categoryImage(product: Product) {
  const match = categories.find((category) =>
    product.category.toLowerCase().includes(category.name.split(" ")[0].toLowerCase()),
  );
  return match?.image ?? "/images/category-produce.jpg";
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) notFound();

  const off = discountPercent(product);
  const thumbs = [
    { src: product.image, alt: `${product.name}, close view` },
    { src: categoryImage(product), alt: `${product.category}, from the mart` },
    { src: "/images/category-global.jpg", alt: `${product.name}, in the valley` },
  ];

  const related = products
    .filter((item) => item.id !== product.id && item.category === product.category)
    .slice(0, 4);

  return (
    <>
      <SiteHeader />

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
                <Link href="/mart" className="transition-colors hover:text-foreground">
                  Mart
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-foreground">{product.category}</li>
            </ol>
          </nav>
        </div>

        <section className="mx-auto grid w-full max-w-7xl gap-10 px-6 pb-16 lg:grid-cols-2">
          {/* Gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square overflow-hidden rounded-xl border border-border">
              <Image
                src={thumbs[0].src}
                alt={thumbs[0].alt}
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 92vw"
                className="object-cover"
              />
            </div>
            <ul className="grid grid-cols-3 gap-4">
              {thumbs.slice(1).map((thumb) => (
                <li
                  key={thumb.src}
                  className="relative aspect-square overflow-hidden rounded-lg border border-border"
                >
                  <Image
                    src={thumb.src}
                    alt={thumb.alt}
                    fill
                    sizes="(min-width: 1024px) 15vw, 30vw"
                    className="object-cover"
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Detail */}
          <div className="flex flex-col">
            {(product.flags.organic || product.flags.local) && (
              <div className="flex flex-wrap gap-2">
                {product.flags.organic && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-card px-3 py-1 text-xs text-gold">
                    <Leaf className="size-3.5" aria-hidden />
                    Organic
                  </span>
                )}
                {product.flags.local && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-card px-3 py-1 text-xs text-gold">
                    <MapPin className="size-3.5" aria-hidden />
                    Local
                  </span>
                )}
              </div>
            )}

            <h1 className="mt-4 text-4xl leading-tight tracking-tight sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-1 text-sage">
              {product.nepaliName} &middot; {product.unit}
            </p>

            <div className="mt-6 flex flex-wrap items-baseline gap-3 border-b border-border pb-6">
              <span className="text-3xl font-medium">
                Rs {npr.format(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  Rs {npr.format(product.oldPrice)}
                </span>
              )}
              {off !== null && (
                <span className="rounded-full border border-coral/30 bg-coral/12 px-2 py-0.5 text-xs font-semibold text-coral">
                  &minus;{off}%
                </span>
              )}
            </div>

            <p className="mt-6 text-sm leading-relaxed">{product.desc}</p>

            <dl className="mt-6 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
              <div className="flex items-center gap-3 px-4 py-3">
                <CalendarDays className="size-4 shrink-0 text-mint" aria-hidden />
                <dt className="sr-only">Harvest</dt>
                <dd className="text-sm">
                  Harvested {product.harvestedOn} &middot; {product.region}
                </dd>
              </div>
              <div className="flex items-center gap-3 px-4 py-3">
                <QrCode className="size-4 shrink-0 text-mint" aria-hidden />
                <dt className="sr-only">Batch</dt>
                <dd className="text-sm">Batch #{product.batch}</dd>
              </div>
              <div className="flex items-center gap-3 px-4 py-3">
                <BadgeCheck className="size-4 shrink-0 text-mint" aria-hidden />
                <dt className="sr-only">Freshness</dt>
                <dd className="text-sm">{product.freshness}</dd>
              </div>
            </dl>

            {product.bulkTiers && (
              <div className="mt-6">
                <h2 className="text-xs tracking-wider text-sage uppercase">
                  Volume &amp; Collective Reserve
                </h2>
                <ul className="mt-2 grid grid-cols-3 gap-2">
                  {product.bulkTiers.map((tier, index) => (
                    <li key={tier.label}>
                      <span
                        className={
                          index === 0
                            ? "block rounded-xl border border-mint bg-card px-3 py-2.5 text-left"
                            : "block rounded-xl border border-border bg-card px-3 py-2.5 text-left"
                        }
                      >
                        <span
                          className={
                            index === 0
                              ? "block text-sm text-mint"
                              : "block text-sm"
                          }
                        >
                          {tier.label}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-muted-foreground">
                          {tier.note}
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
              className="mt-5 inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Heart className="size-4" aria-hidden />
              Save to wishlist
            </button>
          </div>
        </section>

        {/* Tabs */}
        <section className="mx-auto w-full max-w-7xl px-6 pb-16">
          <Tabs defaultValue="description">
            <TabsList variant="line">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="traceability">Traceability</TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews{product.reviews ? ` (${product.reviews.length})` : ""}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="pt-6">
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {product.desc} Every lot is dispatched from Baluwatar within
                three hours of harvest, and every crate carries the batch code
                printed above.
              </p>
            </TabsContent>

            <TabsContent value="traceability" className="pt-6">
              <dl className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-border bg-card p-4">
                  <dt className="text-xs tracking-wider text-sage uppercase">
                    Harvest
                  </dt>
                  <dd className="mt-1 text-sm">
                    {product.harvestedOn} &middot; {product.region}
                  </dd>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                  <dt className="text-xs tracking-wider text-sage uppercase">
                    Batch
                  </dt>
                  <dd className="mt-1 text-sm">#{product.batch}</dd>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                  <dt className="text-xs tracking-wider text-sage uppercase">
                    Freshness
                  </dt>
                  <dd className="mt-1 text-sm">{product.freshness}</dd>
                </div>
              </dl>
            </TabsContent>

            <TabsContent value="reviews" className="pt-6">
              {product.reviews ? (
                <ul className="grid gap-4 sm:grid-cols-2">
                  {product.reviews.map((review) => (
                    <li
                      key={review.id}
                      className="rounded-xl border border-border bg-card p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm">
                          {review.author} &middot; {review.locality}
                        </span>
                        <Stars rating={review.rating} />
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {review.body}
                      </p>
                      {review.verified && (
                        <span className="mt-3 inline-flex items-center gap-1.5 text-xs text-sage">
                          <BadgeCheck className="size-3.5" aria-hidden />
                          Verified patron
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No reviews yet</p>
              )}
            </TabsContent>
          </Tabs>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="mx-auto w-full max-w-7xl px-6 pb-24">
            <SectionHeader
              title="You may also like"
              subline={`More from ${product.category.toLowerCase()}`}
            />
            <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <li key={item.id}>
                  <Link href={`/product/${item.id}`} className="block h-full">
                    <ProductCard product={item} />
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