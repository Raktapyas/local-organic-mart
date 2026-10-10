import Link from "next/link";
import { Leaf, Mail, MapPin, Phone } from "lucide-react";

import {
  contact,
  footerColumns,
  paymentMethods,
  siteName,
} from "@/lib/data";

export function SiteFooter() {
  return (
    <footer className="border-t border-foreground/10 bg-card">
      <div className="mx-auto w-full max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 transition-opacity hover:opacity-80"
            >
              <Leaf className="size-5 text-mint" aria-hidden />
              <span className="font-heading text-lg tracking-tight">{siteName}</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Highland botanical and agricultural collective. Everything we sell
              is grown, gathered, or pressed within the valley and the high hills.
            </p>
            <div className="flex flex-col gap-2 pt-2 text-sm text-muted-foreground">
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-2 transition-colors hover:text-foreground"
              >
                <Mail className="size-4 shrink-0" aria-hidden />
                {contact.email}
              </a>
              <a
                href={`tel:${contact.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2 transition-colors hover:text-foreground"
              >
                <Phone className="size-4 shrink-0" aria-hidden />
                {contact.phone}
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0" aria-hidden />
                {contact.address}
              </span>
            </div>
          </div>

          {footerColumns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="font-heading text-sm font-medium text-foreground">
                {column.title}
              </h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-foreground/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-wrap items-center gap-2">
            {paymentMethods.map((method) => (
              <li
                key={method}
                className="rounded-full border border-foreground/10 px-3 py-1.5 text-xs text-muted-foreground"
              >
                {method}
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground">
            {siteName} Pvt. Ltd. &middot; Kathmandu, Nepal &middot;{" "}
            {contact.email} &middot; {contact.phone}
          </p>
        </div>
      </div>
    </footer>
  );
}