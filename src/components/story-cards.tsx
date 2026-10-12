import Image from "next/image";
import Link from "next/link";

import { STORY_CARDS } from "@/lib/data";

/**
 * Story-card duo, following the reference's "Fresh vs Frozen | Our Story"
 * shape: a full-bleed photo with a panel overlapping it at bottom-left.
 *
 * Copy lives in `data.ts` so the page inlines no strings.
 */
export function StoryCards() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-10 sm:py-20">
      <ul className="grid gap-6 md:grid-cols-2">
        {STORY_CARDS.map((card) => (
          <li key={card.title}>
            <article className="group relative block aspect-4/3 overflow-hidden rounded-xl">
              <Image
                src={card.image}
                alt=""
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* The overlapping panel is the only thing carrying copy. */}
              <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-foreground/10 bg-card/95 p-5 backdrop-blur-sm sm:right-auto sm:max-w-sm">
                <h3 className="font-heading text-xl tracking-tight">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {card.body}
                </p>
                <Link
                  href={card.href}
                  className="mt-4 inline-flex rounded-full bg-mint px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  {card.cta}
                </Link>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
