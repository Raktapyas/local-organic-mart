import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sprout,
  Tag,
  type LucideIcon,
} from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { WhatsAppEnquiry } from "@/components/whatsapp-enquiry";
import {
  aboutHero,
  aboutValues,
  contact,
  deliveryZones,
  farmers,
  heroImage,
  whatsappNumber,
  type AboutValueIconName,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "About — Local Organic Mart",
  description:
    "Who we are, the collectives we buy from, and how to reach the valley depot.",
};

const valueIcons: Record<AboutValueIconName, LucideIcon> = {
  sprout: Sprout,
  tag: Tag,
  shield: ShieldCheck,
};

/** Google Maps search for the depot, not a guessed pin. */
const mapsHref =
  "https://maps.google.com/?q=Local+Organic+Mart+Kathmandu";

export default function AboutPage() {
  return (
    <>
      <SiteHeader />

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-6 pt-20 pb-16 text-center">
          <h1 className="text-4xl tracking-tight text-balance sm:text-5xl">
            {aboutHero.headline}
          </h1>
          <p className="max-w-2xl text-base text-sage">{aboutHero.subline}</p>
        </section>

        {/* Story row */}
        <section className="mx-auto grid w-full max-w-7xl items-center gap-10 px-6 pb-20 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-xs tracking-wider text-sage uppercase">
                Our living principles
              </h2>
              <p className="font-heading text-2xl tracking-tight sm:text-3xl">
                Agricultural integrity, without compromise
              </p>
            </div>

            {/* One line per collective, read straight from the farmer table —
                no coalition is named here that is not in `farmers`. */}
            <ul className="flex flex-col gap-5">
              {farmers.map((farmer) => (
                <li
                  key={farmer.id}
                  className="border-l border-gold/40 pl-5"
                >
                  <p className="font-heading text-base">{farmer.name}</p>
                  <p className="mt-0.5 text-xs text-sage">
                    {farmer.location} · {farmer.elevation}
                  </p>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {farmer.story}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted">
            <Image
              src={heroImage}
              alt="Terraced highland fields above the Kathmandu valley at dawn"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </section>

        {/* Values */}
        <section className="mx-auto w-full max-w-7xl px-6 pb-20">
          <ul className="grid gap-4 md:grid-cols-3">
            {aboutValues.map((value) => {
              const Icon = valueIcons[value.icon];
              return (
                <li
                  key={value.title}
                  className="flex flex-col gap-3 rounded-xl border border-border bg-card/40 p-6"
                >
                  <span className="inline-flex size-9 items-center justify-center rounded-full border border-gold/40 text-gold">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <h3 className="font-heading text-base leading-tight">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{value.note}</p>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Contact */}
        <section className="mx-auto grid w-full max-w-7xl gap-10 px-6 pb-24 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-xs tracking-wider text-sage uppercase">
                Connect with the collective
              </h2>
              <p className="font-heading text-2xl tracking-tight sm:text-3xl">
                Reach the valley team
              </p>
            </div>

            <ul className="flex flex-col">
              {[
                { Icon: MapPin, label: contact.address, href: mapsHref },
                { Icon: Phone, label: contact.phone, href: `tel:${contact.phone.replace(/\s/g, "")}` },
                { Icon: Mail, label: contact.email, href: `mailto:${contact.email}` },
              ].map((row) => (
                <li
                  key={row.label}
                  className="flex items-center gap-3 border-b border-border py-4 first:border-t"
                >
                  <row.Icon className="size-4 shrink-0 text-sage" aria-hidden />
                  <Link
                    href={row.href}
                    className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    {row.label}
                  </Link>
                </li>
              ))}
            </ul>

            <Button
              variant="outline"
              className="w-fit rounded-full px-6"
              asChild
            >
              <Link href={mapsHref}>Find our store on Google Maps</Link>
            </Button>

            <div className="rounded-xl border border-border bg-card/40 p-5">
              <h3 className="text-xs tracking-wider text-sage uppercase">
                Valley dispatch radius
              </h3>
              <ul className="mt-3 flex flex-col gap-1.5">
                {deliveryZones.slice(0, 3).map((zone) => (
                  <li
                    key={zone.area}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="text-muted-foreground">{zone.area}</span>
                    <span className="text-sage">{zone.estimate}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-xs tracking-wider text-sage uppercase">
                Send an enquiry
              </h2>
              <p className="text-sm text-muted-foreground">
                Fill this in and it opens WhatsApp with your details ready to
                send.
              </p>
            </div>

            <WhatsAppEnquiry number={whatsappNumber} recipient="Local Organic Mart" />
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
