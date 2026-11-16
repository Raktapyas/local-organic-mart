import type { Metadata } from "next";
import { Suspense } from "react";

import { AccountHome } from "@/components/account-home";
import { L } from "@/components/localized-text";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "My Organic Home — Local Organic Mart",
  description: "Your orders, bag, saved addresses and membership in one place.",
};

export default function AccountPage() {
  return (
    <>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12 pb-24">
        <Suspense
          fallback={
            <p className="py-24 text-center text-sm text-sage">
              <L en="Loading your home…" ne="तपाईंको घर लोड हुँदैछ…" />
            </p>
          }
        >
          <AccountHome />
        </Suspense>
      </main>

      <SiteFooter />
    </>
  );
}
