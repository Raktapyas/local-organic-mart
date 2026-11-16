"use client";

import { Languages } from "lucide-react";

import { useLang } from "@/lib/use-lang";

/**
 * EN / नेपाली switch.
 *
 * The button shows the *other* language, so it reads as "switch to Nepali"
 * while you are in English — the same convention as a globe button in most
 * apps. `aria-label` spells the destination out for screen readers, which
 * would otherwise only hear "नेपाली" with no indication of what it does.
 */
export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, toggle } = useLang();
  const other = lang === "en" ? "ne" : "en";
  const otherLabel = lang === "en" ? "नेपाली" : "English";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        lang === "en" ? "Switch to Nepali" : "अंग्रेजीमा बदल्नुहोस्"
      }
      lang={other}
      className={`inline-flex items-center gap-1.5 border border-foreground/10 px-2.5 py-1.5 text-[9.5px] tracking-[0.16em] text-ash uppercase transition-colors duration-200 hover:border-gold/50 hover:text-gold ${className}`}
    >
      <Languages className="size-3.5" aria-hidden />
      {otherLabel}
    </button>
  );
}
