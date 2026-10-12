import type { Metadata } from "next";
import Link from "next/link";
import { Compass } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Lost in the valley — Local Organic Mart",
  description: "This path isn't planted yet.",
};

/**
 * Branded 404. The server proxy already forces a real `404` status for unknown
 * product and dish slugs, so this is the document the browser renders for any
 * path we do not recognise.
 */
export default function NotFound() {
  return (
    <>

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-12 pb-24">
        <div className="flex flex-col items-center gap-6 py-20 text-center sm:py-28">
          <span className="inline-flex size-12 items-center justify-center rounded-full border border-border bg-card text-sage">
            <Compass className="size-6" aria-hidden />
          </span>
          <h1 className="text-4xl tracking-tight sm:text-5xl">
            Lost in the valley.
          </h1>
          <p className="max-w-md text-sm text-sage">
            This path isn&rsquo;t planted yet.
          </p>
          <Button className="h-12 rounded-full px-8" asChild>
            <Link href="/mart">Back to the Mart</Link>
          </Button>
          <Link
            href="/"
            className="text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-sage hover:underline"
          >
            Home
          </Link>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
