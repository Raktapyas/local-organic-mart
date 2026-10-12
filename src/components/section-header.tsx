import type { ReactNode } from "react";

import { T } from "@/components/translated";
import type { DictPath } from "@/lib/use-lang";

/**
 * Section heading.
 *
 * The subline sits inline to the right of the title on the same baseline
 * rather than stacked beneath it. Stacking cost a whole line of vertical
 * rhythm per section, which is most of what made Home read as an editorial
 * gallery rather than a shop.
 *
 * `title` stays required: it is the English copy the server renders and what
 * search engines index. `titleKey` only decides what a Nepali reader sees
 * once the language store has hydrated.
 */
export function SectionHeader({
  title,
  subline,
  titleKey,
  sublineKey,
  aside,
  as: Heading = "h2",
}: {
  title: string;
  subline?: string;
  titleKey?: DictPath;
  sublineKey?: DictPath;
  aside?: ReactNode;
  as?: "h1" | "h2";
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
      <Heading className="font-heading text-2xl tracking-tight">
        {titleKey ? <T k={titleKey} /> : title}
      </Heading>

      {(sublineKey || subline) && (
        <p className="text-xs text-sage">
          {sublineKey ? <T k={sublineKey} /> : subline}
        </p>
      )}

      {aside}
    </div>
  );
}
