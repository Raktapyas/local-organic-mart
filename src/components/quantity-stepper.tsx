"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

export function QuantityStepper({
  initial = 1,
  min = 1,
  max = 99,
  onChange,
  className,
}: {
  initial?: number;
  min?: number;
  max?: number;
  onChange?: (quantity: number) => void;
  className?: string;
}) {
  const [quantity, setQuantity] = useState(initial);

  function update(next: number) {
    const clamped = Math.min(max, Math.max(min, next));
    setQuantity(clamped);
    onChange?.(clamped);
  }

  return (
    <div
      className={cn(
        "flex h-12 w-32 shrink-0 items-center justify-between rounded-xl border border-border bg-card px-3",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={quantity <= min}
        onClick={() => update(quantity - 1)}
        className="text-muted-foreground transition-colors hover:text-mint disabled:opacity-40 disabled:hover:text-muted-foreground"
      >
        <Minus className="size-4" aria-hidden />
      </button>
      <span aria-live="polite" className="text-sm font-semibold tabular-nums">
        {quantity}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={quantity >= max}
        onClick={() => update(quantity + 1)}
        className="text-muted-foreground transition-colors hover:text-mint disabled:opacity-40 disabled:hover:text-muted-foreground"
      >
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  );
}