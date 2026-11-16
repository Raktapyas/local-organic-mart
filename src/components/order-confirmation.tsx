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
import {
  customizationLabel,
  deliverySlotLabelFromLabel,
  lineName,
  paymentMethodLabel,
} from "@/lib/i18n/localize";
import { contentNe } from "@/lib/i18n/content-ne";
import { useOrderStore } from "@/lib/order-store";
import { useLang } from "@/lib/use-lang";

const NODES: {
  id: string;
  label: string;
  labelNe: string;
  icon: LucideIcon;
}[] = [
  {
    id: "placed",
    label: "Order placed",
    labelNe: "अर्डर गरियो",
    icon: ClipboardList,
  },
  {
    id: "confirmed",
    label: "Confirmed",
    labelNe: "पुष्टि भयो",
    icon: CheckCircle2,
  },
  {
    id: "preparing",
    label: "Preparing",
    labelNe: "तयार हुँदै",
    icon: CookingPot,
  },
  { id: "packed", label: "Packed", labelNe: "प्याक भयो", icon: Package },
  {
    id: "out",
    label: "Out for delivery",
    labelNe: "डेलिभरीमा",
    icon: Store,
  },
  { id: "delivered", label: "Delivered", labelNe: "पुग्यो", icon: Check },
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
  const { lang, money, tr } = useLang();
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
        <span className="inline-flex size-12 items-center justify-center rounded-[2px] bg-mint text-primary-foreground">
          <Check className="size-6" aria-hidden />
        </span>
        <h1 className="text-4xl tracking-tight sm:text-5xl">
          {tr("Order confirmed.", "अर्डर पुष्टि भयो।")}
        </h1>
        <p className="text-sm text-sage">
          {tr(
            `Order #${lastOrder.id} · Arriving in 45–60 min.`,
            `अर्डर #${lastOrder.id} · 45–60 मिनेटमा पुग्नेछ।`,
          )}
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
                      ? "inline-flex size-8 shrink-0 items-center justify-center rounded-[2px] bg-mint text-primary-foreground"
                      : current
                        ? "inline-flex size-8 shrink-0 items-center justify-center rounded-[2px] border border-gold bg-card text-gold"
                        : "inline-flex size-8 shrink-0 items-center justify-center rounded-[2px] border border-border bg-card text-muted-foreground"
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
                {tr(node.label, node.labelNe)}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Rider */}
        <div className="flex flex-col gap-5 rounded-[2px] border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="inline-flex size-11 items-center justify-center rounded-[2px] bg-muted font-heading text-base text-sage"
            >
              {(lang === "ne" ? contentNe.rider.name : RIDER.name).slice(0, 1)}
            </span>
            <span className="flex flex-col">
              <span className="font-heading text-base">
                {lang === "ne" ? contentNe.rider.name : RIDER.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {lang === "ne" ? contentNe.rider.role : RIDER.role}
              </span>
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-[2px]">
              <Phone className="size-4" aria-hidden />
              {tr("Call", "कल गर्नुहोस्")}
            </Button>
            <Button variant="outline" size="sm" className="rounded-[2px]">
              <MessageCircle className="size-4" aria-hidden />
              WhatsApp
            </Button>
          </div>
        </div>

        {/* Snapshot */}
        <div className="flex flex-col gap-4 rounded-[2px] border border-border bg-card p-6">
          <h2 className="font-heading text-lg">
            {tr("Order snapshot", "अर्डरको विवरण")}
          </h2>
          <ul className="flex flex-col gap-2 border-y border-border py-3">
            {lastOrder.lines.map((line) => (
              <li key={line.id} className="flex justify-between gap-3 text-sm">
                <span className="text-muted-foreground">
                  {lineName(line, lang)}
                  {line.qty > 1 && ` × ${line.qty}`}
                  {line.customizations && line.customizations.length > 0 && (
                    <span className="block text-[11px] text-sage">
                      {line.customizations
                        .map((option) => customizationLabel(option, lang))
                        .join(" · ")}
                    </span>
                  )}
                </span>
                <span>{money(line.unitPrice * line.qty)}</span>
              </li>
            ))}
          </ul>

          <dl className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">
                {tr("Delivering to", "डेलिभरी ठेगाना")}
              </dt>
              <dd>
                {tr(
                  lastOrder.address,
                  contentNe.addresses.find(
                    (address) => address.label === lastOrder.address,
                  )?.label ?? lastOrder.address,
                )}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">{tr("Slot", "समय")}</dt>
              <dd>{deliverySlotLabelFromLabel(lastOrder.slot, lang)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">{tr("Payment", "भुक्तानी")}</dt>
              <dd className="rounded-[2px] border border-foreground/10 px-2.5 py-1 text-xs">
                {paymentMethodLabel(lastOrder.payment, lang)}
              </dd>
            </div>
          </dl>

          <div className="flex items-center justify-between border-t border-border pt-4">
            <span className="font-heading text-lg">{tr("Total", "कुल")}</span>
            <span className="font-heading text-2xl">
              {money(lastOrder.totals.total)}
            </span>
          </div>
        </div>
      </div>

      <div>
        <Button variant="outline" className="rounded-[2px]" asChild>
          <Link href="/mart">
            {tr("Continue shopping", "किनमेल जारी राख्नुहोस्")}
          </Link>
        </Button>
      </div>
    </div>
  );
}
