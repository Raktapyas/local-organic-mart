"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Leaf,
  Menu,
  MessageCircle,
  Phone,
  ShoppingBag,
} from "lucide-react";

import { CartBadge } from "@/components/cart-badge";
import { LanguageToggle } from "@/components/language-toggle";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { contact, contactChannels, navLinks, siteName } from "@/lib/data";
import { useLang } from "@/lib/use-lang";

const iconButton =
  "inline-flex size-9 items-center justify-center rounded-full border border-foreground/10 transition-colors hover:border-mint/40 hover:text-mint";

/**
 * Mobile-only header (below `lg`). The desktop header in `site-header.tsx`
 * is untouched apart from being hidden at these widths, and carries its own
 * copy of the same language toggle.
 *
 * TODO: real notifications + chat API — the popover only deep-links out to
 * the messaging apps; nothing is fetched or stored.
 */
export function MobileHeader() {
  const { t } = useLang();
  const [chatOpen, setChatOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // A popover that ignores Escape and outside clicks is a popover users
  // can't escape. Close on both, plus clean up the listeners on unmount.
  useEffect(() => {
    if (!chatOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setChatOpen(false);
    }
    function onPointerDown(event: PointerEvent) {
      if (!popoverRef.current?.contains(event.target as Node)) {
        setChatOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [chatOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background/70 backdrop-blur-xl backdrop-saturate-150 lg:hidden">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4">
        <Sheet>
          <SheetTrigger asChild>
            <button type="button" aria-label="Open menu" className={iconButton}>
              <Menu className="size-4" aria-hidden />
            </button>
          </SheetTrigger>

          <SheetContent side="left" className="flex w-80 flex-col gap-0 p-0">
            <SheetHeader className="border-b border-foreground/10 p-6 pb-4">
              <SheetTitle className="font-heading text-lg">
                {siteName}
              </SheetTitle>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto p-6">
              <nav aria-label="Mobile primary">
                <ul className="flex flex-col">
                  {navLinks.map((link) => (
                    <li key={link.href} className="border-b border-foreground/5">
                      <SheetClose asChild>
                        <Link
                          href={link.href}
                          className="block py-3 text-sm transition-colors hover:text-mint"
                        >
                          {link.labelKey ? t(link.labelKey) : link.label}
                        </Link>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              </nav>

              <ul className="mt-8 flex flex-col gap-3">
                <li>
                  <SheetClose asChild>
                    <Link
                      href="/account"
                      className="block text-sm transition-colors hover:text-mint"
                    >
                      {t("nav.myHome")}
                    </Link>
                  </SheetClose>
                </li>
                <li>
                  <SheetClose asChild>
                    <Link
                      href="/track-order"
                      className="block text-sm transition-colors hover:text-mint"
                    >
                      {t("nav.trackOrder")}
                    </Link>
                  </SheetClose>
                </li>
                <li>
                  {/*
                    /support is specced in design/MAP.md but not built yet.
                    Rendered inert rather than linked — a drawer full of
                    working links is worth more than one that 404s.
                  */}
                  <span
                    aria-disabled="true"
                    className="block text-sm text-muted-foreground/50"
                  >
                    {t("nav.help")}
                  </span>
                </li>
              </ul>

              <div className="mt-8 flex items-center gap-2">
                <LanguageToggle className="w-full justify-center py-2.5" />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                NPR
              </p>

              <div className="mt-8 border-t border-foreground/10 pt-6 text-xs text-muted-foreground">
                <a
                  href={contactChannels.call}
                  className="block transition-colors hover:text-mint"
                >
                  {contact.phone}
                </a>
                <p className="mt-1">{contact.address}</p>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <Link
          href="/"
          className="flex min-w-0 shrink items-center gap-1.5 text-foreground transition-opacity hover:opacity-80"
        >
          <Leaf className="size-4 shrink-0 text-mint sm:size-5" aria-hidden />
          <span className="truncate font-heading text-[15px] tracking-tight sm:text-lg">
            {siteName}
          </span>
        </Link>

        {/* Compact reference pills; the drawer keeps the full-size rows. */}
        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          <LanguageToggle className="px-2 py-1 text-[10px]" />
          <span className="rounded-full border border-foreground/10 px-2 py-1 text-[10px] text-muted-foreground">
            NPR
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative" ref={popoverRef}>
            <button
              type="button"
              aria-label="Chat with us"
              aria-expanded={chatOpen}
              className={iconButton}
              onClick={() => setChatOpen((open) => !open)}
            >
              <MessageCircle className="size-4" aria-hidden />
            </button>

            {chatOpen ? (
              <div className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-foreground/10 bg-card p-1 shadow-xl">
                <a
                  href={contactChannels.whatsapp}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-foreground/5"
                >
                  <MessageCircle className="size-4 text-mint" aria-hidden />
                  WhatsApp
                </a>
                <a
                  href={contactChannels.viber}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-foreground/5"
                >
                  <MessageCircle className="size-4 text-[#7360f2]" aria-hidden />
                  Viber
                </a>
                <a
                  href={contactChannels.call}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-foreground/5"
                >
                  <Phone className="size-4 text-sage" aria-hidden />
                  Call {contact.phone}
                </a>
              </div>
            ) : null}
          </div>

          <Link
            href="/bag"
            aria-label="Open basket"
            className={`${iconButton} relative`}
          >
            <ShoppingBag className="size-4" aria-hidden />
            <CartBadge />
          </Link>
        </div>
      </div>
    </header>
  );
}
