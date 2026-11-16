/**
 * Pure display helpers that overlay Nepali copy onto the English content in
 * `data.ts`.
 *
 * Two rules shape this module:
 *
 * 1. English is the identity transform. When `lang` is `"en"` every helper
 *    returns exactly the value it was given, so the English site renders the
 *    same strings whether or not this file exists.
 * 2. Only display strings are translated. Ids, slugs, prices, flags, filter
 *    tags and `region` keys stay English so filtering, search and routing do
 *    not change behaviour when the language does.
 *
 * Everything here is pure and takes `lang` explicitly, which keeps it
 * trivially testable and safe to call during render.
 */

import {
  ADDRESSES,
  DELIVERY_SLOTS,
  baskets,
  dishes,
  products,
  spiceLevels,
  type Basket,
  type Category,
  type Diet,
  type Dish,
  type DishTag,
  type DishSpice,
  type Farmer,
  type Product,
  type ProductCategory,
  type Review,
  type Spice,
} from "@/lib/data";
import { contentNe } from "@/lib/i18n/content-ne";
import type { Lang } from "@/lib/lang-store";

export interface ProductText {
  name: string;
  unit: string;
  desc: string;
  badge?: string;
  freshness?: string;
  soldOutNote?: string;
  region: string;
  harvestedOn: string;
  reviews?: Review[];
  bulkTiers?: { label: string; note: string }[];
  category: string;
  season?: string;
}

export interface DishText {
  name: string;
  portion: string;
  desc: string;
  prepTime: string;
  spice: string;
  diet: string;
  portions: { id: string; label: string; price: number; serves: string }[];
  addons: { id: string; label: string; price: number }[];
  tags: string[];
}

export interface BasketText {
  name: string;
  tag?: string;
  desc: string;
  includes: string[];
}

export interface FarmerText {
  name: string;
  location: string;
  story: string;
  special: string;
  elevation: string;
  regions: string[];
}

export interface CategoryText {
  name: string;
  note: string;
}

const ne = (lang: Lang) => lang === "ne";

/* ------------------------------------------------------------------ */
/* Small label lookups                                                */
/* ------------------------------------------------------------------ */

export function regionLabel(region: string, lang: Lang): string {
  if (!ne(lang)) return region;
  return contentNe.regions[region as keyof typeof contentNe.regions] ?? region;
}

export function placeLabel(place: string, lang: Lang): string {
  if (!ne(lang)) return place;
  return contentNe.places[place as keyof typeof contentNe.places] ?? place;
}

export function monthLabel(month: string, lang: Lang): string {
  if (!ne(lang)) return month;
  return contentNe.months[month as keyof typeof contentNe.months] ?? month;
}

/** `"6 Feb"` → `"6 फेब्रुअरी"`. Anything unfamiliar is returned untouched. */
export function dateLabel(date: string, lang: Lang): string {
  if (!ne(lang)) return date;
  return date.replace(
    /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/g,
    (token) => monthLabel(token, lang),
  );
}

/** `"Oct–Mar"` → `"अक्टोबर–मार्च"`. */
export function seasonLabel(season: string, lang: Lang): string {
  if (!ne(lang)) return season;
  return dateLabel(season, lang);
}

export function productCategoryLabel(
  category: ProductCategory,
  lang: Lang,
): string {
  if (!ne(lang)) return category;
  return contentNe.enums.productCategory[category];
}

export function dietLabel(diet: Diet, lang: Lang): string {
  if (!ne(lang)) return diet;
  return contentNe.enums.diet[diet];
}

export function spiceLabel(spice: Spice, lang: Lang): string {
  if (!ne(lang)) return spice;
  return contentNe.enums.spice[spice];
}

export function dishSpiceLabel(spice: DishSpice, lang: Lang): string {
  if (!ne(lang)) return spice;
  return contentNe.enums.dishSpice[spice];
}

export function dishTagLabel(tag: DishTag, lang: Lang): string {
  if (!ne(lang)) return tag;
  return contentNe.enums.dishTag[tag];
}

export function paymentMethodLabel(method: string, lang: Lang): string {
  if (!ne(lang)) return method;
  return (
    contentNe.paymentMethods[method as keyof typeof contentNe.paymentMethods] ??
    method
  );
}

export function sortOptionLabel(option: string, lang: Lang): string {
  if (!ne(lang)) return option;
  const index = ["Featured", "Price: Low to High", "Price: High to Low"].indexOf(
    option,
  );
  return contentNe.filters.sortOptions[index] ?? option;
}

export function frequencyLabel(frequency: string, lang: Lang): string {
  if (!ne(lang)) return frequency;
  const index = ["Daily", "Weekly", "Fortnightly"].indexOf(frequency);
  return contentNe.frequencies[index] ?? frequency;
}

export function deliverySlotLabel(id: string, lang: Lang): string {
  const index = DELIVERY_SLOTS.findIndex((slot) => slot.id === id);
  if (!ne(lang)) return DELIVERY_SLOTS[index]?.label ?? id;
  return contentNe.deliverySlots[index] ?? id;
}

/**
 * Orders store the *label* they were placed with, not the id, so the
 * confirmation page has to look the label back up rather than index directly.
 * A label that no longer exists is returned untouched.
 */
export function deliverySlotLabelFromLabel(label: string, lang: Lang): string {
  if (!ne(lang)) return label;
  const index = DELIVERY_SLOTS.findIndex((slot) => slot.label === label);
  return contentNe.deliverySlots[index] ?? label;
}

/** Saved-address labels and details, keyed by the English label. */
export function addressText(
  label: string,
  lang: Lang,
): { label: string; detail: string } {
  const index = ADDRESSES.findIndex((address) => address.label === label);
  const base = ADDRESSES[index];
  if (!ne(lang) || !base) return { label, detail: base?.detail ?? "" };

  const overlay = contentNe.addresses[index];
  return overlay ?? { label, detail: base.detail };
}

/* ------------------------------------------------------------------ */
/* Products                                                           */
/* ------------------------------------------------------------------ */

/** Bulk tier labels are quoted band + savings; both are systematic. */
function tierText(
  tier: { label: string; note: string },
  lang: Lang,
): { label: string; note: string } {
  if (!ne(lang)) return tier;
  return {
    label: tier.label
      .replace(" kg retail", " के.जी. खुद्रा")
      .replace(" kg", " के.जी."),
    note: tier.note
      .replace("Standard", "सामान्य")
      .replace("−5% savings", "−5% बचत")
      .replace("−10% savings", "−10% बचत"),
  };
}

export function productText(product: Product, lang: Lang): ProductText {
  const base: ProductText = {
    name: product.name,
    unit: product.unit,
    desc: product.desc,
    badge: product.badge,
    freshness: product.freshness,
    soldOutNote: product.soldOutNote,
    region: product.region,
    harvestedOn: product.harvestedOn,
    reviews: product.reviews,
    bulkTiers: product.bulkTiers,
    category: product.category,
    season: product.season,
  };

  if (!ne(lang)) return base;

  const overlay = contentNe.products[product.id];

  return {
    ...base,
    name: overlay?.name ?? product.name,
    unit: overlay?.unit ?? product.unit,
    desc: overlay?.desc ?? product.desc,
    badge: overlay?.badge ?? base.badge,
    freshness: overlay?.freshness ?? base.freshness,
    soldOutNote: overlay?.soldOutNote ?? base.soldOutNote,
    region: regionLabel(product.region, lang),
    harvestedOn: dateLabel(product.harvestedOn, lang),
    category: productCategoryLabel(product.category, lang),
    season: product.season ? seasonLabel(product.season, lang) : undefined,
    reviews: product.reviews?.map((review) => ({
      ...review,
      ...(overlay?.reviews?.[review.id] ?? {}),
      locality: placeLabel(review.locality, lang),
    })),
    bulkTiers: product.bulkTiers?.map((tier) => tierText(tier, lang)),
  };
}

/* ------------------------------------------------------------------ */
/* Dishes                                                             */
/* ------------------------------------------------------------------ */

export function dishText(dish: Dish, lang: Lang): DishText {
  const base: DishText = {
    name: dish.name,
    portion: dish.portion,
    desc: dish.desc,
    prepTime: dish.prepTime,
    spice: dish.spice,
    diet: dish.diet,
    portions: dish.portions,
    addons: dish.addons,
    tags: dish.tags,
  };

  if (!ne(lang)) return base;

  const overlay = contentNe.dishes[dish.id];

  return {
    ...base,
    name: overlay?.name ?? dish.name,
    portion: overlay?.portion ?? dish.portion,
    desc: overlay?.desc ?? dish.desc,
    prepTime: overlay?.prepTime ?? dish.prepTime,
    spice: spiceLabel(dish.spice, lang),
    diet: dietLabel(dish.diet, lang),
    portions: dish.portions.map((portion) => ({
      ...portion,
      label: overlay?.portions?.[portion.id]?.label ?? portion.label,
      serves: overlay?.portions?.[portion.id]?.serves ?? portion.serves,
    })),
    addons: dish.addons.map((addon) => ({
      ...addon,
      label: overlay?.addons?.[addon.id]?.label ?? addon.label,
    })),
    tags: dish.tags.map((tag) => dishTagLabel(tag, lang)),
  };
}

/* ------------------------------------------------------------------ */
/* Baskets, farmers, categories                                       */
/* ------------------------------------------------------------------ */

export function basketText(basket: Basket, lang: Lang): BasketText {
  const base: BasketText = {
    name: basket.name,
    tag: basket.tag,
    desc: basket.desc,
    includes: basket.includes,
  };
  if (!ne(lang)) return base;

  const overlay = contentNe.baskets[basket.id];
  if (!overlay) return base;

  return {
    name: overlay.name,
    tag: overlay.tag ?? base.tag,
    desc: overlay.desc,
    includes: overlay.includes,
  };
}

export function farmerText(farmer: Farmer, lang: Lang): FarmerText {
  const base: FarmerText = {
    name: farmer.name,
    location: farmer.location,
    story: farmer.story,
    special: farmer.special,
    elevation: farmer.elevation,
    regions: farmer.regions,
  };
  if (!ne(lang)) return base;

  const overlay = contentNe.farmers[farmer.id];
  if (!overlay) return base;

  return overlay;
}

export function categoryText(category: Category, lang: Lang): CategoryText {
  const base: CategoryText = { name: category.name, note: category.note };
  if (!ne(lang)) return base;

  const overlay = contentNe.categories[category.id];
  return overlay ?? base;
}

/** Notes on recurring plans, keyed by the basket they subscribe to. */
export function planNote(basketId: string, note: string, lang: Lang): string {
  if (!ne(lang)) return note;
  return (
    contentNe.subscriptionPlans[
      basketId as keyof typeof contentNe.subscriptionPlans
    ] ?? note
  );
}

/* ------------------------------------------------------------------ */
/* Cart and order lines                                               */
/* ------------------------------------------------------------------ */

/**
 * A persisted line keeps the English name it was added with.
 *
 * Cart lines outlive a language switch, so the bag, checkout and the order
 * confirmation cannot trust `line.name` — they re-resolve the live catalogue
 * entry by `kind` + `refId` and fall back to the stored English name when the
 * item has since left the catalogue. Prices and quantities are never touched.
 */
export interface LineRef {
  kind: "product" | "dish" | "basket";
  refId: string;
  name: string;
  unit?: string;
}

export function lineName(line: LineRef, lang: Lang): string {
  if (!ne(lang)) return line.name;

  if (line.kind === "product") {
    const product = products.find((entry) => entry.id === line.refId);
    return product ? productText(product, lang).name : line.name;
  }

  if (line.kind === "dish") {
    const dish = dishes.find((entry) => entry.id === line.refId);
    return dish ? dishText(dish, lang).name : line.name;
  }

  const basket = baskets.find((entry) => entry.id === line.refId);
  return basket ? basketText(basket, lang).name : line.name;
}

/** The selling unit or portion, re-resolved the same way as `lineName`. */
export function lineUnit(line: LineRef, lang: Lang): string {
  if (!ne(lang) || !line.unit) return line.unit ?? "";

  if (line.kind === "product") {
    const product = products.find((entry) => entry.id === line.refId);
    return product ? productText(product, lang).unit : line.unit;
  }

  if (line.kind === "dish") {
    const dish = dishes.find((entry) => entry.id === line.refId);
    return dish ? dishText(dish, lang).portion : line.unit;
  }

  const basket = baskets.find((entry) => entry.id === line.refId);
  return basket
    ? `${basketText(basket, lang).includes.length} वस्तु`
    : line.unit;
}

/**
 * Cart lines remember the English selections they were added with — "Large
 * portion", "Medium", "Extra papad". This maps those back to the same labels
 * the customizer offered, so the bag reads as one language.
 *
 * The map is built once from the catalogue overlays rather than restated by
 * hand, so a new add-on only needs its Nepali label in `content-ne.ts`.
 */
const customizationNe: Record<string, string> = (() => {
  const map: Record<string, string> = {};

  for (const dish of dishes) {
    const overlay = contentNe.dishes[dish.id];

    if (overlay?.name) map[dish.name] = overlay.name;

    for (const portion of dish.portions) {
      const label = overlay?.portions?.[portion.id]?.label;
      if (label) map[portion.label] = label;
    }

    for (const addon of dish.addons) {
      const label = overlay?.addons?.[addon.id]?.label;
      if (label) map[addon.label] = label;
    }
  }

  for (const level of spiceLevels) {
    const label = contentNe.enums.dishSpice[level.id];
    if (label) map[level.label] = label;
  }

  Object.assign(map, contentNe.enums.spice);

  return map;
})();

export function customizationLabel(label: string, lang: Lang): string {
  if (!ne(lang)) return label;

  const direct = customizationNe[label];
  if (direct) return direct;

  if (label.endsWith(" portion")) {
    const base = label.slice(0, -" portion".length);
    return `${customizationNe[base] ?? base} भाग`;
  }

  if (label.endsWith(" combo")) {
    const base = label.slice(0, -" combo".length);
    const names = base
      .split(" + ")
      .map((name) => customizationNe[name] ?? name)
      .join(" + ");
    return `${names} कम्बो`;
  }

  // Subscription lines carry a cadence note, e.g. "Repeats weekly".
  if (label.startsWith("Repeats ")) {
    const cadence = label.slice("Repeats ".length).toLowerCase();
    const index = ["daily", "weekly", "fortnightly"].indexOf(cadence);
    const localized = contentNe.frequencies[index];
    return localized ? `${localized} दोहोरिने` : label;
  }

  return label;
}
