import type { Metadata } from "next";
import {
  BadgePercent,
  Check,
  Clock,
  Gift,
  Headset,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  membershipBenefits,
  membershipFaqs,
  membershipPlan,
  type MembershipIconName,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "Membership — Local Organic Mart",
  description:
    "One membership across the Mart and the Restaurant: 10% off provisions, reward points on every order, and early access to deal windows.",
};

const benefitIcons: Record<MembershipIconName, LucideIcon> = {
  percent: BadgePercent,
  stars: Star,
  clock: Clock,
  truck: Truck,
  gift: Gift,
  headset: Headset,
};

const npr = new Intl.NumberFormat("en-NP");

export default function MembershipPage() {
  return (
    <>

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-6 pt-20 pb-16 text-center">
          <span className="inline-flex size-12 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold">
            <Sparkles className="size-6" aria-hidden />
          </span>
          <h1 className="text-4xl tracking-tight text-balance sm:text-5xl md:text-6xl">
            One membership. Every reward.
          </h1>
          <p className="max-w-xl text-base text-sage">
            10% off Mart items, reward points and early access to big deals.
          </p>
        </section>

        {/* Benefits */}
        <section className="mx-auto w-full max-w-7xl px-6 pb-20">
          <div className="flex flex-col gap-3 text-center">
            <h2 className="text-xs tracking-wider text-sage uppercase">
              Curated privileges
            </h2>
            <p className="max-w-xl mx-auto text-sm text-muted-foreground">
              Six benefits that apply the moment your membership is active.
            </p>
          </div>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {membershipBenefits.map((benefit) => {
              const Icon = benefitIcons[benefit.icon];
              return (
                <li
                  key={benefit.title}
                  className="flex flex-col gap-3 rounded-xl border border-border bg-card/40 p-6"
                >
                  <span className="inline-flex size-9 items-center justify-center rounded-full border border-gold/40 text-gold">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <h3 className="font-heading text-base leading-tight">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{benefit.note}</p>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Pricing */}
        <section className="mx-auto w-full max-w-3xl px-6 pb-20">
          {/* TODO: the membership API owns pricing, activation and billing.
              Both figures below are static until then. */}
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-gold/40 bg-card p-8 text-center sm:p-10">
            <div>
              <h2 className="font-heading text-2xl tracking-tight">
                {membershipPlan.name}
              </h2>
              <p className="mt-1 text-sm text-sage">{membershipPlan.blurb}</p>
            </div>

            <p className="flex items-baseline gap-1.5">
              <span className="font-heading text-5xl tracking-tight">
                Rs {npr.format(membershipPlan.price)}
              </span>
              <span className="text-sm text-sage">/ year</span>
            </p>

            <ul className="flex w-full flex-col gap-2.5 text-left">
              {membershipPlan.includes.map((line) => (
                <li key={line} className="flex items-start gap-2.5 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
                  <span className="text-muted-foreground">{line}</span>
                </li>
              ))}
            </ul>

            <Button className="h-12 w-full rounded-full px-8 bg-gold text-background hover:bg-gold/90">
              Join membership
            </Button>

            <p className="text-xs text-muted-foreground">
              Effective Rs {npr.format(membershipPlan.monthlyEquivalent)}/mo, or{" "}
              <span className="text-sage">
                Rs {npr.format(membershipPlan.monthlyPrice)} / month
              </span>{" "}
              paid monthly.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto w-full max-w-3xl px-6 pb-24">
          <div className="flex flex-col gap-3">
            <h2 className="text-xs tracking-wider text-sage uppercase">
              Frequently asked questions
            </h2>
            <p className="text-sm text-muted-foreground">
              Everything you need to know about the membership.
            </p>
          </div>

          <Accordion type="single" collapsible className="mt-6">
            {membershipFaqs.map((faq) => (
              <AccordionItem key={faq.question} value={faq.question}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
