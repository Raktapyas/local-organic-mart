import Image from "next/image";
import { Heart, Plus } from "lucide-react";

import { AddToCartButton } from "@/components/add-to-cart-button";
import { PhotoFallback } from "@/components/photo-fallback";
import { Button } from "@/components/ui/button";
import { discountPercent, memberPrice, type Product } from "@/lib/data";

const npr = new Intl.NumberFormat("en-NP");

/**
 * Product card.
 *
 * Square edges, a portrait plate, and the name set in the display serif. The
 * old card was a rounded tile with three pill badges competing for attention;
 * here the only colour is a gold price and a single discount rule, so a rail of
 * five cards reads as a catalogue rather than a feed.
 */
export function ProductCard({ product }: { product: Product }) {
  const off = discountPercent(product);
  const sold = product.outOfStock;
  const member = memberPrice(product);

  return (
    <article
      className={`group relative flex h-full flex-col border border-foreground/[0.08] bg-card/40 transition-colors duration-300 ${
        sold ? "opacity-55" : "hover:border-gold/30"
      }`}
    >
      <div className="relative aspect-4/5 w-full overflow-hidden bg-muted">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1280px) 18vw, (min-width: 768px) 30vw, (min-width: 640px) 45vw, 46vw"
            className={
              sold
                ? "object-cover grayscale"
                : "object-cover opacity-90 transition-all duration-700 group-hover:scale-[1.04] group-hover:opacity-100"
            }
          />
        ) : (
          <PhotoFallback label={product.category} className="absolute inset-0" />
        )}

        {/* A single gold hairline at the top of the plate on hover. */}
        {!sold ? (
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gold/70 transition-transform duration-500 group-hover:scale-x-100"
          />
        ) : null}

        {sold ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 p-3">
            <span className="border border-foreground/20 bg-background/90 px-3 py-1.5 text-[10px] tracking-[0.2em] text-ash uppercase">
              {product.soldOutNote ?? "Sold out"}
            </span>
          </div>
        ) : (
          <button
            type="button"
            aria-label={`Save ${product.name}`}
            className="absolute top-3 right-3 grid size-7 place-items-center border border-ivory/10 bg-background/60 text-ash/70 backdrop-blur-sm transition-colors duration-200 hover:border-gold/40 hover:text-gold"
          >
            <Heart className="size-3.5" aria-hidden />
          </button>
        )}

        <div className="absolute top-3 left-3 flex flex-col items-start gap-1">
          {off !== null && (
            <span className="bg-gold px-1.5 py-0.5 text-[9px] font-medium tracking-[0.16em] text-ink uppercase">
              &minus;{off}%
            </span>
          )}
          {product.season && (
            <span className="border border-ivory/10 bg-background/75 px-1.5 py-0.5 text-[9px] tracking-[0.14em] text-ash uppercase backdrop-blur-sm">
              {product.season}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-3 p-3.5">
        <div>
          <span className="block text-[9px] leading-tight tracking-[0.2em] text-gold/70 uppercase">
            {product.badge}
          </span>
          <h3 className="mt-1.5 font-heading text-[0.95rem] leading-tight text-ivory">
            {product.name}
          </h3>
          <p className="mt-1 text-[10.5px] leading-tight text-ash/70">
            {product.nepaliName} &middot; {product.unit}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between gap-2 border-t border-foreground/[0.08] pt-2.5">
            <span className="tabular flex items-baseline gap-1.5 text-[0.8rem] text-ivory">
              Rs {npr.format(product.price)}
              {product.oldPrice && (
                <span className="text-[10.5px] text-ash/45 line-through">
                  {npr.format(product.oldPrice)}
                </span>
              )}
            </span>

            {sold ? (
              <Button
                size="sm"
                variant="outline"
                className="h-7 rounded-none px-2.5 text-[10px] tracking-[0.12em] uppercase"
              >
                Notify
              </Button>
            ) : (
              <AddToCartButton
                className="size-[30px] shrink-0 rounded-none bg-gold text-ink transition-opacity duration-200 hover:opacity-85"
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

            The row reserves its height on every card, even when there is no
            member price. Without that, the one card that has it grew taller
            and pushed its price line out of alignment with the rest of the
            rail — which is exactly the kind of small misregistration that
            makes a grid look assembled rather than composed.
          */}
          <p className="tabular mt-1.5 min-h-[13px] text-[10px] leading-tight text-gold/80">
            {member !== null ? `Members ${npr.format(member)}` : ""}
          </p>
        </div>
      </div>
    </article>
  );
}
