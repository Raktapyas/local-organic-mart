"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Leaf, Search, ShoppingBag, User, X } from "lucide-react";

import { CartBadge } from "@/components/cart-badge";
import { MegaMenu } from "@/components/mega-menu";
import { LanguageToggle } from "@/components/language-toggle";
import { navLinks } from "@/lib/data";
import { useLang } from "@/lib/use-lang";

/**
 * Desktop header.
 *
 * Layout note: the wordmark sits *in flow* at the left of the row. The old
 * version absolutely centred it, which meant any nav wider than half the
 * container ran underneath it — with "Membership" in the list, the brand and
 * the link overlapped at 1440px. Nothing here is positioned against the
 * container's centre, so that class of bug cannot recur: the row is a single
 * flex line and every child takes its own space.
 *
 * The two longest links fold away below 1280px rather than shrinking the type
 * into unreadability.
 *
 * The Mart dropdown owns its own state (`mega-menu.tsx`): hover opens it,
 * click toggles it for touch and keyboard, Escape closes it. Search is the
 * other piece that genuinely needs state, and it opens as a full-width drawer
 * under the bar so the row never reflows.
 *
 * Both dropdown surfaces are anchored to the `<header>` element, which is the
 * positioned box because the bar itself is static. That is what makes them
 * bleed edge to edge instead of stopping at the bar's `max-w` — the mega menu
 * used to leave 16px of page visible at 1440 and 256px at 1920.
 */
export function SiteHeader() {
  const { t, tr, isNe } = useLang();
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLFormElement>(null);
  const searchTriggerRef = useRef<HTMLButtonElement>(null);

  // Escape and an outside click dismiss the drawer; both keep focus on the
  // button that opened it rather than dropping it back to the document.
  useEffect(() => {
    if (!searchOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setSearchOpen(false);
      searchTriggerRef.current?.focus();
    }
    function onPointerDown(event: PointerEvent) {
      if (!searchRef.current?.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [searchOpen]);

  // Everything except Mart gets a plain link; Mart gets the dropdown.
  const plainLinks = navLinks.filter((link) => link.labelKey !== "nav.mart");
  const martLink = navLinks.find((link) => link.labelKey === "nav.mart")!;
  // The two longest links fold away below xl. Keyed by href rather than by
  // labelKey: one of those keys changed name once and the link silently
  // stopped hiding, which wrapped "Farm to Home" onto three lines inside a
  // fixed-height bar.
  const compactOnly = new Set(["/farmers", "/membership"]);

  return (
    <header className="sticky top-0 z-50 hidden border-b border-foreground/[0.07] bg-background/85 backdrop-blur-xl backdrop-saturate-150 lg:block">
      <div className="mx-auto flex h-[4.5rem] w-full max-w-[88rem] items-center gap-7 px-8">
        {/* Wordmark: crest + stacked lettering, in flow. */}
        <Link
          href="/"
          aria-label={tr("Local Organic Mart — home", "लोकल अर्गानिक मार्ट — गृहपृष्ठ")}
          className="group flex shrink-0 items-center gap-3"
        >
          <span className="relative grid size-9 shrink-0 rotate-45 place-items-center border border-gold/45 transition-colors duration-300 group-hover:border-gold/80">
            <Leaf
              className="-rotate-45 size-[15px] text-gold transition-transform duration-300 group-hover:scale-110"
              aria-hidden
            />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-heading text-[0.95rem] tracking-[0.13em] text-ivory uppercase">
              Local Organic Mart
            </span>
            <span className="mt-[0.3rem] text-[8.5px] tracking-[0.34em] text-gold/75 uppercase">
              {tr("Kathmandu Valley", "काठमाडौं उपत्यका")}
            </span>
          </span>
        </Link>

        {/* Primary navigation */}
        <nav
          aria-label={tr("Primary", "मुख्य नेभिगेसन")}
          className="flex items-center gap-6 xl:gap-7"
        >
          <MegaMenu martHref={martLink.href} />

          {plainLinks.map((link) => {
            const key = link.labelKey ?? link.href;
            return (
              <Link
                key={key}
                href={link.href}
                className={`group relative py-1 text-[10.5px] tracking-[0.2em] whitespace-nowrap text-ash uppercase transition-colors duration-200 hover:text-ivory ${
                  compactOnly.has(link.href) ? "hidden xl:inline-block" : ""
                }`}
              >
                {link.labelKey ? t(link.labelKey) : link.label}
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gold/70 transition-transform duration-300 group-hover:scale-x-100"
                />
              </Link>
            );
          })}
        </nav>

        {/* Utility cluster */}
        <div className="ml-auto flex items-center gap-1.5">
          <button
            ref={searchTriggerRef}
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label={tr("Open search", "खोज खोल्नुहोस्")}
            aria-expanded={searchOpen}
            aria-controls={searchOpen ? "site-search" : undefined}
            className="grid size-9 place-items-center border border-foreground/10 text-ash transition-colors duration-200 hover:border-gold/50 hover:text-gold"
          >
            <Search className="size-[15px]" aria-hidden />
          </button>

          <LanguageToggle />

          <span className="px-1.5 text-[10px] tracking-[0.18em] text-ash/80 uppercase">
            {isNe ? "रु" : "NPR"}
          </span>

          <Link
            href="/bag"
            aria-label={tr("Open basket", "झोला खोल्नुहोस्")}
            className="relative grid size-9 place-items-center border border-foreground/10 text-ash transition-colors duration-200 hover:border-gold/50 hover:text-gold"
          >
            <ShoppingBag className="size-[15px]" aria-hidden />
            <CartBadge />
          </Link>

          <Link
            href="/account"
            aria-label={tr("My Organic Home", "मेरो अर्गानिक घर")}
            className="grid size-9 place-items-center border border-foreground/10 text-ash transition-colors duration-200 hover:border-gold/50 hover:text-gold"
          >
            <User className="size-[15px]" aria-hidden />
          </Link>
        </div>
      </div>

      {/* Search drawer: full width under the bar, so opening it never reflows. */}
      {searchOpen ? (
        <div
          id="site-search"
          className="absolute inset-x-0 top-full border-y border-foreground/10 bg-background/97 backdrop-blur-xl"
        >
          <form
            ref={searchRef}
            action="/search"
            role="search"
            className="mx-auto flex w-full max-w-[88rem] items-center gap-4 px-8 py-5"
            onSubmit={() => setSearchOpen(false)}
          >
            <Search className="size-4 shrink-0 text-gold/70" aria-hidden />
            <input
              type="search"
              name="q"
              autoFocus
              aria-label={tr("Search the mart", "मार्टमा खोज्नुहोस्")}
              placeholder={tr(
                "Search the mart — produce, pantry, the kitchen",
                "मार्टमा खोज्नुहोस् — तरकारी, भण्डार, भान्सा",
              )}
              className="h-9 min-w-0 flex-1 bg-transparent font-heading text-lg text-ivory outline-none placeholder:text-ash/55"
            />
            <span className="hidden text-[9px] tracking-[0.24em] text-ash/60 uppercase sm:block">
              {tr("Press Enter", "Enter थिच्नुहोस्")}
            </span>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              aria-label={tr("Close search", "खोज बन्द गर्नुहोस्")}
              className="grid size-9 place-items-center border border-foreground/10 text-ash transition-colors hover:border-gold/50 hover:text-gold"
            >
              <X className="size-4" aria-hidden />
            </button>
          </form>
        </div>
      ) : null}
    </header>
  );
}
