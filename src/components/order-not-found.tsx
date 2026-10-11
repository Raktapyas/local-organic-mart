import Link from "next/link";
import { Info } from "lucide-react";

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
      <span className="inline-flex size-12 items-center justify-center rounded-full bg-mint text-primary-foreground">
        <Info className="size-6" aria-hidden />
      </span>
      <h2 className="text-3xl tracking-tight sm:text-4xl">Order not found.</h2>
      <p className="max-w-md text-sm text-sage">
        Demo orders live for this session only. Place a new order to see live
        tracking.
      </p>
      <Button className="h-12 rounded-full px-8" asChild>
        <Link href="/mart">Browse the Mart</Link>
      </Button>
    </div>
  );
}
