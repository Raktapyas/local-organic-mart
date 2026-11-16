"use client";

import type { ReactNode } from "react";

import { useLang } from "@/lib/use-lang";

/**
 * A landmark whose accessible name has to change with the language.
 *
 * `aria-label` cannot be swapped by rendering a child the way visible copy is,
 * and the surrounding page is a server component, so this thin client wrapper
 * owns the attribute while its children stay server-rendered.
 */
export function LocalizedNav({
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
    <nav aria-label={lang === "ne" ? ne : en} className={className}>
      {children}
    </nav>
  );
}
