import { PolicyPage, policyMetadata } from "@/components/policy-page";
import { refundPolicy } from "@/lib/data";

export const metadata = policyMetadata("Refund Policy");

export default function RefundPolicyPage() {
  return (
    <PolicyPage
      title="Refund policy"
      subline="How returns and refunds are handled for Valley deliveries."
      sections={refundPolicy}
    />
  );
}
