"use client";

import type { ReactNode } from "react";

import { useLang } from "@/lib/use-lang";

/**
 * A `<section>` whose accessible name has to change with the language.
 *
 * `aria-label` is an attribute, so it cannot be swapped by rendering a child.
 * This thin client wrapper owns the attribute while its children stay
 * server-rendered, the same approach `LocalizedNav` takes for `<nav>`.
 */
export function LocalizedSection({
  en,
  ne,
  className,
  children,
}: {
  en: string;
  ne: string;
  className?: string;
  children: ReactNode;
}) {
  const { lang } = useLang();

  return (
    <section aria-label={lang === "ne" ? ne : en} className={className}>
      {children}
    </section>
  );
}
