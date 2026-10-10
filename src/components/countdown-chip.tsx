"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

import { cn } from "@/lib/utils";

function formatRemaining(ms: number) {
  const clamped = Math.max(0, ms);
  const days = Math.floor(clamped / 86_400_000);
  const hours = Math.floor((clamped % 86_400_000) / 3_600_000);
  const minutes = Math.floor((clamped % 3_600_000) / 60_000);
  const seconds = Math.floor((clamped % 60_000) / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Coral countdown chip. Ticks live on the client and falls back to the
 * server-rendered `label` so the markup is never empty during SSR.
 */
export function CountdownChip({
  /** Absolute close time, ISO 8601. */
  closesAt,
  label = "Ends in",
  className,
}: {
  closesAt: string;
  label?: string;
  className?: string;
}) {
  const target = new Date(closesAt).getTime();
  // Time is read inside the effect, never during render: reading the clock
  // while prerendering blocks the static build.
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setRemaining(target - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-coral/30 bg-coral/12 px-3 py-1 text-sm text-coral",
        className,
      )}
    >
      <Clock className="size-4" aria-hidden />
      <span>{label}</span>
      {remaining !== null && (
        <span className="tabular-nums">{formatRemaining(remaining)}</span>
      )}
    </span>
  );
}