import Image from "next/image";

/**
 * The brand lockup: crest + "LOCAL ORGANIC MART" wordmark.
 *
 * One file, one component, so the header, drawer and footer cannot drift
 * apart. The source is 227×102 and drawn for a light background — the
 * wordmark is deep green — so it stays at its native size and the browser
 * scales it down, which is sharper than asking the optimizer to cut a
 * 640px version out of a 227px original.
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
