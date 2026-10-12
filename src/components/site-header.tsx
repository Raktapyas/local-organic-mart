"use client";

import Link from "next/link";
import { Leaf, Search, ShoppingBag } from "lucide-react";

import { CartBadge } from "@/components/cart-badge";
import { LanguageToggle } from "@/components/language-toggle";
import { navLinks, siteName } from "@/lib/data";
import { useLang } from "@/lib/use-lang";

export function SiteHeader() {
  const { t } = useLang();

  return (
    <header className="sticky top-0 z-50 hidden border-b border-foreground/10 bg-background/70 backdrop-blur-xl backdrop-saturate-150 lg:block">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-6 px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-foreground transition-opacity hover:opacity-80"
        >
          <Leaf className="size-5 text-mint" aria-hidden />
          <span className="font-heading text-lg tracking-tight">
            {siteName}
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.labelKey ? t(link.labelKey) : link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <form action="/search" role="search" className="relative hidden xl:block">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              type="search"
              name="q"
              placeholder="Search the mart"
              aria-label="Search the mart"
              className="h-9 w-56 rounded-full border border-input bg-background/60 pl-9 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-mint focus-visible:ring-3 focus-visible:ring-ring/40"
            />
          </form>

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
        </div>
      </div>
    </header>
  );
}