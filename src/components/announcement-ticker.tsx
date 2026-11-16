import { L } from "@/components/localized-text";
import { contentNe } from "@/lib/i18n/content-ne";
import { ANNOUNCEMENTS } from "@/lib/data";

/**
 * Thin announcement bar above the header. Deliberately *not* sticky — the
 * header sticks beneath it, so the ticker scrolls away and the navigation
 * stays, which is the reference behaviour.
 *
 * A server component: the marquee is pure CSS, so there is no client bundle
 * and no state to hydrate.
 *
 * Styling note: the bar is set as a gold-on-ink micro-line and each item is
 * separated by a diamond rather than an icon. At 10px the sprout glyph turned
 * into noise; a rotated square holds its shape at any size.
 */
export function AnnouncementTicker() {
  const set = (hidden: boolean) => (
    <ul
      className={`flex shrink-0 items-center ${hidden ? "ticker-dupe" : ""}`}
      {...(hidden ? { "aria-hidden": true as const } : {})}
    >
      {ANNOUNCEMENTS.map((item, index) => (
        <li key={item} className="flex items-center gap-3 px-6">
          <span
            aria-hidden
            className="size-1 rotate-45 border border-gold/60 bg-gold/20"
          />
          <span className="whitespace-nowrap text-[10px] tracking-[0.22em] text-bone/80 uppercase">
            <L en={item} ne={contentNe.announcements[index] ?? item} />
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="overflow-hidden border-b border-foreground/[0.07] bg-[#050805]">
      <div className="ticker-track flex w-max items-center py-2.5">
        {/*
          The list is rendered twice. The second copy is hidden from assistive
          tech, otherwise a screen reader would announce every announcement
          twice on load.
        */}
        {set(false)}
        {set(true)}
      </div>
    </div>
  );
}
