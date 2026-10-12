"use client";

import { useSyncExternalStore } from "react";

import { dictionary } from "@/lib/dictionary";
import { type Lang, useLangStore } from "@/lib/lang-store";

type Dict = typeof dictionary.en;

/**
 * Every dot-path into the dictionary, e.g. `"cart.subtotal"`.
 *
 * Deriving this from the English object means a typo or a renamed key is a
 * compile error instead of a string that silently renders as `cart.subtotl`
 * at runtime.
 */
export type DictPath<T = Dict> = {
  [K in keyof T & string]: T[K] extends string
    ? K
    : `${K}.${DictPath<T[K]>}`;
}[keyof T & string];

/**
 * Subscribe to the persisted language.
 *
 * The server has no access to localStorage, so `getServerSnapshot` always
 * reports `"en"`. That is the whole trick: React hydrates against the English
 * markup it was sent, so a visitor who stored `"ne"` sees no hydration
 * mismatch. `persist` rehydrates the store a tick later, the subscription
 * fires, and the tree re-renders in Nepali.
 */
function subscribe(onStoreChange: () => void) {
  return useLangStore.subscribe(onStoreChange);
}

function getSnapshot(): Lang {
  return useLangStore.getState().lang;
}

function getServerSnapshot(): Lang {
  return "en";
}

/** Dot-path lookup. Missing keys return the path, which is loud on purpose. */
function lookup(dict: Dict, path: DictPath): string {
  const value = path
    .split(".")
    .reduce<unknown>(
      (node, key) =>
        node && typeof node === "object"
          ? (node as Record<string, unknown>)[key]
          : undefined,
      dict,
    );

  return typeof value === "string" ? value : path;
}

/**
 * `t` resolves a dictionary key in the active language.
 *
 * Only usable inside client components. Server components render
 * `<T k="..." />` from `@/components/translated` instead, which is a client
 * component and so can call this hook.
 */
export function useLang() {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return {
    lang,
    /** True once the persisted preference has taken over from the default. */
    isNe: lang === "ne",
    toggle: useLangStore((state) => state.toggle),
    t: (path: DictPath) => lookup(dictionary[lang], path),
  };
}
