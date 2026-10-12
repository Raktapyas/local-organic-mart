import { Sprout } from "lucide-react";

import { ANNOUNCEMENTS } from "@/lib/data";

/**
 * Thin announcement bar above the header. Deliberately *not* sticky — the
 * header sticks beneath it, so the ticker scrolls away and the navigation
 * stays, which is the reference behaviour.
 *
 * A server component: the marquee is pure CSS, so there is no client bundle
 * and no state to hydrate.
 */
export function AnnouncementTicker() {
  const set = (hidden: boolean) => (
    <ul
      className={`flex shrink-0 items-center ${hidden ? "ticker-dupe" : ""}`}
      {...(hidden ? { "aria-hidden": true as const } : {})}
    >
      {ANNOUNCEMENTS.map((item) => (
        <li key={item} className="flex items-center gap-2 px-5">
          <Sprout className="size-3 shrink-0 text-mint" aria-hidden />
          <span className="whitespace-nowrap text-xs">{item}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="overflow-hidden bg-[#0A150D] text-mint">
      <div className="ticker-track flex w-max items-center">
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
