import type { Metadata } from "next";

import { L } from "@/components/localized-text";
import { SectionHeader } from "@/components/section-header";
import { SiteFooter } from "@/components/site-footer";

export interface PolicySection {
  heading: string;
  body: string;
}

/**
 * Shared body for the two policy pages. They are structurally identical —
 * a title and a short list of headed paragraphs — so only their copy differs,
 * and that copy lives in `data.ts`.
 */
export function PolicyPage({
  title,
  titleNe,
  subline,
  sublineNe,
  sections,
  sectionsNe,
}: {
  title: string;
  titleNe?: string;
  subline: string;
  sublineNe?: string;
  sections: readonly PolicySection[];
  sectionsNe?: readonly PolicySection[];
}) {
  return (
    <>
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-20">
        <SectionHeader
          as="h1"
          title={title}
          titleNe={titleNe}
          subline={subline}
          sublineNe={sublineNe}
        />

        <div className="mt-12 flex flex-col gap-8">
          {sections.map((section, index) => {
            const ne = sectionsNe?.[index];
            return (
              <section key={section.heading} className="flex flex-col gap-2">
                <h2 className="font-heading text-lg tracking-tight">
                  <L en={section.heading} ne={ne?.heading ?? section.heading} />
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  <L en={section.body} ne={ne?.body ?? section.body} />
                </p>
              </section>
            );
          })}
        </div>

        {/* TODO: legal review. Neither policy is in force; both are sample
            copy written to show the layout. */}
        <p className="mt-14 border-t border-border pt-6 text-xs text-sage">
          <L
            en="Sample copy for layout only — this policy has not been through legal review and is not yet in force."
            ne="लेआउटका लागि मात्र नमुना भाषा — यो नीति कानुनी समीक्षाबाट गएको छैन र अझै लागू भएको छैन।"
          />
        </p>
      </main>

      <SiteFooter />
    </>
  );
}

export function policyMetadata(title: string): Metadata {
  return { title: `${title} — Local Organic Mart` };
}
