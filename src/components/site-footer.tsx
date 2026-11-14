"use client";

import Link from "next/link";
import { Leaf, Mail, MapPin, Phone } from "lucide-react";

import {
  contact,
  footerColumns,
  paymentMethods,
  siteName,
} from "@/lib/data";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { useLang } from "@/lib/use-lang";

export function SiteFooter() {
  const { t } = useLang();

  return (
    <footer className="border-t border-foreground/[0.08] bg-[#060a07]">
      <div className="mx-auto w-full max-w-[88rem] px-6 lg:px-10">
        {/* Newsletter band */}
        <div className="border-b border-foreground/[0.08] py-12 lg:py-14">
          <NewsletterSignup />
        </div>

        {/* Masthead + link columns */}
        <div className="grid gap-12 py-14 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col gap-6 lg:col-span-4">
            <Link href="/" className="group flex items-center gap-3">
              <span className="relative grid size-9 shrink-0 rotate-45 place-items-center border border-gold/45 transition-colors duration-300 group-hover:border-gold/80">
                <Leaf className="-rotate-45 size-[15px] text-gold" aria-hidden />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-heading text-[0.95rem] tracking-[0.13em] text-ivory uppercase">
                  {siteName}
                </span>
                <span className="mt-[0.3rem] text-[8.5px] tracking-[0.34em] text-gold/75 uppercase">
                  Kathmandu Valley
                </span>
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-relaxed text-ash">
              Farm-fresh, delivered across Kathmandu Valley. Harvested before
              dawn, dispatched within hours.
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
                {contact.address}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7 lg:col-start-6">
            {footerColumns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h2 className="text-[9px] tracking-[0.24em] text-gold/80 uppercase">
                  {column.titleKey ? t(column.titleKey) : column.title}
                </h2>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[13px] text-ash transition-colors duration-200 hover:text-ivory"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
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
                {method}
              </li>
            ))}
          </ul>
          <p className="text-[10px] tracking-[0.12em] text-ash/50 uppercase">
            {siteName} Pvt. Ltd. &middot; Kathmandu, Nepal &middot;{" "}
            {contact.email}
          </p>
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
