import type { Metadata } from "next";
import PortalShell from "@/components/portal/PortalShell";
import ClientDashboard, {
  DEFAULT_CLIENT_ID,
} from "@/components/portal/ClientDashboard";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Client portal",
  description: "Your appointments, your history and your loc journey.",
  robots: { index: false, follow: false },
};

/**
 * `?as=<clientId>` picks which demo client the portal opens as, so the demo
 * switcher can show a brand-new starter client and a three-year client rather
 * than one loc stage over and over. Read on the server and validated against
 * the demo store, so an unknown id falls back rather than throwing.
 *
 * This is not authentication and is not a step toward it. When real accounts
 * exist the client comes from the session and this parameter is deleted.
 */
export default async function ClientPortalPage({
  searchParams,
}: {
  searchParams: Promise<{ as?: string }>;
}) {
  const { as } = await searchParams;
  const clientId = db.client(as ?? "") ? as! : DEFAULT_CLIENT_ID;

  return (
    <PortalShell side="client" clientId={clientId}>
      <ClientDashboard clientId={clientId} />
    </PortalShell>
  );
}
