"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { useLang } from "@/lib/use-lang";

export function QuantityStepper({
  initial = 1,
  quantity: controlled,
  min = 1,
  max = 99,
  onChange,
  className,
}: {
  initial?: number;
  /** Controlled value. Takes precedence over `initial` when provided. */
  quantity?: number;
  min?: number;
  max?: number;
  onChange?: (quantity: number) => void;
  className?: string;
}) {
  const [uncontrolled, setUncontrolled] = useState(initial);
  const controlledMode = controlled !== undefined;
  const value = controlledMode ? controlled : uncontrolled;
  const { tr } = useLang();

  function update(next: number) {
    const clamped = Math.min(max, Math.max(min, next));
    if (!controlledMode) setUncontrolled(clamped);
    onChange?.(clamped);
  }

  return (
    <div
      className={cn(
        "flex h-12 w-32 shrink-0 items-center justify-between rounded-[2px] border border-border bg-card px-3",
        className,
      )}
    >
      <button
        type="button"
        aria-label={tr("Decrease quantity", "मात्रा घटाउनुहोस्")}
        disabled={value <= min}
        onClick={() => update(value - 1)}
        className="grid size-8 place-items-center text-muted-foreground transition-colors hover:text-mint disabled:opacity-40 disabled:hover:text-muted-foreground"
      >
        <Minus className="size-4" aria-hidden />
      </button>
      <span aria-live="polite" className="text-sm font-semibold tabular-nums">
        {value}
      </span>
      <button
        type="button"
        aria-label={tr("Increase quantity", "मात्रा बढाउनुहोस्")}
        disabled={value >= max}
        onClick={() => update(value + 1)}
        className="grid size-8 place-items-center text-muted-foreground transition-colors hover:text-mint disabled:opacity-40 disabled:hover:text-muted-foreground"
      >
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  );
}