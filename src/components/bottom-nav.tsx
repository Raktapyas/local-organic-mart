"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Flame,
  House,
  ShoppingBasket,
  User,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

interface Tab {
  label: string;
  href: string;
  icon: LucideIcon;
}

const TABS: Tab[] = [
  { label: "Home", href: "/", icon: House },
  { label: "Mart", href: "/mart", icon: ShoppingBasket },
  { label: "Restaurant", href: "/restaurant", icon: UtensilsCrossed },
  { label: "Offers", href: "/offers", icon: Flame },
  { label: "My Home", href: "/account", icon: User },
];

/**
 * `isActive` uses prefix matching so `/mart/herbs` keeps the Mart tab lit.
 * `/` is the one path that must match exactly, otherwise it would swallow
 * every route in the app.
 */
function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/** Fixed mobile tab bar. Below `lg` only — the desktop header has no tabs. */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-foreground/10 bg-background/90 backdrop-blur-xl lg:hidden"
    >
      <ul className="grid grid-cols-5 pb-[env(safe-area-inset-bottom)]">
        {TABS.map((tab) => {
          const active = isActive(pathname, tab.href);
          const Icon = tab.icon;

          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-1 py-2.5 text-[11px] transition-colors ${
                  active ? "text-mint" : "text-muted-foreground"
                }`}
              >
                <Icon className="size-5" aria-hidden />
                <span>{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
