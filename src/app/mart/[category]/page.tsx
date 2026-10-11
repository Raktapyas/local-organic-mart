import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MartView } from "@/components/mart-view";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { categoryBySlug, martCategories } from "@/lib/data";

/**
 * `/mart/[category]` — one department of the Mart.
 *
 * Only the categories in `generateStaticParams` are built; unknown slugs are
 * rejected by the `notFound()` call below, which renders the branded
 * "Lost in the valley." page from `src/app/not-found.tsx`.
 *
 * `dynamicParams = false` would express this directly, but it is not available
 * while Cache Components is enabled (next.config.ts), so the guard below plus
 * the `/mart/:category` entry in `src/proxy.ts` is what returns the 404.
 */

/** Prerender every Mart department at build time. */
export function generateStaticParams() {
  return martCategories.map((category) => ({ category: category.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = categoryBySlug(slug);
  if (!category) return { title: "Lost in the valley — Local Organic Mart" };
  return {
    title: `${category.name} — Local Organic Mart`,
    description: category.note,
  };
}

export default async function MartCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = categoryBySlug(slug);

  if (!category) notFound();

  return (
    <>
      <SiteHeader />

      <main className="flex flex-1 flex-col">
        <MartView
          categoryId={category.id}
          categoryName={category.name}
          categoryNote={category.note}
        />
      </main>

      <SiteFooter />
    </>
  );
}
