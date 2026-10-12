"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { DELIVERY_SLOTS, deliveryZones, trustCards } from "@/lib/data";

/**
 * Three expandable trust cards.
 *
 * The delivery card's body is built from live `deliveryZones` and
 * `DELIVERY_SLOTS` rather than a restatement of them, so the copy here cannot
 * drift from what checkout actually offers.
 *
 * Framer-motion drives the height so the panel animates to its content rather
 * than snapping, and the whole thing is static under reduced motion.
 */
export function TrustStack() {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="flex flex-col">
      {trustCards.map((card) => {
        const isOpen = open === card.id;

        return (
          <div key={card.id} className="border-t border-border last:border-b">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`trust-panel-${card.id}`}
                onClick={() => setOpen(isOpen ? null : card.id)}
                className="flex w-full items-center justify-between gap-4 py-3 text-left"
              >
                <span className="font-heading text-base sm:text-lg">
                  {card.title}
                </span>
                <ChevronDown
                  className={`size-4 shrink-0 text-muted-foreground transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden
                />
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={`trust-panel-${card.id}`}
                  key="panel"
                  initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.3,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="overflow-hidden"
                >
                  <TrustBody cardId={card.id} fallback={card.body} />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

function TrustBody({
  cardId,
  fallback,
}: {
  cardId: string;
  fallback: string;
}) {
  if (cardId !== "delivery") {
    return (
      <p className="pb-5 text-sm leading-relaxed text-muted-foreground">
        {fallback}
      </p>
    );
  }

  return (
    <div className="pb-5 text-sm text-muted-foreground">
      <p className="leading-relaxed">
        Inside the ring road in an hour, beyond it by courier. Pick a slot at
        checkout.
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {deliveryZones.slice(0, 3).map((zone) => (
          <li
            key={zone.area}
            className="rounded-full border border-foreground/10 px-3 py-1 text-xs"
          >
            {zone.area} · {zone.estimate}
          </li>
        ))}
      </ul>
      <p className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
        <span>Slots:</span>
        {DELIVERY_SLOTS.map((slot) => (
          <span key={slot.id} className="text-foreground">
            {slot.label}
          </span>
        ))}
      </p>
    </div>
  );
}
