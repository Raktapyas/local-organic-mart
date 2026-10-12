"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Leaf,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";

import { CartBadge } from "@/components/cart-badge";
import { LanguageToggle } from "@/components/language-toggle";
import { categories, navLinks } from "@/lib/data";
import { useLang } from "@/lib/use-lang";

/**
 * Desktop header. Mobile keeps its own header in `mobile-header.tsx`.
 *
 * The wordmark is absolutely centred rather than sitting in the flex row, so
 * the left nav growing or shrinking cannot shove the logo off-centre — the
 * Fish Society pattern this layout follows.
 *
 * The Mart dropdown is CSS-driven (`group-hover` plus `focus-within`), so it
 * opens on keyboard focus as well as hover with no JS state and no extra
 * client work. The search field is the one piece that genuinely needs state.
 */
export function SiteHeader() {
  const { t } = useLang();
  const [searchOpen, setSearchOpen] = useState(false);

  // Everything except Mart gets a plain link; Mart gets the dropdown.
  const plainLinks = navLinks.filter((link) => link.labelKey !== "nav.mart");
  const martLink = navLinks.find((link) => link.labelKey === "nav.mart")!;

  return (
    <header className="sticky top-0 z-50 hidden border-b border-foreground/10 bg-background/70 backdrop-blur-xl backdrop-saturate-150 lg:block">
      <div className="relative mx-auto flex h-16 w-full max-w-7xl items-center gap-6 px-6">
        {/* Left nav */}
        <nav aria-label="Primary" className="flex items-center gap-5">
          <div className="group relative">
            <Link
              href={martLink.href}
              className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground"
            >
              {martLink.labelKey ? t(martLink.labelKey) : martLink.label}
              <ChevronDown
                className="size-3.5 transition-transform duration-200 group-hover:rotate-180"
                aria-hidden
              />
            </Link>

            <div className="invisible absolute left-0 top-full z-50 pt-4 opacity-0 transition-[opacity,visibility] duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <div className="w-[34rem] rounded-xl border border-foreground/10 bg-card p-5 shadow-2xl">
                <ul className="grid grid-cols-2 gap-x-6 gap-y-1">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={category.href}
                        className="flex flex-col rounded-lg px-3 py-2 transition-colors hover:bg-foreground/5"
                      >
                        <span className="text-sm text-foreground">
                          {category.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {category.note}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {plainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.labelKey ? t(link.labelKey) : link.label}
            </Link>
          ))}
        </nav>

        {/* Centre wordmark, independent of the flex row either side. */}
        <Link
          href="/"
          aria-label="Local Organic Mart — home"
          className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 text-foreground transition-opacity hover:opacity-80"
        >
          <Leaf className="size-5 text-mint" aria-hidden />
          <span className="font-heading text-lg tracking-tight">
            Local Organic Mart
          </span>
        </Link>

        {/* Right cluster */}
        <div className="ml-auto flex items-center gap-2">
          {searchOpen ? (
            <form
              action="/search"
              role="search"
              className="flex items-center gap-2"
            >
              <Search
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden
              />
              <input
                type="search"
                name="q"
                autoFocus
                aria-label="Search the mart"
                placeholder="Search the mart"
                className="h-9 w-56 rounded-full border border-input bg-background/60 px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-mint"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className="inline-flex size-9 items-center justify-center rounded-full border border-foreground/10 transition-colors hover:text-mint"
              >
                <X className="size-4" aria-hidden />
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
              aria-expanded={searchOpen}
              className="inline-flex size-9 items-center justify-center rounded-full border border-foreground/10 transition-colors hover:border-mint/40 hover:text-mint"
            >
              <Search className="size-4" aria-hidden />
            </button>
          )}

          <LanguageToggle />

          <span className="rounded-full border border-foreground/10 px-3 py-1.5 text-xs text-muted-foreground">
            NPR
          </span>

          <Link
            href="/bag"
            aria-label="Open basket"
            className="relative inline-flex size-9 items-center justify-center rounded-full border border-foreground/10 transition-colors hover:border-mint/40 hover:text-mint"
          >
            <ShoppingBag className="size-4" aria-hidden />
            <CartBadge />
          </Link>

          <Link
            href="/account"
            aria-label="My Organic Home"
            className="inline-flex size-9 items-center justify-center rounded-full border border-foreground/10 transition-colors hover:border-mint/40 hover:text-mint"
          >
            <User className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </header>
  );
}
