import { MessageCircle, Phone } from "lucide-react";

import { contactChannels } from "@/lib/data";

/**
 * Floating WhatsApp + Viber buttons.
 *
 * Desktop is untouched by this — the whole element is `lg:hidden`. On mobile
 * it sits clear of the bottom tab bar (which is 4rem tall plus the home
 * indicator), so the two never overlap.
 */
export function FloatingContact() {
  return (
    <div className="fixed right-4 z-40 flex flex-col gap-2.5 lg:hidden" style={{ bottom: "calc(4.5rem + env(safe-area-inset-bottom))" }}>
      <a
        href={contactChannels.viber}
        aria-label="Chat with us on Viber"
        className="flex size-12 items-center justify-center rounded-full bg-[#7360f2] text-white shadow-lg transition-transform active:scale-95"
      >
        <MessageCircle className="size-5" aria-hidden />
      </a>
      <a
        href={contactChannels.whatsapp}
        aria-label="Chat with us on WhatsApp"
        className="flex size-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform active:scale-95"
      >
        <Phone className="size-5" aria-hidden />
      </a>
    </div>
  );
}
