import type { ReactNode } from "react";

import { T } from "@/components/translated";
import type { DictPath } from "@/lib/use-lang";

export function SectionHeader({
  title,
  subline,
  /** Dictionary key for `title`. Takes precedence over `title` when set. */
  titleKey,
  /** Dictionary key for `subline`. Takes precedence over `subline` when set. */
  sublineKey,
  /** Optional chip or control rendered at the right edge. */
  aside,
  /** Heading level. Use "h1" when the header is the page title. */
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
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-2">
        {/*
          `title` stays required: it is the English copy the server renders
          and the value that gets indexed by search engines. `titleKey` only
          decides what a Nepali reader sees once the store has hydrated.
        */}
        <Heading className="text-3xl tracking-tight">
          {titleKey ? <T k={titleKey} /> : title}
        </Heading>
        {(sublineKey || subline) && (
          <p className="text-sm text-sage">
            {sublineKey ? <T k={sublineKey} /> : subline}
          </p>
        )}
      </div>
      {aside}
    </div>
  );
}
