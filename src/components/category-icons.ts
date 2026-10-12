import {
  Apple,
  Beef,
  CandlestickChart,
  FlaskConical,
  Globe2,
  Milk,
  Package,
  Sprout,
  UtensilsCrossed,
  Wheat,
  type LucideIcon,
} from "lucide-react";

import type { CategoryIconName } from "@/lib/data";

/**
 * Lucide icon per category.
 *
 * Lives in its own module because both the Home category grid and the
 * mega-menu category column need it — duplicating the map in two components
 * is how they end up disagreeing about which icon a category wears.
 */
export const categoryIcons: Record<CategoryIconName, LucideIcon> = {
  sprout: Sprout,
  apple: Apple,
  milk: Milk,
  flask: FlaskConical,
  wheat: Wheat,
  beef: Beef,
  candlestick: CandlestickChart,
  package: Package,
  globe: Globe2,
  utensils: UtensilsCrossed,
};
