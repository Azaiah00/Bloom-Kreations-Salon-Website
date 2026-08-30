import type { Metadata } from "next";
import PortalShell from "@/components/portal/PortalShell";
import ClientDashboard from "@/components/portal/ClientDashboard";

export const metadata: Metadata = {
  title: "Client portal",
  description: "Your appointments, your history and your loc journey.",
  robots: { index: false, follow: false },
};

export default function ClientPortalPage() {
  return (
    <PortalShell side="client">
      <ClientDashboard />
    </PortalShell>
  );
}
