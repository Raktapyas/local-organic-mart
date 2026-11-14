import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { STORY_CARDS } from "@/lib/data";

/**
 * Story-card duo.
 *
 * A full-bleed plate with a panel overlapping its lower-left corner. The panel
 * is opaque ink with a single gold hairline — no glass blur, no drop shadow —
 * so the text stays readable over any photograph without looking like a modal
 * dropped on a picture.
 *
 * Copy lives in `data.ts` so the page inlines no strings.
 */
export function StoryCards() {
  return (
    <section className="border-b border-foreground/[0.06]">
      <ul className="grid gap-px bg-foreground/[0.07] md:grid-cols-2">
        {STORY_CARDS.map((card, index) => (
          <li key={card.title} className="bg-background">
            <article className="group relative flex aspect-4/3 flex-col justify-end overflow-hidden p-4 lg:p-6">
              <Image
                src={card.image}
                alt=""
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover opacity-85 transition-transform duration-[900ms] group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />

              {/* The overlapping panel is the only thing carrying copy. */}
              <div className="relative border border-gold/25 bg-[#0a0f0c]/95 p-6 sm:max-w-sm sm:p-7">
                <span className="tabular text-[9px] tracking-[0.24em] text-gold/70">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-heading text-2xl leading-tight text-ivory">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ash">
                  {card.body}
                </p>
                <Link
                  href={card.href}
                  className="group/link mt-5 inline-flex items-center gap-2 text-[10px] tracking-[0.2em] text-gold uppercase"
                >
                  {card.cta}
                  <ArrowRight
                    className="size-3.5 transition-transform duration-300 group-hover/link:translate-x-1"
                    aria-hidden
                  />
                </Link>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
