import Image from "next/image";
import { Heart, Plus } from "lucide-react";

import { T } from "@/components/translated";

import { AddToCartButton } from "@/components/add-to-cart-button";
import { PhotoFallback } from "@/components/photo-fallback";
import { Button } from "@/components/ui/button";
import { discountPercent, memberPrice, type Product } from "@/lib/data";

const npr = new Intl.NumberFormat("en-NP");

export function ProductCard({ product }: { product: Product }) {
  const off = discountPercent(product);
  const sold = product.outOfStock;
  const member = memberPrice(product);

  return (
    <article
      className={
        sold
          ? "group flex flex-col overflow-hidden rounded-xl border border-border bg-card/60 opacity-60"
          : "group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-mint/35"
      }
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-t-xl bg-muted">
        {product.image ? (
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 18vw, (min-width: 768px) 30vw, (min-width: 640px) 45vw, 46vw"
          className={
            sold
              ? "object-cover grayscale"
              : "object-cover transition-transform duration-500 group-hover:scale-105"
          }
        />
        ) : (
          <PhotoFallback label={product.category} className="absolute inset-0" />
        )}

        {sold ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 p-3">
            <span className="rounded-full border border-destructive/30 bg-background/90 px-3 py-1.5 text-[11px] font-semibold tracking-wider text-destructive uppercase">
              {product.soldOutNote ?? "Sold out"}
            </span>
          </div>
        ) : (
          <button
            type="button"
            aria-label={`Save ${product.name}`}
            className="absolute top-3 right-3 inline-flex size-7 items-center justify-center rounded-full bg-background/70 text-muted-foreground backdrop-blur-sm transition-colors hover:text-coral"
          >
            <Heart className="size-4" aria-hidden />
          </button>
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {off !== null && (
            <span className="rounded-full bg-coral/12 px-2 py-0.5 text-[11px] font-medium text-coral">
              &minus;{off}%
            </span>
          )}
          {product.season && (
            <span className="rounded-full border border-border bg-background/80 px-2 py-0.5 text-[11px] text-muted-foreground backdrop-blur-sm">
              <T k="badges.inSeason" />: {product.season}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-2 p-3">
        <div>
          <span className="block text-[10px] leading-tight tracking-wider text-sage uppercase">
            {product.badge}
          </span>
          <h3 className="mt-1 font-heading text-sm leading-tight font-normal transition-colors group-hover:text-mint">
            {product.name}
          </h3>
          <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">
            {product.nepaliName} &middot; {product.unit}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between border-t border-border pt-2">
            <span className="flex items-baseline gap-1.5">
              <span className="text-sm font-semibold">
                Rs {npr.format(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  Rs {npr.format(product.oldPrice)}
                </span>
              )}
            </span>

          {sold ? (
            <Button size="sm" variant="outline" className="rounded-full">
              Notify me
            </Button>
          ) : (
            <AddToCartButton
              className="size-8 shrink-0 rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90"
              line={{
                kind: "product",
                refId: product.id,
                slug: product.id,
                name: product.name,
                nepaliName: product.nepaliName,
                unit: product.unit,
                unitPrice: product.price,
                qty: 1,
                image: product.image,
              }}
            >
              <Plus className="size-4" aria-hidden />
            </AddToCartButton>
          )}
          </div>

          {/*
            The member row is the point of showing membership on a product
            card: 10% off the price already on screen, on the products the
            membership page actually covers. Quiet gold, one line, no badge.
          */}
          {member !== null ? (
            <p className="mt-1 text-[11px] leading-tight text-gold">
              Members Rs {npr.format(member)}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}