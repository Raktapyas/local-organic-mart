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
    <div className="flex flex-col border-t border-foreground/[0.08]">
      {trustCards.map((card, index) => {
        const isOpen = open === card.id;

        return (
          <div key={card.id} className="border-b border-foreground/[0.08]">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`trust-panel-${card.id}`}
                onClick={() => setOpen(isOpen ? null : card.id)}
                className="group flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="flex items-baseline gap-5">
                  <span className="tabular text-[9px] tracking-[0.24em] text-gold/60">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-heading text-lg leading-tight text-ivory transition-colors duration-200 group-hover:text-gold sm:text-xl">
                    {card.title}
                  </span>
                </span>
                <ChevronDown
                  className={`size-4 shrink-0 text-ash transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-gold" : ""
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
      <p className="max-w-xl pb-6 pl-[3.15rem] text-sm leading-relaxed text-ash">
        {fallback}
      </p>
    );
  }

  return (
    <div className="pb-6 pl-[3.15rem] text-sm text-ash">
      <p className="max-w-xl leading-relaxed">
        Inside the ring road in an hour, beyond it by courier. Pick a slot at
        checkout.
      </p>
      <ul className="mt-4 flex flex-wrap gap-px border border-foreground/[0.08] bg-foreground/[0.08]">
        {deliveryZones.slice(0, 3).map((zone) => (
          <li key={zone.area} className="bg-background px-3 py-1.5 text-[11px]">
            {zone.area} &middot; {zone.estimate}
          </li>
        ))}
      </ul>
      <p className="mt-4 flex flex-wrap items-center gap-3 text-[10px] tracking-[0.16em] uppercase">
        <span className="text-gold/70">Slots</span>
        {DELIVERY_SLOTS.map((slot) => (
          <span key={slot.id} className="text-bone/70">
            {slot.label}
          </span>
        ))}
      </p>
    </div>
  );
}
