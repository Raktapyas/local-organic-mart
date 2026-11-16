"use client";

import { MessageCircle, Phone } from "lucide-react";

import { contactChannels } from "@/lib/data";
import { useLang } from "@/lib/use-lang";

/**
 * Floating contact buttons.
 *
 * Desktop is untouched by this — the whole element is `lg:hidden`. On mobile
 * it sits clear of the bottom tab bar (which is 4rem tall plus the home
 * indicator), so the two never overlap.
 *
 * The brand colours live on the glyph only. Two saturated circles floating
 * over the page were the loudest thing on the screen; an ink square with a
 * hairline edge still reads instantly, and stops competing with the type.
 */
export function FloatingContact() {
  const { tr } = useLang();

  return (
    <div
      className="fixed right-4 z-40 flex flex-col gap-2 lg:hidden"
      style={{ bottom: "calc(4.5rem + env(safe-area-inset-bottom))" }}
    >
      <a
        href={contactChannels.viber}
        aria-label={tr("Chat with us on Viber", "Viber मा हामीसँग कुरा गर्नुहोस्")}
        className="flex size-11 items-center justify-center border border-foreground/15 bg-background/90 backdrop-blur-sm transition-colors active:border-gold/50"
      >
        <MessageCircle className="size-[18px] text-[#7360f2]" aria-hidden />
      </a>
      <a
        href={contactChannels.whatsapp}
        aria-label={tr("Chat with us on WhatsApp", "WhatsApp मा हामीसँग कुरा गर्नुहोस्")}
        className="flex size-11 items-center justify-center border border-foreground/15 bg-background/90 backdrop-blur-sm transition-colors active:border-gold/50"
      >
        <Phone className="size-[18px] text-[#25D366]" aria-hidden />
      </a>
    </div>
  );
}
