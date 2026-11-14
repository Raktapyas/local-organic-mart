"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Plus } from "lucide-react";

import { categoryIcons } from "@/components/category-icons";
import { useCartStore } from "@/lib/cart-store";
import {
  categories,
  dishes,
  farmerBandImage,
  products,
  type Dish,
  type Product,
} from "@/lib/data";
import { useLang } from "@/lib/use-lang";

const npr = new Intl.NumberFormat("en-NP");

/** The brief's two featured picks. One is a product, one is a dish. */
type Featured = { kind: "product"; item: Product } | { kind: "dish"; item: Dish };

const FEATURED_IDS = { honey: "wild-honey", dalBhat: "dal-bhat-set" };

/**
 * Full-width mega menu behind "Mart ▾".
 *
 * Controlled state rather than pure CSS hover, because three of the four
 * columns need behaviour: Escape has to close it, and it has to close on a
 * route change or it stays pinned open over the page you just navigated to.
 *
 * Hover opens it and hover keeps it open; click toggles, which is what makes
 * it reachable by keyboard and by touch.
 *
 * Interaction notes, each one a bug this used to have:
 *
 * - The trigger wrapper spans the full height of the bar. The panel starts
 *   exactly where the wrapper ends, so there is no dead band to cross on the
 *   way down from the word to the menu — crossing one closed the menu on the
 *   pointer's way into it.
 * - `pointerleave` checks `relatedTarget` before closing, so a leave/enter pair
 *   between the trigger and the panel never counts as leaving.
 * - A click on a trigger the pointer is already hovering does not toggle. Hover
 *   had already opened it, so the click used to read as "close" and shut the
 *   menu the user was pointing at. Touch and keyboard have no hover, so click
 *   still toggles for them.
 * - Escape restores focus to the trigger; without that the panel unmounts
 *   under the focused link and focus falls back to the document.
 *
 * Layout note: the wrapper is intentionally *not* positioned. That lets the
 * panel anchor to the header element itself, so it bleeds edge to edge like the
 * search drawer instead of stopping at the `max-w` of the bar.
 */
export function MegaMenu({ martHref }: { martHref: string }) {
  const { t } = useLang();
  const addItem = useCartStore((state) => state.addItem);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  // True while a mouse pointer is inside the trigger or the panel.
  const hovering = useRef(false);

  const close = useCallback(() => setOpen(false), []);

  // Escape closes, as does any navigation.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      close();
      triggerRef.current?.focus();
    }

    // Touch has no hover, so a tap elsewhere has to be able to dismiss it.
    function onPointerDown(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) close();
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    // The panel hangs off a sticky bar, so a scroll would drag it down over the
    // page content. Dismiss instead.
    window.addEventListener("scroll", close, { passive: true });
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", close);
    };
  }, [open, close]);

  /*
    Closing is driven by click rather than by watching the pathname. A
    `usePathname()` here would force the header out of the prerendered shell
    for every route (with `cacheComponents`), and wrapping it in Suspense to
    cope would drop the header in for a frame on every page load — a layout
    shift on the one element that appears on all of them.
  */

  const honey = products.find((p) => p.id === FEATURED_IDS.honey);
  const dalBhat = dishes.find((d) => d.id === FEATURED_IDS.dalBhat);
  const featured: Featured[] = [
    ...(honey ? [{ kind: "product" as const, item: honey }] : []),
    ...(dalBhat ? [{ kind: "dish" as const, item: dalBhat }] : []),
  ];

  const shopByNeed = [
    { label: "Weekly essentials", href: "/#weekly" },
    { label: "Baskets & gifts", href: "/baskets" },
    { label: "Subscription plans", href: "/baskets#subscriptions" },
    { label: "Bestsellers", href: "/mart" },
    { label: "Track order", href: "/track-order" },
  ];

  return (
    <div
      ref={wrapperRef}
      className="flex h-[4.5rem] items-center"
      onPointerEnter={(event) => {
        if (event.pointerType !== "mouse") return;
        hovering.current = true;
        setOpen(true);
      }}
      onPointerLeave={(event) => {
        hovering.current = false;
        // Moving into the panel fires leave/enter in the same task; the panel
        // is a descendant, so treat that as still being inside.
        const next = event.relatedTarget as Node | null;
        if (next && event.currentTarget.contains(next)) return;
        close();
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          // Hover already opened it — a click here would only close it again.
          if (hovering.current) return;
          setOpen((value) => !value);
        }}
        aria-expanded={open}
        aria-controls={open ? "mega-menu" : undefined}
        className="group relative flex items-center gap-1.5 py-1 text-[10.5px] tracking-[0.2em] text-ash uppercase transition-colors duration-200 hover:text-ivory"
      >
        {t("nav.mart")}
        <ChevronDown
          className={`size-3 transition-transform duration-200 ${
            open ? "rotate-180 text-gold" : ""
          }`}
          aria-hidden
        />
        <span
          aria-hidden
          className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-gold/70 transition-transform duration-300 ${
            open ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
          }`}
        />
      </button>

      {open ? (
        <div
          id="mega-menu"
          className="absolute inset-x-0 top-full z-40 -mt-px animate-in border-y border-foreground/10 bg-[#080d0a] shadow-[0_32px_70px_-30px_rgba(0,0,0,0.95)] duration-200 fade-in-0 slide-in-from-top-1"
        >
          <div className="mx-auto grid w-full max-w-[88rem] grid-cols-[1.6fr_1fr_1.2fr] gap-8 px-8 py-8 xl:grid-cols-[1.1fr_0.9fr_1.15fr_1fr] xl:gap-10 xl:py-10">
            {/* 1. Categories */}
            <nav aria-label="Shop by category" onClick={close}>
              <h2 className="text-[9px] tracking-[0.24em] text-gold/80 uppercase">
                Shop by category
              </h2>
              <ul className="mt-5 grid grid-cols-2 gap-x-5 gap-y-1">
                {categories.map((category) => {
                  const Icon = categoryIcons[category.icon];
                  return (
                    <li key={category.id}>
                      <Link
                        href={category.href}
                        className="group/link flex items-center gap-2 border-b border-transparent py-1.5 text-[13px] text-ash transition-colors hover:border-foreground/10 hover:text-ivory"
                      >
                        <Icon
                          className="size-3.5 shrink-0 text-gold/60 transition-colors group-hover/link:text-gold"
                          aria-hidden
                        />
                        {category.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* 2. By need */}
            <nav aria-label="Shop by need" onClick={close}>
              <h2 className="text-[9px] tracking-[0.24em] text-gold/80 uppercase">
                Shop by need
              </h2>
              <ul className="mt-5 flex flex-col">
                {shopByNeed.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="block border-b border-foreground/[0.06] py-2.5 text-[13px] text-ash transition-colors hover:text-ivory"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* 3. Featured — a real product and a real dish */}
            <section aria-label="Featured">
              <h2 className="text-[9px] tracking-[0.24em] text-gold/80 uppercase">
                Featured
              </h2>
              <ul className="mt-5 flex flex-col gap-2">
                {featured.map((entry) => (
                  <li
                    key={entry.item.id}
                    className="flex items-center gap-3 border border-foreground/[0.08] p-2.5"
                  >
                    <div className="relative size-12 shrink-0 overflow-hidden bg-muted">
                      <Image
                        src={entry.item.image ?? "/images/category-local.jpg"}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-heading text-[13px] text-ivory">
                        {entry.item.name}
                      </p>
                      <p className="tabular text-[11px] text-gold/80">
                        Rs {npr.format(entry.item.price)}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label={`Add ${entry.item.name} to basket`}
                      onClick={() =>
                        addItem(
                          entry.kind === "product"
                            ? {
                                kind: "product",
                                refId: entry.item.id,
                                slug: entry.item.id,
                                name: entry.item.name,
                                nepaliName: entry.item.nepaliName,
                                unit: entry.item.unit,
                                unitPrice: entry.item.price,
                                qty: 1,
                                image: entry.item.image,
                              }
                            : {
                                kind: "dish",
                                refId: entry.item.id,
                                slug: entry.item.id,
                                name: entry.item.name,
                                nepaliName: entry.item.nepaliName,
                                unit: entry.item.portions[0].serves,
                                unitPrice: entry.item.price,
                                qty: 1,
                                image: entry.item.image,
                              },
                        )
                      }
                      className="inline-flex size-7 shrink-0 items-center justify-center border border-gold/30 text-gold transition-colors duration-200 hover:border-gold hover:bg-gold hover:text-ink"
                    >
                      <Plus className="size-3.5" aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            {/* 4. Promo tile */}
            <Link
              onClick={close}
              href="/farmers"
              className="group relative hidden min-h-[13rem] flex-col justify-end overflow-hidden p-5 xl:flex"
            >
              <Image
                src={farmerBandImage}
                alt=""
                fill
                sizes="25vw"
                className="object-cover opacity-80 transition-all duration-700 group-hover:scale-[1.04] group-hover:opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              <div className="relative border-t border-gold/30 pt-3">
                <span className="eyebrow">Provenance</span>
                <p className="mt-1.5 font-heading text-lg leading-tight text-ivory">
                  Farm to Home
                </p>
                <p className="mt-1 text-[11px] text-ash">
                  Three collectives, one cold chain.
                </p>
              </div>
            </Link>
          </div>

          {/* Keyboard users land here; the panel itself is not a link target. */}
          <Link href={martHref} className="sr-only">
            All Mart departments
          </Link>
        </div>
      ) : null}
    </div>
  );
}
