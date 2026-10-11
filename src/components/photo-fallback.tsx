import { Droplet } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Stands in for a product photo that does not exist yet. A warm, on-brand
 * gradient with a droplet mark reads as deliberate rather than broken, which a
 * wrong photo never does.
 */
export function PhotoFallback({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={`${label} — photo coming soon`}
      className={cn(
        "flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-accent via-card to-background text-sage",
        className,
      )}
    >
      <Droplet className="size-6 text-gold" aria-hidden />
      <span className="px-4 text-center text-xs tracking-wider uppercase">
        {label}
      </span>
    </div>
  );
}