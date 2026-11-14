"use client";

import { useState } from "react";
import { Send } from "lucide-react";

import { whatsappNumber } from "@/lib/data";

/**
 * Newsletter sign-up in the footer.
 *
 * TODO: newsletter API — there is no list to join yet. Rather than fake a
 * success message, this hands off to WhatsApp with the address prefilled, so
 * the signup genuinely reaches a human and the visitor is not told
 * something untrue. Swap the `window.open` for a POST when the backend lands.
 */
export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) return;

    const body = `Hi! I want the weekly deals newsletter for ${trimmed}.`;
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(body)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setSent(true);
  }

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <span className="eyebrow">The letter</span>
        <h2 className="mt-2 font-heading text-2xl leading-tight text-ivory">
          Subscribe to weekly deals
        </h2>
        <p className="mt-1.5 text-sm text-ash">
          One message a week. Unsubscribe any time.
        </p>
      </div>

      <div>
        <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="h-11 w-full border border-foreground/12 bg-transparent px-4 text-sm text-ivory outline-none transition-colors placeholder:text-ash/50 focus-visible:border-gold/60 sm:w-64"
          />
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center gap-2 bg-gold px-6 text-[10px] font-medium tracking-[0.18em] text-ink uppercase transition-opacity duration-200 hover:opacity-85"
          >
            <Send className="size-3.5" aria-hidden />
            Subscribe
          </button>
        </form>

        {sent ? (
          <p aria-live="polite" className="mt-2 text-[11px] text-ash">
            Opening WhatsApp to finish your signup.
          </p>
        ) : null}
      </div>
    </div>
  );
}
