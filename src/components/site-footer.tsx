"use client";

import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { BrandLogo } from "@/components/brand-logo";

import {
  categories,
  contact,
  footerColumns,
  paymentMethods,
  siteName,
} from "@/lib/data";
import { categoryText, paymentMethodLabel } from "@/lib/i18n/localize";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { useLang } from "@/lib/use-lang";

/** Footer links that are not categories, in Nepali. */
const LINK_NE: Record<string, string> = {
  "/farmers": "खेतबाट घर",
  "/about": "हाम्रो कथा",
  "/membership": "सदस्यता",
  "/track-order": "अर्डर ट्र्याक",
  "/delivery-zones": "डेलिभरी क्षेत्र",
  "/refund-policy": "फिर्ता नीति",
  "/privacy-policy": "गोपनीयता नीति",
};

export function SiteFooter() {
  const { t, tr, lang } = useLang();

  const linkLabel = (link: { label: string; href: string }) => {
    const category = categories.find((item) => item.href === link.href);
    if (category) return categoryText(category, lang).name;
    return lang === "ne" ? (LINK_NE[link.href] ?? link.label) : link.label;
  };

  return (
    <footer className="border-t border-foreground/[0.08] bg-[#08130c]">
      <div className="mx-auto w-full max-w-[88rem] px-6 lg:px-10">
        {/* Newsletter band */}
        <div className="border-b border-foreground/[0.08] py-12 lg:py-14">
          <NewsletterSignup />
        </div>

        {/* Masthead + link columns */}
        <div className="grid gap-12 py-14 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col gap-6 lg:col-span-4">
            <Link
              href="/"
              aria-label={tr(
                "Local Organic Mart — home",
                "लोकल अर्गानिक मार्ट — गृहपृष्ठ",
              )}
              className="group flex w-fit flex-col items-start gap-2"
            >
              <BrandLogo className="h-16 transition-transform duration-300 group-hover:scale-[1.02]" />
              <span
                className={`text-[8.5px] text-gold/75 ${
                  lang === "ne"
                    ? "tracking-[0.1em]"
                    : "tracking-[0.34em] uppercase"
                }`}
              >
                {tr("Kathmandu Valley", "काठमाडौं उपत्यका")}
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-relaxed text-ash">
              {tr(
                "Farm-fresh, delivered across Kathmandu Valley. Harvested before dawn, dispatched within hours.",
                "खेतकै ताजा, काठमाडौं उपत्यकाभर डेलिभरी। बिहान उज्यालो हुनुअघि टिपेर केही घण्टामै पठाइन्छ।",
              )}
            </p>

            <div className="flex flex-col gap-2.5 pt-1 text-xs text-ash">
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-2.5 transition-colors hover:text-gold"
              >
                <Mail className="size-3.5 shrink-0 text-gold/60" aria-hidden />
                {contact.email}
              </a>
              <a
                href={`tel:${contact.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2.5 transition-colors hover:text-gold"
              >
                <Phone className="size-3.5 shrink-0 text-gold/60" aria-hidden />
                {contact.phone}
              </a>
              <span className="flex items-center gap-2.5">
                <MapPin className="size-3.5 shrink-0 text-gold/60" aria-hidden />
                {tr("Kathmandu, Nepal", "काठमाडौं, नेपाल")}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7 lg:col-start-6">
            {footerColumns.map((column) => {
              const heading = column.titleKey
                ? t(column.titleKey)
                : column.title;
              return (
                <nav key={column.title} aria-label={heading}>
                  <h2 className="text-[9px] tracking-[0.24em] text-gold/80 uppercase">
                    {heading}
                  </h2>
                  <ul className="mt-4 flex flex-col gap-2.5">
                    {column.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-[13px] text-ash transition-colors duration-200 hover:text-ivory"
                        >
                          {linkLabel(link)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              );
            })}
          </div>
        </div>

        {/* Baseline */}
        <div className="flex flex-col gap-6 border-t border-foreground/[0.08] py-8 lg:flex-row lg:items-center lg:justify-between">
          <ul className="flex flex-wrap items-center gap-2">
            {paymentMethods.map((method) => (
              <li
                key={method}
                className="border border-foreground/10 px-2.5 py-1 text-[9px] tracking-[0.16em] text-ash/60 uppercase"
              >
                {paymentMethodLabel(method, lang)}
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-1.5 lg:items-end">
            <p className="text-[10px] tracking-[0.12em] text-ash/50 uppercase">
              {tr(
                `${siteName} Pvt. Ltd. · Kathmandu, Nepal · ${contact.email}`,
                `लोकल अर्गानिक मार्ट प्रा. लि. · काठमाडौं, नेपाल · ${contact.email}`,
              )}
            </p>
            <a
              href="https://megasoft.net.np/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] tracking-[0.12em] text-ash/50 uppercase transition-colors duration-200 hover:text-gold"
            >
              {tr("Designed by Megasoft", "डिजाइन: Megasoft")}
            </a>
          </div>
        </div>

        {/*
          Oversized ghost wordmark. It is set at 6% ivory so it reads as a
          watermark pressed into the paper, not as another headline competing
          with the columns above.
        */}
        <div aria-hidden className="overflow-hidden pb-2">
          <p className="translate-y-[0.18em] text-center text-[clamp(2rem,7.5vw,6.5rem)] leading-[0.8] font-light tracking-[-0.04em] text-ivory/[0.06] select-none">
            {siteName}
          </p>
        </div>
      </div>
    </footer>
  );
}
