import { PolicyPage, policyMetadata } from "@/components/policy-page";
import { privacyPolicy } from "@/lib/data";
import { contentNe } from "@/lib/i18n/content-ne";

export const metadata = policyMetadata("Privacy Policy");

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      title="Privacy policy"
      titleNe="गोपनीयता नीति"
      subline="What this site holds about you, and for how long."
      sublineNe="यो साइटले तपाईंबारे के राख्छ, र कति समयसम्म।"
      sections={privacyPolicy}
      sectionsNe={contentNe.privacyPolicy}
    />
  );
}
