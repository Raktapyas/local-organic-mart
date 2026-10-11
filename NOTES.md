# Project Notes

Running log of known gaps, deferred work, and the reasoning behind decisions
that are not obvious from the code.

## Open tasks

- [ ] **Per-product photo top-up via Pexels MCP before client demo.** Every
      product currently ships a single frame, so product galleries render one
      image and no thumbnail strip. The gallery is adaptive by design: add
      entries to `Product.gallery` in `src/lib/data.ts` and the thumbnails
      appear. Entries must be unique — repeated sources are de-duplicated, and
      a product with one frame renders no thumbs at all.

      Candidates still missing real photography:

      | File | Subject | Problem |
      |------|---------|---------|
      | `public/images/mustard-oil.jpg` | Mustard Oil | Substitute — vintage oil can |
      | `public/images/lassi.jpg` | Sweet Lassi | Substitute — creamy drink, not lassi |
      | `public/images/cauliflower.jpg` | Cauliflower | Partial — rustic bowl on black |
      | `public/images/lentils.jpg` | Red Lentil | Wrong subject — shows a thali, not pulses |
      | `public/images/dish-sel-roti.jpg` | Sel Roti | A hand is in frame |
      | `public/images/restaurant-band.jpg` | Restaurant hero | Duplicates the Home restaurant band photo |

      `ghee.jpg` and `honey.jpg` were near-identical jam jars and have been
      replaced with `product-ghee.jpg` and `product-honey.jpg`. The pink-background
      `momo.jpg` is gone, replaced by `dish-chicken-momo.jpg` and
      `dish-veg-momo.jpg`.
      `dish-*.jpg` and `product-*.jpg` entries need the same treatment — see
      the dish gallery note below.

- [ ] **Dish gallery top-up.** No dish sets `gallery`, so every dish detail page
      renders a single 4:3 frame with no thumbnails. The reference design for
      `/restaurant/[slug]` shows a large photo plus two thumbnails, so the
      built page currently reads sparser than the mockup. Add entries to
      `Dish.gallery` in `src/lib/data.ts`; duplicates are dropped
      automatically and one frame renders no thumbs.

- [ ] **Build before typecheck.** `tsc --noEmit` fails with
      `Cannot find name 'LayoutProps'` if run before `next build`, because
      that type is generated into `.next/types` by the build. Run
      `npm run build && npx tsc --noEmit`. A CI job that typechecks a fresh
      clone will fail without the build step first.

- [ ] **Copy: remaining invented numbers.** Under the rule "invented proper
      nouns, brand entities, and numbers are banned", two survive in
      `data.ts` and need a ruling:
      - `Complete Kitchen Basket` desc: "assembled before the 5:00 AM cutoff"
      - `Wild Honey` desc: "gathered at 2,400m"

      Elevation and harvest times are plausibly real, so neither was changed
      unilaterally.

- [ ] **Wire the cart.** `src/components/product-purchase.tsx` logs a
      `cart:add` payload instead of writing to a store. Client-side totals are
      preview only; the API owns pricing and tier eligibility.

- [ ] **Wishlist.** The "Save to wishlist" control is inert.

- [ ] **Live search and filters.** The Mart search field, category rail,
      sidebar checkboxes, price slider, and sort select are presentational
      only — they hold no state and do not filter.

## Decisions

- **`--destructive` is `#e5484D`, not coral.** Coral (`#F2A08C`) is reserved
  for countdowns and discount chips per the design DNA and must never signal an
  error.
- **Morel Mushroom is Rs 2,800.** An earlier value in `data.ts` was invented
  without a source; the design mockup is authoritative on pricing.
- **Batch codes are unique per product.** The reference mockup reuses `K-118`
  for Wild Honey, so that code stayed put and the collision was resolved on the
  other product rather than the one with a spec reference.
- **`design/` is untracked.** It is 22 MB of reference mockups, not app code.

## Not yet built

16 of 18 routes in `design/MAP.md` remain unbuilt. See that file for the
folder-to-route index.