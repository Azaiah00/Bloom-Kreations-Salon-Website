import type { Metadata } from "next";
import PortalShell from "@/components/portal/PortalShell";
import OwnerDashboard from "@/components/portal/OwnerDashboard";

export const metadata: Metadata = {
  title: "Owner portal",
  description: "The book, the money and the menu.",
  robots: { index: false, follow: false },
};

export default function OwnerPortalPage() {
  return (
    <PortalShell side="owner">
      <OwnerDashboard />
    </PortalShell>
  );
}
