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

import { useLang, type DictPath } from "@/lib/use-lang";

interface Tab {
  labelKey: DictPath;
  href: string;
  icon: LucideIcon;
}

const TABS: Tab[] = [
  { labelKey: "nav.home", href: "/", icon: House },
  { labelKey: "nav.mart", href: "/mart", icon: ShoppingBasket },
  { labelKey: "nav.restaurant", href: "/restaurant", icon: UtensilsCrossed },
  { labelKey: "nav.offers", href: "/offers", icon: Flame },
  { labelKey: "nav.myHome", href: "/account", icon: User },
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
  const { t, tr } = useLang();

  return (
    <nav
      aria-label={tr("Primary mobile", "मुख्य मोबाइल")}
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
                className={`relative flex flex-col items-center gap-1.5 py-2.5 text-[9px] tracking-[0.14em] uppercase transition-colors ${
                  active ? "text-gold" : "text-ash/70"
                }`}
              >
                <span
                  aria-hidden
                  className={`absolute inset-x-4 top-0 h-px transition-colors ${
                    active ? "bg-gold/70" : "bg-transparent"
                  }`}
                />
                <Icon className="size-[18px]" aria-hidden />
                <span>{t(tab.labelKey)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
