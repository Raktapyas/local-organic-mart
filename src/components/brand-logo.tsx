import Image from "next/image";

/**
 * The brand lockup: crest + "LOCAL ORGANIC MART" wordmark.
 *
 * One file, one component, so the header, drawer and footer cannot drift
 * apart. The source is 227×102 — a single raster with no transparent margin,
 * so the ink fills the whole box. It is drawn for a light background (the
 * wordmark is deep green) and stays at its native aspect ratio; `w-auto`
 * plus a height is the only sizing the call sites need.
 *
 * Sizes are deliberately in pixels, not rem. The lockup's wordmark is only
 * ~17% of the source height, so the mark needs every pixel it can get: at
 * 40px the three wordmark lines are 7px tall and the ribbon inside the crest
 * is mud. The scale is the largest that fits each surface — 56px in the 72px
 * header bar, 44px in the 56px mobile bar, 48px in the drawer, 64px in the
 * footer.
 *
 * 51 CSS px is the sharpness ceiling at 2× DPR (the source is 227px wide, and
 * 51px tall is 113px wide). The header sits just above it and the footer
 * further above, which costs a little interpolation. That is the right trade:
 * the wordmark is dark green on a dark green field, so legibility — not
 * crispness — is the limiting factor, and shrinking to the native width makes
 * the mark vanish.
 *
 * `alt` defaults to empty: every call site sits inside a link that already
 * carries the accessible name. Pass the name only where the mark stands
 * alone, such as the drawer title.
 */
export function BrandLogo({
  className = "",
  alt = "",
  priority = false,
}: {
  className?: string;
  alt?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/images/brand/logo-local-organic-mart.png"
      alt={alt}
      width={227}
      height={102}
      priority={priority}
      unoptimized
      className={`w-auto ${className}`}
    />
  );
}
