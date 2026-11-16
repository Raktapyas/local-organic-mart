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
import { L } from "@/components/localized-text";
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
import { contentNe } from "@/lib/i18n/content-ne";

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
          <span className="inline-flex size-12 items-center justify-center rounded-[2px] border border-gold/40 bg-gold/10 text-gold">
            <Sparkles className="size-6" aria-hidden />
          </span>
          <h1 className="text-4xl tracking-tight text-balance sm:text-5xl md:text-6xl">
            <L
              en="One membership. Every reward."
              ne="एक सदस्यता। हरेक लाभ।"
            />
          </h1>
          <p className="max-w-xl text-base text-sage">
            <L
              en="10% off Mart items, reward points and early access to big deals."
              ne="मार्टका सामानमा 10% छुट, रिवार्ड अंक र मुख्य अफरमा प्राथमिक पहुँच।"
            />
          </p>
        </section>

        {/* Benefits */}
        <section className="mx-auto w-full max-w-7xl px-6 pb-20">
          <div className="flex flex-col gap-3 text-center">
            <h2 className="text-xs tracking-wider text-sage uppercase">
              <L en="Curated privileges" ne="छानिएका विशेषाधिकार" />
            </h2>
            <p className="max-w-xl mx-auto text-sm text-muted-foreground">
              <L
                en="Six benefits that apply the moment your membership is active."
                ne="सदस्यता सक्रिय भएपछि लागू हुने छ वटा लाभ।"
              />
            </p>
          </div>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {membershipBenefits.map((benefit, index) => {
              const Icon = benefitIcons[benefit.icon];
              const ne = contentNe.membership.benefits[index];
              return (
                <li
                  key={benefit.title}
                  className="flex flex-col gap-3 rounded-[2px] border border-border bg-card/40 p-6"
                >
                  <span className="inline-flex size-9 items-center justify-center rounded-[2px] border border-gold/40 text-gold">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <h3 className="font-heading text-base leading-tight">
                    <L en={benefit.title} ne={ne?.title ?? benefit.title} />
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    <L en={benefit.note} ne={ne?.note ?? benefit.note} />
                  </p>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Pricing */}
        <section className="mx-auto w-full max-w-3xl px-6 pb-20">
          {/* TODO: the membership API owns pricing, activation and billing.
              Both figures below are static until then. */}
          <div className="flex flex-col items-center gap-6 rounded-[2px] border border-gold/40 bg-card p-8 text-center sm:p-10">
            <div>
              <h2 className="font-heading text-2xl tracking-tight">
                <L
                  en={membershipPlan.name}
                  ne={contentNe.membership.planName}
                />
              </h2>
              <p className="mt-1 text-sm text-sage">
                <L
                  en={membershipPlan.blurb}
                  ne={contentNe.membership.blurb}
                />
              </p>
            </div>

            <p className="flex items-baseline gap-1.5">
              <span className="font-heading text-5xl tracking-tight">
                <L
                  en={`Rs ${npr.format(membershipPlan.price)}`}
                  ne={`रु ${npr.format(membershipPlan.price)}`}
                />
              </span>
              <span className="text-sm text-sage">
                <L en="/ year" ne="/ वर्ष" />
              </span>
            </p>

            <ul className="flex w-full flex-col gap-2.5 text-left">
              {membershipPlan.includes.map((line, index) => (
                <li key={line} className="flex items-start gap-2.5 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
                  <span className="text-muted-foreground">
                    <L
                      en={line}
                      ne={contentNe.membership.includes[index] ?? line}
                    />
                  </span>
                </li>
              ))}
            </ul>

            <Button className="h-12 w-full rounded-[2px] px-8 bg-gold text-background hover:bg-gold/90">
              <L en="Join membership" ne="सदस्यता लिनुहोस्" />
            </Button>

            <p className="text-xs text-muted-foreground">
              <L
                en={`Effective Rs ${npr.format(membershipPlan.monthlyEquivalent)}/mo, or`}
                ne={`प्रभावी रु ${npr.format(membershipPlan.monthlyEquivalent)}/महिना, वा`}
              />{" "}
              <span className="text-sage">
                <L
                  en={`Rs ${npr.format(membershipPlan.monthlyPrice)} / month`}
                  ne={`रु ${npr.format(membershipPlan.monthlyPrice)} / महिना`}
                />
              </span>{" "}
              <L en="paid monthly." ne="मासिक भुक्तानी।" />
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto w-full max-w-3xl px-6 pb-24">
          <div className="flex flex-col gap-3">
            <h2 className="text-xs tracking-wider text-sage uppercase">
              <L
                en="Frequently asked questions"
                ne="बारम्बार सोधिने प्रश्न"
              />
            </h2>
            <p className="text-sm text-muted-foreground">
              <L
                en="Everything you need to know about the membership."
                ne="सदस्यताबारे जान्नुपर्ने सबै कुरा।"
              />
            </p>
          </div>

          <Accordion type="single" collapsible className="mt-6">
            {membershipFaqs.map((faq, index) => {
              const ne = contentNe.membership.faqs[index];
              return (
                <AccordionItem key={faq.question} value={faq.question}>
                  <AccordionTrigger className="text-left">
                    <L en={faq.question} ne={ne?.question ?? faq.question} />
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    <L en={faq.answer} ne={ne?.answer ?? faq.answer} />
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
