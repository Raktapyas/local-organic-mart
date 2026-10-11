import { NextResponse, type NextRequest } from "next/server";

import { categoryBySlug, dishBySlug, productBySlug } from "@/lib/data";

/**
 * Reject unknown product, dish, and Mart category slugs before the response
 * body streams.
 *
 * With Cache Components enabled a streamed page starts with a `200`, so a
 * `notFound()` raised during render only produces a soft 404. Checking the
 * slug here returns a real `404` status. (`dynamicParams = false` is not
 * available while Cache Components is on.)
 *
 * Each branch rewrites to `/_not-found` rather than answering with an empty
 * body, so an unknown slug gets the branded "Lost in the valley." page *and*
 * the correct status. The pages' own `notFound()` calls remain as the
 * in-render fallback for requests that do not match the matcher.
 */
export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/").filter(Boolean)[1];
  if (!slug) return NextResponse.next();

  const segments = request.nextUrl.pathname.split("/").filter(Boolean);
  const [root, second] = segments;

  const notFound = () =>
    NextResponse.rewrite(new URL("/_not-found", request.url), { status: 404 });

  if (root === "product" && !productBySlug(slug)) {
    return notFound();
  }

  if (root === "restaurant" && second && !dishBySlug(slug)) {
    return notFound();
  }

  if (root === "mart" && second && !categoryBySlug(second)) {
    return notFound();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/product/:slug", "/restaurant/:slug", "/mart/:category"],
};
