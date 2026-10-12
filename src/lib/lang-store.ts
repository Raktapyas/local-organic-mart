import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Lang = "en" | "ne";

interface LangState {
  lang: Lang;
  /** Switches between the two languages. */
  toggle: () => void;
}

/** localStorage key. Bump the suffix if the persisted shape ever changes. */
const STORAGE_KEY = "lom-lang-v1";

/**
 * UI language preference.
 *
 * Persisted so a visitor who switches to नेपाली keeps it across refreshes and
 * across devices via the browser's own storage. Actions are re-created every
 * load and must never be written to storage, hence `partialize`.
 */
export const useLangStore = create<LangState>()(
  persist(
    (set) => ({
      lang: "en",
      toggle: () =>
        set((state) => ({ lang: state.lang === "en" ? "ne" : "en" })),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ lang: state.lang }),
    },
  ),
);
