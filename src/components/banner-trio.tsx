import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { L } from "@/components/localized-text";
import { BANNERS } from "@/lib/data";
import { contentNe } from "@/lib/i18n/content-ne";

/**
 * Three photo plates, edge to edge.
 *
 * The reference shape (a centred pill floating on a photo) is the most
 * template-looking element on the page. Here the label sits on the baseline
 * with a gold rule and an arrow, and the plates are divided by the same
 * hairline the category grid uses — so the bands read as one publication.
 */
export function BannerTrio() {
  return (
    <section className="border-b border-foreground/[0.06]">
      <ul className="grid gap-px bg-foreground/[0.07] sm:grid-cols-3">
        {BANNERS.map((banner, index) => (
          <li key={banner.href} className="bg-background">
            <Link
              href={banner.href}
              className="group relative flex aspect-4/3 flex-col justify-end overflow-hidden p-6 lg:p-8"
            >
              <Image
                src={banner.image}
                alt=""
                fill
                sizes="(min-width: 640px) 33vw, 100vw"
                className="object-cover opacity-75 transition-all duration-[900ms] group-hover:scale-[1.04] group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/10" />

              <div className="relative flex items-end justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <span className="tabular text-[9px] tracking-[0.24em] text-gold/70">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="rule-fade w-16" aria-hidden />
                  <span className="font-heading text-2xl leading-none tracking-[-0.01em] text-ivory lg:text-[1.75rem]">
                    <L
                      en={banner.label}
                      ne={contentNe.bannerLabels[index] ?? banner.label}
                    />
                  </span>
                </div>

                <ArrowUpRight
                  className="size-4 text-ivory/60 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold"
                  aria-hidden
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
