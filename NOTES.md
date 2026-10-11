# Project Notes

Running log of known gaps, deferred work, and the reasoning behind decisions
that are not obvious from the code.

## Open tasks

- [x] **Per-product photo top-up via Pexels MCP.** Every flagged substitute is
      now a literal subject match: mustard seeds for Mustard Oil, a real lassi
      glass for Sweet Lassi, a whole cauliflower head, a pile of red lentils,
      and a distinct candlelit dining room for the Restaurant hero. The
      over-bright `category-local.jpg` was replaced with an artisanal cheese
      wheel at luma 75.

      Cow Ghee had no usable photo on Pexels across several searches, so
      `Product.image` is now optional and Cow Ghee renders the `PhotoFallback`
      gradient card instead of a wrong photo. Sel Roti's hand-in-frame shot was
      replaced by a clay-tandoor bake with no hands.

      The earlier bad assets are gone: the pink-background `momo.jpg`, the
      near-identical jam jars behind honey and ghee, and the dish gallery's
      empty state.

      The gallery is adaptive: add entries to `Product.gallery` /
      `Dish.gallery` in `src/lib/data.ts` and the thumbnails appear. Entries
      must be unique — repeated sources are de-duplicated, and an item with one
      frame renders no thumbs at all.

- [x] **Dish gallery top-up.** All twelve dishes now carry extra angles, so
      `/restaurant/[slug]` renders the large photo plus thumbnails as the
      mockup shows. Dal Bhat Set, Chicken Momo, and Millet Dhido Set have two
      extras each; the other nine have one. Duplicates are dropped
      automatically.

      **Known limitation:** some second frames are close culinary relatives
      rather than the exact recipe — the Sel Roti gallery frame is a fried ring
      bread, and the Thukpa frame is noodle soup. Nothing shot-for-shot wrong,
      but a client wanting exact dish photography will need a real shoot.

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