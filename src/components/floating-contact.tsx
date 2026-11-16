"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, MessageCircle, Phone, X } from "lucide-react";

import { ViberIcon, WhatsAppIcon } from "@/components/brand-icons";
import {
  chatChannels,
  contactChannels,
  formatSupportNumber,
  whatsappNumber,
  type ChatChannelId,
} from "@/lib/data";
import { useLang } from "@/lib/use-lang";

/**
 * Per-channel artwork. The wash is the brand colour at low opacity so the
 * glyph reads as a mark rather than a coloured block, and both hexes are the
 * publishers' own — recolouring them would misrepresent the app.
 */
const CHANNEL_STYLE: Record<
  ChatChannelId,
  { Icon: typeof WhatsAppIcon; tint: string; wash: string }
> = {
  whatsapp: {
    Icon: WhatsAppIcon,
    tint: "text-[#25D366]",
    wash: "bg-[#25D366]/12",
  },
  viber: {
    Icon: ViberIcon,
    tint: "text-[#7360f2]",
    wash: "bg-[#7360f2]/12",
  },
};

/**
 * Floating WhatsApp / Viber widget.
 *
 * Collapsed it is a single mint button; a tap unfolds a short card with the
 * two channels and a call line. It lives at every breakpoint — the desktop
 * header has no chat affordance at all, so this is the only one — and on
 * mobile it sits clear of the fixed tab bar.
 *
 * Interaction choices:
 * - Click, not hover: hover panels are unreachable on touch and hostile to
 *   keyboard users. `aria-expanded` + `aria-controls` describe the panel.
 * - Closed panel stays mounted so it can animate, but is `aria-hidden`,
 *   `pointer-events-none` and out of the tab order, so it is not a trap.
 * - Escape closes and returns focus to the button; a pointer-down anywhere
 *   outside closes too.
 * - The two rows stagger 60ms apart on open. `motion-reduce` drops the
 *   transforms for anyone who has asked for less movement.
 */
export function FloatingContact() {
  const { lang, tr } = useLang();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (panelRef.current?.contains(target)) return;
      if (buttonRef.current?.contains(target)) return;
      setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div
      className="pointer-events-none fixed right-4 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-50 flex flex-col items-end gap-3 sm:right-6 lg:bottom-8"
      data-contact-widget
    >
      <div
        ref={panelRef}
        id="contact-widget-panel"
        aria-hidden={!open}
        className={`max-h-[calc(100dvh-9rem)] w-[min(20rem,calc(100vw-2rem))] origin-bottom-right overflow-y-auto overscroll-contain rounded-[2px] border border-foreground/12 bg-card/95 shadow-[0_28px_60px_-24px_rgba(0,0,0,0.92)] backdrop-blur-xl transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-3 scale-[0.96] opacity-0"
        }`}
      >
        <div className="border-b border-foreground/10 px-4 py-3.5">
          <p className="flex items-center gap-2 font-heading text-[14px] leading-none text-ivory">
            <span className="relative flex size-1.5 shrink-0">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-mint/60 motion-reduce:hidden" />
              <span className="relative inline-flex size-1.5 rounded-full bg-mint" />
            </span>
            {tr("Chat with us", "हामीसँग कुरा गर्नुहोस्")}
          </p>
          <p className="mt-1.5 pl-3.5 text-[10.5px] leading-snug text-ash">
            {tr(
              "Usually replies in minutes",
              "सामान्यतया केही मिनेटमै जवाफ",
            )}
          </p>
        </div>

        <div className="divide-y divide-foreground/[0.07]">
          {chatChannels.map((channel, index) => {
            const { Icon, tint, wash } = CHANNEL_STYLE[channel.id];

            return (
              <a
                key={channel.id}
                href={channel.href}
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
                aria-label={tr(
                  `Chat with us on ${channel.name}`,
                  `${channel.name} मा हामीसँग कुरा गर्नुहोस्`,
                )}
                className={`group flex items-center gap-3 px-4 py-3 transition-[background-color,opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-foreground/[0.04] motion-reduce:transition-none ${
                  open
                    ? "translate-y-0 opacity-100"
                    : "translate-y-1 opacity-0"
                }`}
                style={{ transitionDelay: open ? `${80 + index * 60}ms` : "0ms" }}
              >
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-[2px] ${wash}`}
                >
                  <Icon className={`size-[18px] ${tint}`} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[12px] font-medium text-ivory">
                    {channel.name}
                  </span>
                  <span className="tabular mt-0.5 block text-[10.5px] text-ash">
                    {channel.number}
                  </span>
                </span>
                <ArrowUpRight
                  className="size-3.5 shrink-0 text-ash/45 transition-[color,transform] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-mint"
                  aria-hidden
                />
              </a>
            );
          })}
        </div>

        <a
          href={contactChannels.call}
          onClick={() => setOpen(false)}
          tabIndex={open ? 0 : -1}
          className={`flex items-center justify-center gap-2 border-t border-foreground/10 px-4 py-2.5 text-[9.5px] text-ash transition-colors duration-200 hover:bg-foreground/[0.04] hover:text-mint ${
            lang === "ne" ? "tracking-[0.1em]" : "tracking-[0.18em] uppercase"
          }`}
        >
          <Phone className="size-3" aria-hidden />
          {tr("Call us", "हामीलाई फोन गर्नुहोस्")}
          <span className="tabular text-ash/60 normal-case tracking-normal">
            {formatSupportNumber(whatsappNumber)}
          </span>
        </a>
      </div>

      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="contact-widget-panel"
        aria-label={
          open
            ? tr("Close chat options", "च्याट विकल्प बन्द गर्नुहोस्")
            : tr("Chat with us", "हामीसँग कुरा गर्नुहोस्")
        }
        onClick={() => setOpen((value) => !value)}
        className="pointer-events-auto relative grid size-[3.25rem] place-items-center rounded-[2px] bg-primary text-primary-foreground shadow-[0_16px_36px_-16px_rgba(0,0,0,0.95)] transition-[transform,box-shadow,background-color] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_20px_44px_-18px_rgba(0,0,0,0.95),0_0_26px_-6px_rgba(143,227,176,0.5)] active:translate-y-0 active:scale-95 motion-reduce:transform-none"
      >
        <MessageCircle
          className={`absolute size-[22px] transition-[opacity,transform] duration-300 ${
            open ? "scale-50 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
          }`}
          aria-hidden
        />
        <X
          className={`absolute size-5 transition-[opacity,transform] duration-300 ${
            open
              ? "scale-100 rotate-0 opacity-100"
              : "scale-50 -rotate-90 opacity-0"
          }`}
          aria-hidden
        />
      </button>
    </div>
  );
}
