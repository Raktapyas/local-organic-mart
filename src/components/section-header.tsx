import type { ReactNode } from "react";

export function SectionHeader({
  title,
  subline,
  /** Optional chip or control rendered at the right edge. */
  aside,
  /** Heading level. Use "h1" when the header is the page title. */
  as: Heading = "h2",
}: {
  title: string;
  subline?: string;
  aside?: ReactNode;
  as?: "h1" | "h2";
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-2">
        <Heading className="text-3xl tracking-tight">{title}</Heading>
        {subline && <p className="text-sm text-sage">{subline}</p>}
      </div>
      {aside}
    </div>
  );
}