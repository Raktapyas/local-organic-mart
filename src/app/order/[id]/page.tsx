import { Suspense } from "react";

import { OrderConfirmation } from "@/components/order-confirmation";
import { SiteFooter } from "@/components/site-footer";

export const metadata = {
  title: "Order confirmed — Local Organic Mart",
};

/**
 * This page is client-driven by nature: the order reference comes from the
 * route and must be matched against `lastOrder`, which lives only in the
 * client store. Neither can be read while prerendering, so the confirmation
 * renders inside Suspense and the shell stays static.
 */
export default function OrderPage() {
  return (
    <>

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-12 pb-24">
        <Suspense
          fallback={
            <p className="py-24 text-center text-sm text-sage">
              Loading your order&hellip;
            </p>
          }
        >
          <OrderConfirmation />
        </Suspense>
      </main>

      <SiteFooter />
    </>
  );
}