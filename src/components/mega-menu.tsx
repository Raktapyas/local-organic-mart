"use client";

import { useCallback, useEffect, useState } from "react";
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
 */
export function MegaMenu({ martHref }: { martHref: string }) {
  const { t } = useLang();
  const addItem = useCartStore((state) => state.addItem);
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  // Escape closes, as does any navigation.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
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
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={close}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mega-menu"
        className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        {t("nav.mart")}
        <ChevronDown
          className={`size-3.5 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          id="mega-menu"
          className="fixed inset-x-0 top-16 z-40 border-b border-foreground/10 bg-card/95 backdrop-blur-xl"
        >
          <div className="mx-auto grid w-full max-w-7xl grid-cols-4 gap-8 px-6 py-8">
            {/* 1. Categories */}
            <nav aria-label="Shop by category" onClick={close}>
              <h2 className="text-xs tracking-wider text-sage uppercase">
                Shop by category
              </h2>
              <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1">
                {categories.map((category) => {
                  const Icon = categoryIcons[category.icon];
                  return (
                    <li key={category.id}>
                      <Link
                        href={category.href}
                        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-foreground/5"
                      >
                        <Icon className="size-3.5 shrink-0 text-mint" aria-hidden />
                        {category.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* 2. By need */}
            <nav aria-label="Shop by need" onClick={close}>
              <h2 className="text-xs tracking-wider text-sage uppercase">
                Shop by need
              </h2>
              <ul className="mt-4 flex flex-col gap-1">
                {shopByNeed.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="block rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-foreground/5"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* 3. Featured — a real product and a real dish */}
            <section aria-label="Featured">
              <h2 className="text-xs tracking-wider text-sage uppercase">
                Featured
              </h2>
              <ul className="mt-4 flex flex-col gap-3">
                {featured.map((entry) => (
                  <li
                    key={entry.item.id}
                    className="flex items-center gap-3 rounded-lg border border-foreground/10 p-2"
                  >
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={entry.item.image ?? "/images/category-local.jpg"}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs text-foreground">
                        {entry.item.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
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
                      className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-mint text-primary-foreground transition-opacity hover:opacity-90"
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
              className="group relative flex flex-col justify-end overflow-hidden rounded-xl p-5"
            >
              <Image
                src={farmerBandImage}
                alt=""
                fill
                sizes="25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              <div className="relative">
                <p className="font-heading text-lg">Farm to Home</p>
                <p className="mt-1 text-xs text-sage">
                  Three collectives, one cold chain.
                </p>
                <span className="mt-3 inline-flex rounded-full border border-foreground/30 px-4 py-1.5 text-xs">
                  Meet the farmers
                </span>
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
