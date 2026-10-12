"use client";

import { useEffect } from "react";

import { useLang } from "@/lib/use-lang";

/**
 * Keeps `<html lang>` in step with the active language.
 *
 * This matters beyond tidy markup: screen readers pick a pronunciation voice
 * from `lang`, so a Nepali page left declaring `lang="en"` is read out in an
 * English voice, and `lang` is how browsers decide whether to offer
 * translation at all.
 *
 * Rendered as `null` — it exists purely for the effect.
 */
export function HtmlLangSync() {
  const { lang } = useLang();

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return null;
}
