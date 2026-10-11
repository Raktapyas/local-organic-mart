import { NextResponse, type NextRequest } from "next/server";

import { dishBySlug, productBySlug } from "@/lib/data";

/**
 * Reject unknown product and dish slugs before the response body streams.
 *
 * With Cache Components enabled a streamed page starts with a `200`, so a
 * `notFound()` raised during render only produces a soft 404. Checking the
 * slug here returns a real `404` status. (`dynamicParams = false` is not
 * available while Cache Components is on.)
 */
export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/").filter(Boolean)[1];
  if (!slug) return NextResponse.next();

  const segments = request.nextUrl.pathname.split("/").filter(Boolean);
  const [root, second] = segments;

  if (root === "product" && !productBySlug(slug)) {
    return new NextResponse(null, { status: 404 });
  }

  if (root === "restaurant" && second && !dishBySlug(slug)) {
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/product/:slug", "/restaurant/:slug"],
};