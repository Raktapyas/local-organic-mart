"use client";

import { Star } from "lucide-react";

import { useLang } from "@/lib/use-lang";

/**
 * Five-star rating with a spoken label, e.g. "4 out of 5" / "5 मध्ये 4".
 *
 * Client-side purely so the accessible name can follow the language; the
 * glyphs themselves are decorative.
 */
export function Stars({ rating }: { rating: number }) {
  const { tr } = useLang();

  return (
    <span
      className="flex items-center gap-0.5"
      aria-label={tr(`${rating} out of 5`, `5 मध्ये ${rating}`)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          aria-hidden
          className={
            star <= rating
              ? "size-3.5 fill-gold text-gold"
              : "size-3.5 text-muted-foreground/40"
          }
        />
      ))}
    </span>
  );
}
