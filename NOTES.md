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

      | File | Subject | Current image is a substitute? |
      |------|---------|-------------------------------|
      | `public/images/ghee.jpg` | Cow Ghee | Yes — jar of blackberry preserve |
      | `public/images/mustard-oil.jpg` | Mustard Oil | Yes — vintage oil can |
      | `public/images/lassi.jpg` | Sweet Lassi | Yes — creamy drink, not lassi |
      | `public/images/cauliflower.jpg` | Cauliflower | Partial — rustic bowl on black |

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