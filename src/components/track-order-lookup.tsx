"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PackageSearch } from "lucide-react";

import { OrderNotFound } from "@/components/order-not-found";
import { Button } from "@/components/ui/button";
import { useOrderStore } from "@/lib/order-store";

/**
 * Order lookup.
 *
 * TODO: a real lookup queries the order API by reference. The demo store
 * holds only this session's order, so an id is resolvable only while that
 * order is in memory — anything else falls through to the shared
 * "not found" state explaining why.
 */
export function TrackOrderLookup() {
  const router = useRouter();
  const lastOrder = useOrderStore((state) => state.lastOrder);

  const [reference, setReference] = useState("");
  const [missed, setMissed] = useState(false);

  const normalised = reference.trim().toUpperCase();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!normalised) return;

    if (lastOrder && lastOrder.id.toUpperCase() === normalised) {
      router.push(`/order/${lastOrder.id}`);
      return;
    }
    setMissed(true);
  }

  return (
    <>
      <form onSubmit={onSubmit} className="flex w-full max-w-md flex-col gap-3">
        <label htmlFor="order-ref" className="text-xs tracking-wider text-sage uppercase">
          Order number
        </label>
        <div className="flex items-center gap-3">
          <input
            id="order-ref"
            value={reference}
            onChange={(event) => {
              setReference(event.target.value);
              setMissed(false);
            }}
            placeholder="LOM-1234"
            autoComplete="off"
            spellCheck={false}
            className="h-11 min-w-0 flex-1 rounded-full border border-input bg-card/70 px-5 text-sm uppercase outline-none transition-colors placeholder:normal-case placeholder:text-muted-foreground focus-visible:border-mint focus-visible:ring-3 focus-visible:ring-ring/40"
          />
          <Button type="submit" className="h-11 shrink-0 rounded-full px-6">
            Track
          </Button>
        </div>
        {lastOrder ? (
          <p className="text-xs text-muted-foreground">
            This session placed order{" "}
            <span className="text-mint">{lastOrder.id}</span>.
          </p>
        ) : null}
      </form>

      {missed ? (
        <div className="mt-10">
          <OrderNotFound />
        </div>
      ) : (
        <p className="mt-10 flex items-center gap-2 text-sm text-sage">
          <PackageSearch className="size-4 shrink-0" aria-hidden />
          Enter the reference from your confirmation to see live tracking.
        </p>
      )}
    </>
  );
}
