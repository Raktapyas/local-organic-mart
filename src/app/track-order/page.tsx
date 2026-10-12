import type { Metadata } from "next";

import { SectionHeader } from "@/components/section-header";
import { SiteFooter } from "@/components/site-footer";
import { TrackOrderLookup } from "@/components/track-order-lookup";

export const metadata: Metadata = {
  title: "Track Order — Local Organic Mart",
  description: "Follow a delivery from the valley depot to your kitchen.",
};

export default function TrackOrderPage() {
  return (
    <>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-20">
        <SectionHeader
          as="h1"
          title="Track your order"
          subline="Enter the reference from your confirmation to see where it is."
        />

        <div className="mt-10">
          <TrackOrderLookup />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
