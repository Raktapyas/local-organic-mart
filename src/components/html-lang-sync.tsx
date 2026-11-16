"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { pageTitle } from "@/lib/i18n/titles";
import { useLang } from "@/lib/use-lang";

/**
 * Keeps `<html lang>` and the document title in step with the active language.
 *
 * The `lang` attribute matters beyond tidy markup: screen readers pick a
 * pronunciation voice from it, so a Nepali page left declaring `lang="en"` is
 * read out in an English voice, and `lang` is how browsers decide whether to
 * offer translation at all.
 *
 * The title is set here because Next writes metadata on the server, where the
 * language store does not exist. This effect re-applies the localized title on
 * first paint and after every client navigation.
 *
 * Rendered as `null` — it exists purely for the effects.
 */
export function HtmlLangSync() {
  const { lang } = useLang();
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    document.title = pageTitle(pathname, lang);
  }, [pathname, lang]);

  return null;
}
