"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SEARCH_HINT_CHIPS } from "@/lib/data";

/**
 * Home search with quick chips and a visual-search affordance.
 *
 * TODO: vision search — the camera button opens a real file picker, so the
 * control is honest about what it does, then says plainly that there is no
 * model behind it yet. Wiring a picker to a dead end would be worse than
 * saying so.
 */
export function HomeSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [hint, setHint] = useState<string | null>(null);
  const [visionHint, setVisionHint] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  function submit(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="w-full max-w-xl">
      <form
        action="/search"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          submit(query);
        }}
        className="flex w-full items-center gap-2 rounded-full border border-foreground/15 bg-background/60 p-1.5 pl-4 shadow-lg backdrop-blur-xl transition-colors focus-within:border-mint/50 sm:gap-3 sm:pl-5"
      >
        <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        <input
          type="search"
          name="q"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search produce, pantry, and menus"
          placeholder="What do you need today?"
          className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />

        {/*
          The picker itself is visually hidden and driven by the button, so
          the label reads as a button while the control stays a file input.
        */}
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={() => {
            setVisionHint(true);
            if (fileInput.current) fileInput.current.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          aria-label="Search by photo"
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-mint"
        >
          <Camera className="size-4" aria-hidden />
        </button>

        <Button type="submit" className="rounded-full px-4 sm:px-5">
          Search
        </Button>
      </form>

      {/* Sub-hint chips: tapping one fills the field and searches. */}
      <ul className="mt-3 flex flex-wrap items-center gap-2">
        {SEARCH_HINT_CHIPS.map((chip) => (
          <li key={chip}>
            <button
              type="button"
              onClick={() => {
                setQuery(chip);
                setHint(chip);
                submit(chip);
              }}
              className="rounded-full border border-foreground/10 bg-background/50 px-3 py-1.5 text-xs text-sage backdrop-blur-sm transition-colors hover:border-mint/40 hover:text-mint"
            >
              {chip}
            </button>
          </li>
        ))}
      </ul>

      {hint ? (
        <p aria-live="polite" className="sr-only">
          Searching for {hint}
        </p>
      ) : null}

      {visionHint ? (
        <p className="mt-2 text-xs text-sage">Visual search — coming soon.</p>
      ) : null}
    </div>
  );
}
