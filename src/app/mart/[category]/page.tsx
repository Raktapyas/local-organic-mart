import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { MartView } from "@/components/mart-view";
import { SiteFooter } from "@/components/site-footer";
import { categoryBySlug, martCategories, productsInCategory } from "@/lib/data";

/**
 * `/mart/[category]` — one department of the Mart.
 *
 * Only the categories in `generateStaticParams` are built; unknown slugs are
 * rejected by the `notFound()` call in the body, which renders the branded
 * "Lost in the valley." page from `src/app/not-found.tsx`.
 *
 * `dynamicParams = false` would express this directly, but it is not available
 * while Cache Components is enabled (next.config.ts), so the guard below plus
 * the `/mart/:category` entry in `src/proxy.ts` is what returns the 404.
 *
 * The page itself never awaits `params`. With Cache Components and Partial
 * Prefetching, the route's App Shell is shared by every link, so touching URL
 * data in the page body ties the shell to one URL and Next rejects it. The
 * promise is handed to `CategoryBody` instead, whose `await` suspends inside
 * the boundary below while the chrome paints immediately.
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

export default function MartCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  return (
    <>
      <main className="flex flex-1 flex-col">
        <Suspense fallback={<MartCategorySkeleton />}>
          <CategoryBody params={params} />
        </Suspense>
      </main>

      <SiteFooter />
    </>
  );
}

async function CategoryBody({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = categoryBySlug(slug);

  if (!category) notFound();

  return (
    <MartView
      items={productsInCategory(category.id)}
      categoryId={category.id}
      categoryName={category.name}
      categoryNote={category.note}
    />
  );
}

/** Holds the first screen while `params` resolves. */
function MartCategorySkeleton() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 pt-12 pb-8" aria-hidden>
      <div className="flex flex-col gap-3">
        <div className="h-9 w-64 rounded-[2px] bg-muted" />
        <div className="h-4 w-80 max-w-full rounded-[2px] bg-muted" />
      </div>
      <div className="mt-8 h-11 w-full max-w-xl rounded-[2px] bg-muted" />
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-72 rounded-[2px] border border-border bg-card/40"
          />
        ))}
      </div>
    </section>
  );
}
