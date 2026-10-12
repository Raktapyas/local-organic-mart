import { MartView } from "@/components/mart-view";
import { SiteFooter } from "@/components/site-footer";

export default function MartPage() {
  return (
    <>

      <main className="flex flex-1 flex-col">
        <MartView />
      </main>

      <SiteFooter />
    </>
  );
}
