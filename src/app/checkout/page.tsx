import { CheckoutFlow } from "@/components/checkout-flow";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata = {
  title: "Checkout — Local Organic Mart",
  description: "Confirm your address, delivery slot, and payment method.",
};

export default function CheckoutPage() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-12 pb-24">
        <h1 className="sr-only">Checkout</h1>
        <CheckoutFlow />
      </main>

      <SiteFooter />
    </>
  );
}