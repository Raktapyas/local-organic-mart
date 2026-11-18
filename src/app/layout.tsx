import type { Metadata, Viewport } from "next";
import { Geist_Mono, Poppins } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

import { AnnouncementTicker } from "@/components/announcement-ticker";
import { BottomNav } from "@/components/bottom-nav";
import { FloatingContact } from "@/components/floating-contact";
import { HtmlLangSync } from "@/components/html-lang-sync";
import { MobileHeader } from "@/components/mobile-header";
import { SiteHeader } from "@/components/site-header";

/*
 * One family for the whole storefront — both scripts, every rank.
 *
 * Poppins carries Devanagari as well as Latin, so both subsets are fetched and
 * the browser picks the right file per codepoint from the `unicode-range` on
 * each generated face. There is no fallback chain left to fall through, which
 * is what used to make a mixed heading start in one face and finish in another.
 *
 * This replaces a three-family stack rather than adding to it: the Devanagari
 * subset was already part of the payload, while Fraunces, Tiro and Noto are
 * gone. 300 is not optional — seven display headings sit at `font-light`.
 */
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin", "devanagari"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Local Organic Mart",
  description:
    "Organic grocery delivery in Kathmandu. Harvested in the valley and the high hills, dispatched within hours.",
};

/** Matches the shell's ink background so the mobile browser chrome agrees. */
export const viewport: Viewport = {
  themeColor: "#0D1B12",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/*
        Both headers live here, not in the pages. Pages used to render their
        own `SiteHeader`, which meant a page that forgot it silently shipped
        with no navigation — the two policy pages did exactly that, because
        theirs lived inside the shared `PolicyPage` component where a grep of
        `src/app` could not see them. Owning the header in the layout makes
        "every route has a header" structural instead of a convention.

        Bottom padding clears the fixed tab bar (4rem + home indicator) on
        mobile only; `lg:pb-0` leaves desktop spacing untouched.
      */}
      <body className="flex min-h-full flex-col pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-0">
        {/*
          `usePathname()` needs a Suspense boundary under `cacheComponents`,
          and the title effect depends on it. The fallback is null: the shell
          is identical once resolved.
        */}
        <Suspense fallback={null}>
          <HtmlLangSync />
        </Suspense>
        {/* Not sticky: it scrolls away and the headers stick beneath it. */}
        <AnnouncementTicker />
        <MobileHeader />
        <SiteHeader />
        {children}
        {/*
          `BottomNav` reads the pathname to light the active tab, and with
          `cacheComponents` a `usePathname()` client component has to sit
          under a Suspense boundary or prerendering fails on every route.
          The fallback is null — a tab bar that arrives a frame late beats a
          broken build, and the markup is identical once resolved.
        */}
        <Suspense fallback={null}>
          <BottomNav />
        </Suspense>
        <FloatingContact />
      </body>
    </html>
  );
}
