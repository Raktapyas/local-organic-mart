# Design Map

Canonical index of every screen mockup in `design/`. Each row maps a design
folder to the route it implements.

**Build prompts should reference this file**, e.g. `implement /mart per
design/MAP.md`.

Only folders containing a `code.html` are screens. Image-only folders are mood
reference, not build targets, and are excluded.

## Screens

| # | Folder | Route | Status |
|---|--------|-------|--------|
| 1 | `local_organic_mart_home_page_flagship` | `/` | **done** |
| 2 | `local_organic_mart_kathmandu_desktop_flagship` | `/` | todo (variant) |
| 3 | `local_organic_mart_mart_listing_page` | `/mart` | **done** |
| 4 | `local_organic_mart_restaurant_page` | `/restaurant` | **done** |
| 5 | `local_organic_mart_offers_page` | `/offers` | todo |
| 6 | `local_organic_mart_farm_to_home_page` | `/farmers` | todo |
| 7 | `local_organic_mart_membership_page` | `/membership` | todo |
| 8 | `local_organic_mart_baskets_gifts_plans` | `/baskets` | todo |
| 9 | `local_organic_mart_bag_page` | `/bag` | todo |
| 10 | `local_organic_mart_checkout_page` | `/checkout` | todo |
| 11 | `local_organic_mart_login_page` | `/login` | todo |
| 12 | `local_organic_mart_my_organic_home` | `/account` | todo |
| 13 | `local_organic_mart_order_tracking_page` | `/orders` | todo |
| 14 | `local_organic_mart_search_results_page` | `/search` | todo |
| 15 | `local_organic_mart_support_page` | `/support` | todo |
| 16 | `local_organic_mart_bulk_business_page` | `/bulk` | todo |
| 17 | `local_organic_mart_about_page_1` | `/about` | todo |
| 18 | `local_organic_mart_about_page_2` | `/about` | todo (variant) |
| 19 | `local_organic_mart_wild_honey_product_detail_page` | `/product/[slug]` | **done** |
| 20 | `local_organic_mart_organic_dal_bhat_set_dish_detail_page` | `/restaurant/[slug]` | **done** |

**20 folders, 18 distinct routes.** Two routes have competing mockups; treat
those folders as design options for the route, not as separate pages.

## Notes

**Variants.** Rows 2 and 18 duplicate the route of rows 1 and 17. `_2` is the
larger, more recent export in both cases. Pick one per route rather than
building both.

**Styling source.** `kathmandu_botanical_artisan/` holds `DESIGN.md` and is the
authoritative spec for palette, type, and elevation. It has no `code.html`, so
it is not a screen. **DESIGN.md overrides the mockups** wherever the two
disagree — the Stitch exports use a light theme and Playfair Display, both of
which the shipped design rejects in favour of the dark DNA and Fraunces.

**Category routes.** `src/lib/data.ts` links to ten category routes
(`/mart/produce`, `/mart/dairy`, `/mart/fruit`, `/mart/herbs`, `/mart/local`,
`/mart/global`, `/mart/essentials`, `/mart/pantry`, `/mart/meat`, and the
`/restaurant` entry). None has a dedicated mockup; derive them from the
category rail on `/`.

**Detail pages.** Rows 19 and 20 are the reference for per-item detail layout.
Other products and dishes should follow these templates rather than needing
their own mocks.

## Progress

5 of 18 routes built. 13 todo.