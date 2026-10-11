"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Enquiry form that hands off to WhatsApp.
 *
 * TODO: a real form API posts to a backend. Until then this composes a
 * `wa.me` message with the fields the visitor typed and opens it — the
 * message genuinely reaches the number, nothing is stored or sent anywhere
 * else. The link is built on submit rather than on every keystroke so the
 * anchor only navigates once.
 */
export function WhatsAppEnquiry({
  number,
  recipient,
}: {
  /** Digits only, country code first. */
  number: string;
  /** Named in the message so the visitor knows who receives it. */
  recipient: string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const body = [
      `Hello ${recipient},`,
      "",
      `Name: ${name.trim() || "—"}`,
      `Phone: ${phone.trim() || "—"}`,
      `Message: ${message.trim() || "—"}`,
    ].join("\n");

    window.open(
      `https://wa.me/${number}?text=${encodeURIComponent(body)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  const field =
    "h-11 w-full rounded-full border border-input bg-card/70 px-5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-mint focus-visible:ring-3 focus-visible:ring-ring/40";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="enq-name" className="sr-only">
          Your name
        </label>
        <input
          id="enq-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
          autoComplete="name"
          className={field}
        />
      </div>

      <div>
        <label htmlFor="enq-phone" className="sr-only">
          Phone number
        </label>
        <input
          id="enq-phone"
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="Phone number"
          autoComplete="tel"
          className={field}
        />
      </div>

      <div>
        <label htmlFor="enq-message" className="sr-only">
          Message
        </label>
        <textarea
          id="enq-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Message"
          rows={4}
          className={`${field} h-auto resize-none py-3.5`}
        />
      </div>

      <Button type="submit" className="h-11 w-full rounded-full">
        <MessageCircle className="size-4" aria-hidden />
        Send on WhatsApp
      </Button>
    </form>
  );
}
