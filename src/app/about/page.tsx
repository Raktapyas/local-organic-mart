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
import { L } from "@/components/localized-text";
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
import { farmerText } from "@/lib/i18n/localize";
import { contentNe } from "@/lib/i18n/content-ne";

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

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-6 pt-20 pb-16 text-center">
          <h1 className="text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl md:text-6xl">
            <L en={aboutHero.headline} ne={contentNe.about.headline} />
          </h1>
          <p className="max-w-2xl text-base text-sage">
            <L en={aboutHero.subline} ne={contentNe.about.subline} />
          </p>
        </section>

        {/* Story row */}
        <section className="mx-auto grid w-full max-w-7xl items-center gap-10 px-6 pb-20 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-xs tracking-wider text-sage uppercase">
                <L en="Our living principles" ne="हाम्रा जीवन्त सिद्धान्त" />
              </h2>
              <p className="font-heading text-2xl tracking-tight sm:text-3xl">
                <L
                  en="Agricultural integrity, without compromise"
                  ne="कृषि इमानदारी, कुनै सम्झौताविना"
                />
              </p>
            </div>

            {/* One line per collective, read straight from the farmer table —
                no coalition is named here that is not in `farmers`. */}
            <ul className="flex flex-col gap-5">
              {farmers.map((farmer) => {
                const ne = farmerText(farmer, "ne");
                return (
                  <li
                    key={farmer.id}
                    className="border-l border-gold/40 pl-5"
                  >
                    <p className="font-heading text-base">
                      <L en={farmer.name} ne={ne.name} />
                    </p>
                    <p className="mt-0.5 text-xs text-sage">
                      <L
                        en={`${farmer.location} · ${farmer.elevation}`}
                        ne={`${ne.location} · ${ne.elevation}`}
                      />
                    </p>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      <L en={farmer.story} ne={ne.story} />
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2px] bg-muted">
            <Image
              src={heroImage}
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </section>

        {/* Values */}
        <section className="mx-auto w-full max-w-7xl px-6 pb-20">
          <ul className="grid gap-4 md:grid-cols-3">
            {aboutValues.map((value, index) => {
              const Icon = valueIcons[value.icon];
              const ne = contentNe.about.values[index];
              return (
                <li
                  key={value.title}
                  className="flex flex-col gap-3 rounded-[2px] border border-border bg-card/40 p-6"
                >
                  <span className="inline-flex size-9 items-center justify-center rounded-[2px] border border-gold/40 text-gold">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <h3 className="font-heading text-base leading-tight">
                    <L en={value.title} ne={ne?.title ?? value.title} />
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    <L en={value.note} ne={ne?.note ?? value.note} />
                  </p>
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
                <L en="Connect with the collective" ne="समूहसँग जोडिनुहोस्" />
              </h2>
              <p className="font-heading text-2xl tracking-tight sm:text-3xl">
                <L en="Reach the valley team" ne="उपत्यका टोलीसँग सम्पर्क" />
              </p>
            </div>

            <ul className="flex flex-col">
              {[
                {
                  Icon: MapPin,
                  label: contact.address,
                  labelNe: "काठमाडौं, नेपाल",
                  href: mapsHref,
                },
                {
                  Icon: Phone,
                  label: contact.phone,
                  labelNe: contact.phone,
                  href: `tel:${contact.phone.replace(/\s/g, "")}`,
                },
                {
                  Icon: Mail,
                  label: contact.email,
                  labelNe: contact.email,
                  href: `mailto:${contact.email}`,
                },
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
                    <L en={row.label} ne={row.labelNe} />
                  </Link>
                </li>
              ))}
            </ul>

            <Button
              variant="outline"
              className="w-fit rounded-[2px] px-6"
              asChild
            >
              <Link href={mapsHref}>
                <L
                  en="Find our store on Google Maps"
                  ne="गुगल म्यापमा हाम्रो स्टोर खोज्नुहोस्"
                />
              </Link>
            </Button>

            <div className="rounded-[2px] border border-border bg-card/40 p-5">
              <h3 className="text-xs tracking-wider text-sage uppercase">
                <L en="Valley dispatch radius" ne="उपत्यका पठाउने क्षेत्र" />
              </h3>
              <ul className="mt-3 flex flex-col gap-1.5">
                {deliveryZones.slice(0, 3).map((zone, index) => {
                  const ne = contentNe.deliveryZones[index];
                  return (
                    <li
                      key={zone.area}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <span className="text-muted-foreground">
                        <L en={zone.area} ne={ne?.area ?? zone.area} />
                      </span>
                      <span className="text-sage">
                        <L en={zone.estimate} ne={ne?.estimate ?? zone.estimate} />
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-xs tracking-wider text-sage uppercase">
                <L en="Send an enquiry" ne="सोधपुछ पठाउनुहोस्" />
              </h2>
              <p className="text-sm text-muted-foreground">
                <L
                  en="Fill this in and it opens WhatsApp with your details ready to send."
                  ne="यो भर्नुहोस् — विवरण तयार भएर WhatsApp खुल्छ।"
                />
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
