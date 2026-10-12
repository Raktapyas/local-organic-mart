import { Clock, Leaf, MapPin, Sprout } from "lucide-react";

import { products, TRUST_STRIP } from "@/lib/data";

const ICONS = {
  clock: Clock,
  sprout: Sprout,
  pin: MapPin,
  leaf: Leaf,
} as const;

/**
 * Hairline trust strip under the hero.
 *
 * The line count is read from `products` rather than typed in, so the strip
 * cannot quietly drift away from the catalogue it is describing.
 */
export function TrustStrip() {
  return (
    <section className="border-y border-foreground/10">
      <ul className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-y-4 px-6 py-6 lg:grid-cols-4">
        {TRUST_STRIP.map((item) => {
          const Icon = ICONS[item.icon];

          return (
            <li key={item.text} className="flex items-center gap-2.5">
              <Icon className="size-4 shrink-0 text-mint" aria-hidden />
              <span className="text-xs text-sage sm:text-sm">
                {item.icon === "leaf"
                  ? `${products.length}+ organic lines`
                  : item.text}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
