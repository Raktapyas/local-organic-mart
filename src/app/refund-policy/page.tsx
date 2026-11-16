import { PolicyPage, policyMetadata } from "@/components/policy-page";
import { refundPolicy } from "@/lib/data";
import { contentNe } from "@/lib/i18n/content-ne";

export const metadata = policyMetadata("Refund Policy");

export default function RefundPolicyPage() {
  return (
    <PolicyPage
      title="Refund policy"
      titleNe="फिर्ता नीति"
      subline="How returns and refunds are handled for Valley deliveries."
      sublineNe="उपत्यका डेलिभरीमा फिर्ता र रकम फिर्ता कसरी हुन्छ।"
      sections={refundPolicy}
      sectionsNe={contentNe.refundPolicy}
    />
  );
}
