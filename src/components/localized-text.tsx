"use client";

import type { ReactNode } from "react";

import { useLang } from "@/lib/use-lang";

/**
 * Inline bilingual copy for server components.
 *
 * A page that writes `<L en="Add to bag" ne="झोलामा थप्नुहोस्" />` stays a
 * server component — only this leaf ships to the client. `T` does the same for
 * shared dictionary keys; `L` is for the one-off strings that belong beside the
 * markup they describe.
 *
 * Both strings are rendered from the same component so there is no flash of
 * the wrong language: the server sends English, and React swaps the text in
 * place once the language store rehydrates.
 */
export function L({ en, ne }: { en: ReactNode; ne: ReactNode }) {
  const { lang } = useLang();
  return <>{lang === "ne" ? ne : en}</>;
}
