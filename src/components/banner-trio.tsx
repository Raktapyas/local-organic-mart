import Image from "next/image";
import Link from "next/link";

import { BANNERS } from "@/lib/data";

/**
 * Three equal photo banners, following the reference's
 * SHOP ALL / SHELLFISH / SMOKED shape: a photo tile, a dark scrim, and one
 * centred pill. The labels carry the meaning and the photography carries the
 * mood, so there is no copy block competing with the image.
 */
export function BannerTrio() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-10 sm:py-20">
      <ul className="grid gap-4 sm:grid-cols-3">
        {BANNERS.map((banner) => (
          <li key={banner.href}>
            <Link
              href={banner.href}
              className="group relative block aspect-4/3 overflow-hidden rounded-xl ring-1 ring-foreground/10 transition-all hover:ring-mint/35"
            >
              <Image
                src={banner.image}
                alt={banner.alt}
                fill
                sizes="(min-width: 640px) 33vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-background/45 transition-colors duration-700 group-hover:bg-background/35" />

              <div className="absolute inset-0 flex items-center justify-center">
                <span className="rounded-full bg-foreground px-7 py-3 text-sm font-medium text-background transition-transform duration-300 group-hover:-translate-y-1">
                  {banner.label}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
