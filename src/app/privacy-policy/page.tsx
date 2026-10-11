import { PolicyPage, policyMetadata } from "@/components/policy-page";
import { privacyPolicy } from "@/lib/data";

export const metadata = policyMetadata("Privacy Policy");

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      title="Privacy policy"
      subline="What this site holds about you, and for how long."
      sections={privacyPolicy}
    />
  );
}
