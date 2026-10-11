import { MartView } from "@/components/mart-view";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function MartPage() {
  return (
    <>
      <SiteHeader />

      <main className="flex flex-1 flex-col">
        <MartView />
      </main>

      <SiteFooter />
    </>
  );
}
