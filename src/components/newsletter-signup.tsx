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
    <div>
      <h2 className="font-heading text-lg tracking-tight">
        Subscribe to weekly deals
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        One message a week. Unsubscribe any time.
      </p>

      <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
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
          className="h-11 w-full rounded-full border border-input bg-background/60 px-5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-mint sm:max-w-xs"
        />
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-mint px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Send className="size-4" aria-hidden />
          Subscribe
        </button>
      </form>

      {sent ? (
        <p aria-live="polite" className="mt-2 text-xs text-sage">
          Opening WhatsApp to finish your signup.
        </p>
      ) : null}
    </div>
  );
}
