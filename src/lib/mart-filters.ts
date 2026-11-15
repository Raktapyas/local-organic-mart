import {
  priceCeiling,
  sortOptions,
  type Product,
} from "@/lib/data";

export type MartSort = (typeof sortOptions)[number];

/** Filter state owned by `MartView`. `visible` lives with the component. */
export interface MartFilterState {
  /** Attribute ids from `filterAttributes`, ANDed together. */
  attributes: string[];
  /** Nav department ids from `martCategories`, ORed together. */
  categories: string[];
  /** Highest price still shown, in NPR. */
  maxPrice: number;
  sort: MartSort;
}

/** A department plus the ids of the products filed under it. */
export interface MartCategoryFilter {
  id: string;
  name: string;
  productIds: string[];
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * True when today falls inside the product's harvest window.
 *
 * `Product.season` is a human label such as `"Oct–Mar"`; absent means a
 * year-round staple, which this treats as not seasonal rather than "always in
 * season" — otherwise the filter would select almost the whole catalogue and
 * mean nothing. Handles windows that wrap the new year.
 */
export function isInSeason(product: Product, today = new Date()): boolean {
  if (!product.season) return false;

  const [startLabel, endLabel] = product.season
    .split(/[–-]/)
    .map((part) => part.trim());
  const start = MONTHS.indexOf(startLabel);
  const end = MONTHS.indexOf(endLabel);
  if (start < 0 || end < 0) return false;

  const month = today.getMonth();
  return start <= end
    ? month >= start && month <= end
    : month >= start || month <= end;
}

/** How each `filterAttributes` id maps onto a product. */
const ATTRIBUTE_MATCHERS: Record<string, (product: Product) => boolean> = {
  organic: (product) => product.flags.organic === true,
  local: (product) => product.flags.local === true,
  "in-season": (product) => isInSeason(product),
  "in-stock": (product) => !product.outOfStock,
};

/**
 * Slider maximum. Never below the catalogue's declared ceiling, and always
 * high enough to include every item on the page — a default that silently
 * hides the priciest lot would look like a bug.
 */
export function priceCeilingFor(items: Product[]): number {
  return items.reduce(
    (highest, product) => Math.max(highest, product.price),
    priceCeiling,
  );
}

export function hasActiveFilters(
  state: Pick<MartFilterState, "attributes" | "categories" | "maxPrice">,
  ceiling: number,
): boolean {
  return (
    state.attributes.length > 0 ||
    state.categories.length > 0 ||
    state.maxPrice < ceiling
  );
}

/**
 * Apply the sidebar filters to a scoped list.
 *
 * Categories are ORed (a product may belong to one department), attributes are
 * ANDed (Organic + Local means both), and the price is an inclusive ceiling.
 * `Featured` keeps the order the server sent.
 */
export function applyMartFilters(
  items: Product[],
  state: MartFilterState,
  categoryFilters: MartCategoryFilter[] = [],
): Product[] {
  const allowedIds =
    state.categories.length > 0
      ? new Set(
          categoryFilters
            .filter((filter) => state.categories.includes(filter.id))
            .flatMap((filter) => filter.productIds),
        )
      : null;

  const rows = items.filter((product) => {
    if (allowedIds && !allowedIds.has(product.id)) return false;
    if (product.price > state.maxPrice) return false;

    return state.attributes.every((id) => {
      const matches = ATTRIBUTE_MATCHERS[id];
      return matches ? matches(product) : true;
    });
  });

  switch (state.sort) {
    case "Price: Low to High":
      return [...rows].sort((a, b) => a.price - b.price);
    case "Price: High to Low":
      return [...rows].sort((a, b) => b.price - a.price);
    default:
      return rows;
  }
}
