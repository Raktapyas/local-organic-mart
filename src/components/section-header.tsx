import type { ReactNode } from "react";

import { L } from "@/components/localized-text";
import { T } from "@/components/translated";
import type { DictPath } from "@/lib/use-lang";

/**
 * Section heading.
 *
 * Three registers, in this order: a gold micro-label that names the band of
 * the page, the heading itself in the display serif at a light weight, and a
 * short line of provenance on the same baseline to the right. The hairline
 * under the label is what gives consecutive sections a shared rhythm — without
 * it the page reads as a stack of unrelated blocks.
 *
 * `title` stays required: it is the English copy the server renders and what
 * search engines index. `titleKey` or `titleNe` only decides what a Nepali
 * reader sees once the language store has hydrated.
 */
export function SectionHeader({
  title,
  titleNe,
  subline,
  sublineNe,
  titleKey,
  sublineKey,
  eyebrow,
  eyebrowNe,
  aside,
  as: Heading = "h2",
}: {
  title: string;
  titleNe?: string;
  subline?: string;
  sublineNe?: string;
  titleKey?: DictPath;
  sublineKey?: DictPath;
  eyebrow?: string;
  eyebrowNe?: string;
  aside?: ReactNode;
  as?: "h1" | "h2";
}) {
  return (
    <div className="flex flex-col gap-4">
      {eyebrow ? (
        <div className="flex items-center gap-4">
          <span className="eyebrow shrink-0">
            <L en={eyebrow} ne={eyebrowNe ?? eyebrow} />
          </span>
          <span aria-hidden className="rule-fade flex-1" />
        </div>
      ) : null}

      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        {/*
          A section heading and a page title are not the same rank. When this
          component is promoted to `h1` (the Mart and Baskets indexes do that)
          it takes the page-title ramp used by the other interior pages, so the
          two indexes stop reading a size below every page they link to.
          `clamp()` remains for `h2`, where the heading sits inside content
          rather than opening the page.
        */}
        <Heading
          className={
            Heading === "h1"
              ? "text-4xl leading-[1.05] tracking-tight text-balance text-ivory sm:text-5xl md:text-6xl"
              : "text-[clamp(1.65rem,2.6vw,2.4rem)] leading-[1.05] font-light tracking-[-0.025em] text-ivory"
          }
        >
          {titleKey ? (
            <T k={titleKey} />
          ) : (
            <L en={title} ne={titleNe ?? title} />
          )}
        </Heading>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {(sublineKey || subline) && (
            <p className="max-w-sm text-xs leading-relaxed text-ash">
              {sublineKey ? (
                <T k={sublineKey} />
              ) : (
                <L en={subline} ne={sublineNe ?? subline} />
              )}
            </p>
          )}

          {aside}
        </div>
      </div>
    </div>
  );
}
