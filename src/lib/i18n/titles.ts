/**
 * Document titles per route, both languages.
 *
 * Next sets the title on the server, where the language store does not exist,
 * so a visitor who has chosen नेपाली would otherwise keep an English tab title
 * forever. `HtmlLangSync` re-applies this map on every client navigation.
 *
 * The English entries reproduce the metadata strings exactly, so switching
 * back to English restores the same title the server sent.
 */

import {
  categoryBySlug,
  dishBySlug,
  productBySlug,
} from "@/lib/data";
import { categoryText, dishText, productText } from "@/lib/i18n/localize";
import type { Lang } from "@/lib/lang-store";

const TITLES: Record<string, { en: string; ne: string }> = {
  "/about": { en: "About", ne: "हाम्रोबारे" },
  "/account": { en: "My Organic Home", ne: "मेरो अर्गानिक घर" },
  "/bag": { en: "Your bag", ne: "तपाईंको झोला" },
  "/baskets": { en: "Baskets, Gifts & Plans", ne: "टोकरी, उपहार र योजना" },
  "/checkout": { en: "Checkout", ne: "चेकआउट" },
  "/delivery-zones": { en: "Delivery Zones", ne: "डेलिभरी क्षेत्र" },
  "/farmers": { en: "Farm to Home", ne: "खेतबाट घर" },
  "/membership": { en: "Membership", ne: "सदस्यता" },
  "/offers": { en: "Offers", ne: "अफर" },
  "/privacy-policy": { en: "Privacy Policy", ne: "गोपनीयता नीति" },
  "/refund-policy": { en: "Refund Policy", ne: "फिर्ता नीति" },
  "/search": { en: "Search", ne: "खोज" },
  "/track-order": { en: "Track Order", ne: "अर्डर ट्र्याक" },
};

export function pageTitle(pathname: string, lang: Lang): string {
  const brand = lang === "ne" ? "लोकल अर्गानिक मार्ट" : "Local Organic Mart";
  const suffix = ` — ${brand}`;

  if (pathname === "/") return brand;

  // These two pages carry no `metadata` of their own, so the browser shows the
  // root title in English. Nepali gets a route name instead.
  if (pathname === "/mart") {
    return lang === "ne" ? `मार्ट${suffix}` : brand;
  }
  if (pathname === "/restaurant") {
    return lang === "ne" ? `रेस्टुरेन्ट${suffix}` : brand;
  }

  const fixed = TITLES[pathname];
  if (fixed) return `${fixed[lang]}${suffix}`;

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 2) {
    const [section, slug] = segments;

    if (section === "product") {
      const product = productBySlug(slug);
      if (product) return `${productText(product, lang).name}${suffix}`;
    }

    if (section === "restaurant") {
      const dish = dishBySlug(slug);
      if (dish) return `${dishText(dish, lang).name}${suffix}`;
    }

    if (section === "mart") {
      const category = categoryBySlug(slug);
      if (category) return `${categoryText(category, lang).name}${suffix}`;
    }

    if (section === "order") {
      return lang === "ne" ? `अर्डर पुष्टि${suffix}` : `Order confirmed${suffix}`;
    }
  }

  // Anything left is the 404 document: `src/app/not-found.tsx`.
  return lang === "ne" ? `उपत्यकामा हराउनुभयो${suffix}` : `Lost in the valley${suffix}`;
}
