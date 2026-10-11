import { BagView } from "@/components/bag-view";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata = {
  title: "Your bag — Local Organic Mart",
  description: "Review your bag before checkout.",
};

export default function BagPage() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-12 pb-24">
        <h1 className="sr-only">Your bag</h1>
        <BagView />
      </main>

      <SiteFooter />
    </>
  );
}