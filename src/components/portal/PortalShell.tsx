"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarDays, UserRound, ShieldCheck, LogOut } from "lucide-react";
import { Butterfly, Wordmark } from "@/components/marks/Marks";
import { Badge, cn } from "@/components/ui";

/**
 * Shared chrome for both portal sides.
 *
 * Role separation is real here even in demo mode: the client side can only ever
 * see one client's data, and the owner side is the only place revenue, the full
 * client list or price confirmation appears. That boundary is what has to
 * survive into a real backend, so it is drawn in the routing, not in a toggle.
 */

/**
 * Both sides are a single scrolling page, so the nav jumps to sections rather
 * than to routes that do not exist. Anything that links somewhere must actually
 * go there — a dead nav item in a client demo is worse than no nav item.
 */
const CLIENT_NAV = [
  { href: "/portal/client", hash: "", label: "Overview", icon: LayoutDashboard },
  { href: "/portal/client", hash: "#journey-h", label: "My loc journey", icon: CalendarDays },
  { href: "/book", hash: "", label: "Book again", icon: UserRound },
];

const OWNER_NAV = [
  { href: "/portal/owner", hash: "", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/owner", hash: "#clients-h", label: "Clients", icon: UserRound },
  { href: "/portal/owner", hash: "#menu-h", label: "Menu + prices", icon: ShieldCheck },
];

export default function PortalShell({
  side,
  children,
}: {
  side: "client" | "owner";
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const nav = side === "client" ? CLIENT_NAV : OWNER_NAV;

  return (
    <div className="studio grain min-h-screen">
      <div className="container-page py-10 lg:py-14">
        {/* Demo banner — never let anyone mistake this for live data. */}
        <p className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-pill border border-honey-lite/30 bg-honey-lite/[0.08] px-5 py-3 text-sm text-bone-dim">
          <Badge tone="rose">Demo</Badge>
          <span>
            Sample data, held in memory for this visit only. No real client
            information is stored, and nothing here charges anyone.
          </span>
        </p>

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          <aside className="shrink-0 lg:w-56">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <Butterfly px={28} neon className="size-7 text-rose-lite" />
              <Wordmark className="text-lg text-bone" />
            </Link>

            <p className="mt-6 text-eyebrow font-bold uppercase text-honey-lite">
              {side === "client" ? "Client portal" : "Owner portal"}
            </p>

            <nav aria-label={`${side} portal`} className="mt-4">
              <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
                {nav.map((item) => {
                  const active = pathname === item.href && !item.hash;
                  const Icon = item.icon;
                  return (
                    <li key={item.label}>
                      <Link
                        href={`${item.href}${item.hash}`}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "inline-flex min-h-11 items-center gap-2.5 rounded-pill px-4 text-sm font-semibold transition-colors lg:w-full",
                          active
                            ? "bg-rose-lite text-studio"
                            : "text-bone-dim hover:bg-studio-2 hover:text-bone"
                        )}
                      >
                        <Icon className="size-4" aria-hidden />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <Link
              href="/portal"
              className="mt-8 inline-flex min-h-11 items-center gap-2.5 rounded-pill px-4 text-sm font-semibold text-bone-dim transition-colors hover:text-bone"
            >
              <LogOut className="size-4" aria-hidden />
              Switch role
            </Link>
          </aside>

          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
