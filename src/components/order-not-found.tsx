import Link from "next/link";
import { Info } from "lucide-react";

import { L } from "@/components/localized-text";
import { Button } from "@/components/ui/button";

/**
 * Shown wherever an order reference cannot be resolved — an unknown id on
 * `/order/[id]`, or a reference typed into `/track-order` that matches nothing
 * in the session. Kept in one place so both entry points explain the session
 * limit identically.
 */
export function OrderNotFound() {
  return (
    <div className="flex flex-col items-center gap-6 py-16 text-center">
      <span className="inline-flex size-12 items-center justify-center rounded-[2px] bg-mint text-primary-foreground">
        <Info className="size-6" aria-hidden />
      </span>
      <h2 className="text-3xl tracking-tight sm:text-4xl">
        <L en="Order not found." ne="अर्डर भेटिएन।" />
      </h2>
      <p className="max-w-md text-sm text-sage">
        <L
          en="Demo orders live for this session only. Place a new order to see live tracking."
          ne="डेमो अर्डर यो सत्रभर मात्र रहन्छ। प्रत्यक्ष ट्र्याकिङ हेर्न नयाँ अर्डर गर्नुहोस्।"
        />
      </p>
      <Button className="h-12 rounded-[2px] px-8" asChild>
        <Link href="/mart">
          <L en="Browse the Mart" ne="मार्ट हेर्नुहोस्" />
        </Link>
      </Button>
    </div>
  );
}
