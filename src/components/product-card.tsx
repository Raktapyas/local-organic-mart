import Image from "next/image";
import { Heart, Plus } from "lucide-react";

import { AddToCartButton } from "@/components/add-to-cart-button";
import { PhotoFallback } from "@/components/photo-fallback";
import { Button } from "@/components/ui/button";
import { discountPercent, type Product } from "@/lib/data";

const npr = new Intl.NumberFormat("en-NP");

export function ProductCard({ product }: { product: Product }) {
  const off = discountPercent(product);
  const sold = product.outOfStock;

  return (
    <article
      className={
        sold
          ? "group flex flex-col overflow-hidden rounded-xl border border-border bg-card/60 opacity-60"
          : "group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-mint/35"
      }
    >
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        {product.image ? (
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, (min-width: 640px) 45vw, 92vw"
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
              In season: {product.season}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-3 p-4">
        <div>
          <span className="text-[10px] tracking-wider text-sage uppercase">
            {product.badge}
          </span>
          <h3 className="mt-0.5 font-heading text-base font-normal transition-colors group-hover:text-mint">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            {product.nepaliName} &middot; {product.unit}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-3">
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
      </div>
    </article>
  );
}