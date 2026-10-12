"use client";

import { type DictPath, useLang } from "@/lib/use-lang";

/**
 * Inline translation for server components.
 *
 * A page that renders `<T k="sections.baskets" />` stays a server component —
 * only this leaf ships to the client. Without it, translating a single heading
 * would force the whole page to become a client component.
 */
export function T({ k }: { k: DictPath }) {
  return <>{useLang().t(k)}</>;
}
