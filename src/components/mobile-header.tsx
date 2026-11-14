"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Leaf, Menu, MessageCircle, Phone, ShoppingBag, X } from "lucide-react";

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
  "inline-flex size-9 items-center justify-center border border-foreground/10 text-ash transition-colors duration-200 hover:border-gold/50 hover:text-gold";

/**
 * Mobile-only header (below `lg`). The desktop header in `site-header.tsx`
 * is hidden at these widths, and carries its own copy of the same language
 * toggle.
 *
 * The bar keeps three things only: menu, wordmark, basket. Language and
 * currency live in the drawer, because a header with four micro-pills was
 * reading as a toolbar and squeezing the wordmark at 360px.
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
    <header className="sticky top-0 z-50 border-b border-foreground/[0.07] bg-background/90 backdrop-blur-xl lg:hidden">
      <div className="relative mx-auto flex h-14 w-full items-center justify-between gap-3 px-4">
        <Sheet>
          <SheetTrigger asChild>
            <button type="button" aria-label="Open menu" className={iconButton}>
              <Menu className="size-4" aria-hidden />
            </button>
          </SheetTrigger>

          <SheetContent
            side="left"
            showCloseButton={false}
            className="flex w-[86vw] max-w-sm flex-col gap-0 border-r border-foreground/10 bg-[#080d0a] p-0"
          >
            <SheetHeader className="border-b border-foreground/[0.08] p-6 pb-5">
              <SheetTitle className="flex items-center gap-3 text-left">
                <span className="relative grid size-8 rotate-45 place-items-center border border-gold/45">
                  <Leaf className="-rotate-45 size-3.5 text-gold" aria-hidden />
                </span>
                <span className="flex flex-col leading-none">
                  <span className="font-heading text-sm tracking-[0.12em] text-ivory uppercase">
                    {siteName}
                  </span>
                  <span className="mt-1 text-[8px] tracking-[0.3em] text-gold/70 uppercase">
                    Kathmandu Valley
                  </span>
                </span>
              </SheetTitle>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {/*
                The drawer's own close button used to float at top-right, where
                it sat on the wordmark at this width. It lives here instead, as
                a labelled control on the menu's own rule.
              */}
              <div className="flex items-center justify-between">
                <span className="eyebrow">Menu</span>
                <SheetClose asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 border border-foreground/10 px-2.5 py-1.5 text-[9px] tracking-[0.22em] text-ash uppercase transition-colors hover:border-gold/50 hover:text-gold"
                  >
                    Close
                    <X className="size-3" aria-hidden />
                  </button>
                </SheetClose>
              </div>
              <nav aria-label="Mobile primary" className="mt-4">
                <ul className="flex flex-col">
                  {navLinks.map((link, index) => (
                    <li
                      key={link.href}
                      className="border-b border-foreground/[0.07]"
                    >
                      <SheetClose asChild>
                        <Link
                          href={link.href}
                          className="group flex items-baseline gap-4 py-3.5"
                        >
                          <span className="tabular text-[9px] tracking-[0.2em] text-gold/50">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="font-heading text-xl leading-tight text-ivory transition-colors group-hover:text-gold">
                            {link.labelKey ? t(link.labelKey) : link.label}
                          </span>
                        </Link>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              </nav>

              <span className="eyebrow mt-8 block">Account</span>
              <ul className="mt-3 flex flex-col gap-3">
                <li>
                  <SheetClose asChild>
                    <Link
                      href="/account"
                      className="text-[13px] text-ash transition-colors hover:text-gold"
                    >
                      {t("nav.myHome")}
                    </Link>
                  </SheetClose>
                </li>
                <li>
                  <SheetClose asChild>
                    <Link
                      href="/track-order"
                      className="text-[13px] text-ash transition-colors hover:text-gold"
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
                    className="text-[13px] text-ash/40"
                  >
                    {t("nav.help")}
                  </span>
                </li>
              </ul>

              <div className="mt-8 flex items-center gap-3 border-t border-foreground/[0.08] pt-6">
                <LanguageToggle className="w-full justify-center py-2.5" />
                <span className="text-[10px] tracking-[0.18em] text-ash/70 uppercase">
                  NPR
                </span>
              </div>

              <div className="mt-6 text-xs text-ash">
                <a
                  href={contactChannels.call}
                  className="block transition-colors hover:text-gold"
                >
                  {contact.phone}
                </a>
                <p className="mt-1 text-ash/60">{contact.address}</p>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <Link
          href="/"
          aria-label={`${siteName} — home`}
          className="flex min-w-0 shrink items-center gap-2.5"
        >
          <span className="relative grid size-7 shrink-0 rotate-45 place-items-center border border-gold/45">
            <Leaf className="-rotate-45 size-3 text-gold" aria-hidden />
          </span>
          <span className="flex min-w-0 flex-col leading-none">
            <span className="truncate font-heading text-[11.5px] tracking-[0.12em] text-ivory uppercase">
              {siteName}
            </span>
            <span className="mt-1 text-[7px] tracking-[0.26em] text-gold/70 uppercase">
              Kathmandu Valley
            </span>
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-1.5">
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
              <div className="absolute right-0 z-50 mt-2 w-48 border border-foreground/10 bg-[#0b110d] p-1 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.9)]">
                <a
                  href={contactChannels.whatsapp}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-ash transition-colors hover:bg-foreground/5 hover:text-ivory"
                >
                  <MessageCircle className="size-3.5 text-[#25D366]" aria-hidden />
                  WhatsApp
                </a>
                <a
                  href={contactChannels.viber}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-ash transition-colors hover:bg-foreground/5 hover:text-ivory"
                >
                  <MessageCircle className="size-3.5 text-[#7360f2]" aria-hidden />
                  Viber
                </a>
                <a
                  href={contactChannels.call}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-ash transition-colors hover:bg-foreground/5 hover:text-ivory"
                >
                  <Phone className="size-3.5 text-gold/70" aria-hidden />
                  Call us
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
