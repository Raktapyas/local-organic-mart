"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import {
  Check,
  CheckCircle2,
  ClipboardList,
  CookingPot,
  MessageCircle,
  Package,
  Phone,
  Store,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { OrderNotFound } from "@/components/order-not-found";
import { Button } from "@/components/ui/button";
import { RIDER } from "@/lib/data";
import { useOrderStore } from "@/lib/order-store";

const npr = new Intl.NumberFormat("en-NP");

const NODES: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "placed", label: "Order placed", icon: ClipboardList },
  { id: "confirmed", label: "Confirmed", icon: CheckCircle2 },
  { id: "preparing", label: "Preparing", icon: CookingPot },
  { id: "packed", label: "Packed", icon: Package },
  { id: "out", label: "Out for delivery", icon: Store },
  { id: "delivered", label: "Delivered", icon: Check },
];

/** The demo starts with the first two nodes already complete. */
const INITIAL_ACTIVE = 2;
/** Simulation stops here; "Delivered" is never reached in the demo. */
const SIMULATION_STOP = 4;
const TICK_MS = 15_000;

/**
 * Order confirmation. Renders `lastOrder` from the order store, which is
 * client-only, so it returns null until mounted.
 */
const subscribeToNothing = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function OrderConfirmation() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const lastOrder = useOrderStore((state) => state.lastOrder);
  // `lastOrder` only exists in the client store, so render nothing until the
  // client has hydrated.
  const mounted = useSyncExternalStore(
    subscribeToNothing,
    getClientSnapshot,
    getServerSnapshot,
  );
  const [active, setActive] = useState(INITIAL_ACTIVE);

  useEffect(() => {
    if (!mounted) return;
    // TODO: replace with real API order events (SSE or polling). This is a
    // demo timer that advances the timeline and halts before "Delivered".
    if (active >= SIMULATION_STOP) return;
    const id = setInterval(() => {
      setActive((current) => Math.min(current + 1, SIMULATION_STOP));
    }, TICK_MS);
    return () => clearInterval(id);
  }, [active, mounted]);

  // Still hydrating: render nothing so the client paint matches the server
  // HTML. Only once mounted do we know whether this id resolves.
  if (!mounted) return null;

  // TODO: a real API returns true 404s for unknown order ids. The server
  // cannot validate a client-side order id, and Cache Components has already
  // streamed the 200 by the time the client store is readable, so this is a
  // designed state rather than `notFound()`.
  if (!id || !lastOrder || lastOrder.id !== id) return <OrderNotFound />;

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <header className="flex flex-col items-start gap-4">
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-mint text-primary-foreground">
          <Check className="size-6" aria-hidden />
        </span>
        <h1 className="text-4xl tracking-tight sm:text-5xl">Order confirmed.</h1>
        <p className="text-sm text-sage">
          Order #{lastOrder.id} &middot; Arriving in 45&ndash;60 min.
        </p>
      </header>

      {/* Timeline */}
      <ol className="flex w-full items-start">
        {NODES.map((node, index) => {
          const Icon = node.icon;
          const done = index < active;
          const current = index === active;
          return (
            <li key={node.id} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex w-full items-center">
                <span
                  aria-hidden
                  className={
                    index === 0
                      ? "h-0.5 flex-1 bg-transparent"
                      : "h-0.5 flex-1 bg-gold"
                  }
                />
                <span
                  className={
                    done
                      ? "inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-mint text-primary-foreground"
                      : current
                        ? "inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-gold bg-card text-gold"
                        : "inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground"
                  }
                >
                  <Icon className="size-4" aria-hidden />
                </span>
                <span
                  className={
                    index === NODES.length - 1
                      ? "h-0.5 flex-1 bg-transparent"
                      : "h-0.5 flex-1 bg-gold"
                  }
                />
              </div>
              <span
                className={
                  current
                    ? "px-1 text-center text-xs text-gold"
                    : done
                      ? "px-1 text-center text-xs text-foreground"
                      : "px-1 text-center text-xs text-muted-foreground"
                }
              >
                {node.label}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Rider */}
        <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="inline-flex size-11 items-center justify-center rounded-full bg-muted font-heading text-base text-sage"
            >
              {RIDER.name.slice(0, 1)}
            </span>
            <span className="flex flex-col">
              <span className="font-heading text-base">{RIDER.name}</span>
              <span className="text-xs text-muted-foreground">{RIDER.role}</span>
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-full">
              <Phone className="size-4" aria-hidden />
              Call
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <MessageCircle className="size-4" aria-hidden />
              WhatsApp
            </Button>
          </div>
        </div>

        {/* Snapshot */}
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
          <h2 className="font-heading text-lg">Order snapshot</h2>
          <ul className="flex flex-col gap-2 border-y border-border py-3">
            {lastOrder.lines.map((line) => (
              <li key={line.id} className="flex justify-between gap-3 text-sm">
                <span className="text-muted-foreground">
                  {line.name}
                  {line.qty > 1 && ` × ${line.qty}`}
                </span>
                <span>Rs {npr.format(line.unitPrice * line.qty)}</span>
              </li>
            ))}
          </ul>

          <dl className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Delivering to</dt>
              <dd>{lastOrder.address}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Slot</dt>
              <dd>{lastOrder.slot}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Payment</dt>
              <dd className="rounded-full border border-foreground/10 px-2.5 py-1 text-xs">
                {lastOrder.payment}
              </dd>
            </div>
          </dl>

          <div className="flex items-center justify-between border-t border-border pt-4">
            <span className="font-heading text-lg">Total</span>
            <span className="font-heading text-2xl">
              Rs {npr.format(lastOrder.totals.total)}
            </span>
          </div>
        </div>
      </div>

      <div>
        <Button variant="outline" className="rounded-full" asChild>
          <Link href="/mart">Continue shopping</Link>
        </Button>
      </div>
    </div>
  );
}
