"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  Heart,
  LifeBuoy,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { itemCount, useCartStore } from "@/lib/cart-store";
import { ADDRESSES, contactChannels } from "@/lib/data";
import { useOrderStore } from "@/lib/order-store";

const npr = new Intl.NumberFormat("en-NP");

/** Server snapshot is "not mounted"; the client snapshot is always mounted. */
const subscribeToNothing = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const chip =
  "flex items-center gap-2 rounded-full border border-foreground/10 px-4 py-2.5 text-sm transition-colors hover:border-mint/40 hover:text-mint";

/** Non-action chip: no destination exists yet, so it must not look like one. */
const inertChip =
  "flex cursor-default items-center gap-2 rounded-full border border-foreground/10 px-4 py-2.5 text-sm text-muted-foreground opacity-60";

/**
 * My Organic Home.
 *
 * Client-rendered because the Orders chip and the bag count both come from
 * stores that only exist in the browser. Prerendering would bake in "no
 * orders yet" and flash it at users who do have one — the route opts out via
 * Suspense so the shell around it still prerenders.
 *
 * TODO: account API — points, the Guest badge and membership tier are
 * placeholders. There is no auth or customer record behind them yet.
 * TODO: wishlist — no persistence layer, so it renders an empty state
 * instead of linking to a page that cannot exist.
 */
export function AccountHome() {
  const lastOrder = useOrderStore((state) => state.lastOrder);
  const bagCount = useCartStore((state) => itemCount(state.lines));

  // The bag count lives in localStorage, so the server has no count to
  // render. Gating it on mount keeps the first client paint identical to the
  // server HTML. Same approach as `CartBadge`.
  const mounted = useSyncExternalStore(
    subscribeToNothing,
    getClientSnapshot,
    getServerSnapshot,
  );

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-3xl">My Organic Home</h1>
        {/* TODO: account API — the real balance comes from the account. */}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 px-3 py-1.5 text-xs text-muted-foreground">
          <Star className="size-3.5 text-gold" aria-hidden />
          0 points &middot; Guest
        </span>
      </header>

      {/* Quick actions */}
      <section className="mt-10" aria-label="Quick actions">
        <ul className="flex flex-wrap gap-3">
          <li>
            {lastOrder ? (
              <Link href={`/order/${lastOrder.id}`} className={chip}>
                <Package className="size-4" aria-hidden />
                Orders
              </Link>
            ) : (
              <span aria-disabled="true" className={inertChip}>
                <Package className="size-4" aria-hidden />
                Orders
              </span>
            )}
          </li>

          <li>
            <Link href="/mart" className={chip}>
              <RotateCcw className="size-4" aria-hidden />
              Reorder
            </Link>
          </li>

          <li>
            <Link href="/track-order" className={chip}>
              <Package className="size-4" aria-hidden />
              Track Order
            </Link>
          </li>

          <li>
            <Link href="/bag" className={chip}>
              <ShoppingBag className="size-4" aria-hidden />
              Bag
              {mounted && bagCount > 0 ? (
                <span className="text-xs text-mint">{bagCount}</span>
              ) : null}
            </Link>
          </li>

          <li>
            <span aria-disabled="true" className={inertChip}>
              <Heart className="size-4" aria-hidden />
              Wishlist
            </span>
          </li>

          <li>
            <span aria-disabled="true" className={inertChip}>
              <MapPin className="size-4" aria-hidden />
              Addresses
            </span>
          </li>
        </ul>

        <p className="mt-6 border-l-2 border-foreground/10 pl-4 text-sm text-muted-foreground">
          {lastOrder ? (
            <>
              Last order{" "}
              <span className="text-foreground">{lastOrder.id}</span> &middot;{" "}
              {npr.format(lastOrder.totals.total)} NPR
            </>
          ) : (
            "No orders yet. Once you check out, your order and its tracking live here."
          )}
        </p>

        <ul className="mt-6 flex flex-col gap-2 text-sm text-muted-foreground">
          {ADDRESSES.map((address) => (
            <li key={address.id} className="flex items-center gap-2">
              <MapPin className="size-3.5 shrink-0" aria-hidden />
              <span>
                <span className="text-foreground">{address.label}</span> &middot;{" "}
                {address.detail}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Band cards */}
      <section className="mt-14 grid gap-5 sm:grid-cols-2">
        <Link
          href="/membership"
          className="rounded-xl border border-gold/40 p-6 transition-colors hover:border-gold/70"
        >
          <span className="inline-flex items-center gap-2 text-xs tracking-wider text-gold uppercase">
            <Sparkles className="size-3.5" aria-hidden />
            Membership
          </span>
          <p className="mt-3 font-heading text-xl">Farm Circle</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Points on every basket, early access to festival reserves.
          </p>
        </Link>

        <div className="rounded-xl border border-foreground/10 p-6">
          <span className="inline-flex items-center gap-2 text-xs tracking-wider text-sage uppercase">
            <LifeBuoy className="size-3.5" aria-hidden />
            Help &amp; support
          </span>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="outline" className="rounded-full" asChild>
              <a href={contactChannels.whatsapp}>
                <MessageCircle className="size-4" aria-hidden />
                WhatsApp
              </a>
            </Button>
            <Button variant="outline" className="rounded-full" asChild>
              <a href={contactChannels.viber}>
                <MessageCircle className="size-4" aria-hidden />
                Viber
              </a>
            </Button>
            <Button variant="outline" className="rounded-full" asChild>
              <a href={contactChannels.call}>
                <Phone className="size-4" aria-hidden />
                Call us
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
