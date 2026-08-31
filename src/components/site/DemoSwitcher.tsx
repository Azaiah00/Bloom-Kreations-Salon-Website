"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  UserRound,
  CalendarPlus,
  LayoutGrid,
  X,
  ChevronRight,
} from "lucide-react";
import { Butterfly } from "@/components/marks/Marks";
import { db, stage } from "@/lib/db";
import { cn } from "@/components/ui";

/**
 * The demo switcher.
 *
 * There is no authentication yet, so there is no sign-in screen to walk a
 * client through — and hunting for URLs in front of her would be worse than
 * either. This puts every demo entry point one tap away in the corner the
 * Next.js dev badge used to occupy (`devIndicators: false` in next.config.ts).
 *
 * It shows the OWNER side and each CLIENT at a different loc stage, because
 * "the client portal" looks like four different products depending on whether
 * someone is one month or three years into their locs, and that difference is
 * the thing worth showing.
 *
 * Deliberately not hidden behind an env flag: this build IS the demo. When
 * real accounts land, delete this component and its mount in the layout — it
 * touches nothing else.
 */

interface Entry {
  href: string;
  label: string;
  detail: string;
  icon: typeof UserRound;
}

const OWNER: Entry = {
  href: "/portal/owner",
  label: "Owner dashboard",
  detail: "Her week, revenue, clients, prices",
  icon: ShieldCheck,
};

const EXTRAS: Entry[] = [
  {
    href: "/portal",
    label: "Role picker",
    detail: "The screen offering both sides",
    icon: LayoutGrid,
  },
  {
    href: "/book",
    label: "Booking flow",
    detail: "What a new client does, signed out",
    icon: CalendarPlus,
  },
];

export default function DemoSwitcher() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const close = () => setOpen(false);

  // Client entries are built from the demo store rather than hardcoded, so a
  // client added to db.ts shows up here without anyone remembering to.
  const clients = db.clients();

  // Escape closes, and focus goes back to the button it came from. Clicking
  // outside closes too — this floats over her site and must never trap her.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !buttonRef.current?.contains(t)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  // Navigating is the point of every link in here, so the panel closes on the
  // click that navigates — NOT by watching the pathname. Unmounting the panel
  // in the same render that swaps the route makes React and the router fight
  // over the same DOM node, and the route change dies with a removeChild
  // NotFoundError. Closing in the event handler runs before the transition.

  return (
    <div className="no-print fixed bottom-4 left-4 z-[60] print:hidden">
      {/* Always mounted, toggled with `hidden`. Unmounting this subtree on the
          click that navigates makes React and the App Router race for the same
          DOM nodes, and the route change dies with a removeChild NotFoundError
          — reproduced on every entry in this panel before the fix. `hidden`
          takes it out of the accessibility tree and the tab order without
          removing anything. */}
      <div
        ref={panelRef}
        id={panelId}
        hidden={!open}
        className="mb-3 w-[min(21rem,calc(100vw-2rem))] origin-bottom-left overflow-hidden rounded-card border border-copper/40 bg-studio-2 shadow-[0_24px_60px_-20px_rgb(0_0_0_/_0.7)] motion-safe:animate-[demo-pop_.22s_var(--ease-out-soft)]"
        role="dialog"
        aria-label="Demo sign-ins"
      >
        <div className="flex items-start justify-between gap-3 border-b border-copper/30 px-5 py-3.5">
            <div>
              <p className="text-eyebrow font-bold uppercase tracking-[0.18em] text-rose-lite">
                Demo sign-ins
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-bone-dim">
                No accounts yet. Every screen below runs on sample data held in
                memory for this visit.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                close();
                buttonRef.current?.focus();
              }}
              aria-label="Close demo sign-ins"
              className="-mr-1.5 -mt-1 inline-flex size-11 shrink-0 items-center justify-center rounded-pill text-bone-dim transition-colors hover:bg-studio hover:text-bone"
            >
              <X className="size-4" aria-hidden />
            </button>
        </div>

        <div className="max-h-[min(34rem,68vh)] overflow-y-auto overscroll-contain px-2.5 py-2.5">
            <Group title="Owner">
              <Row
                entry={OWNER}
                active={pathname === OWNER.href}
                onNavigate={close}
              />
            </Group>

            <Group title="Client, by loc stage">
              {clients.map((c) => (
                <Row
                  key={c.id}
                  entry={{
                    href: `/portal/client?as=${c.id}`,
                    label: c.name,
                    detail: `${stage(c.stage).name} stage · ${c.loyaltyVisits} visit${
                      c.loyaltyVisits === 1 ? "" : "s"
                    }`,
                    icon: UserRound,
                  }}
                  initials={c.avatarInitials}
                  onNavigate={close}
                />
              ))}
            </Group>

            <Group title="Signed out">
              {EXTRAS.map((e) => (
                <Row
                  key={e.href}
                  entry={e}
                  active={pathname === e.href}
                  onNavigate={close}
                />
              ))}
            </Group>
        </div>
      </div>

      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        className={cn(
          "inline-flex min-h-11 items-center gap-2.5 rounded-pill border px-4 py-2.5",
          "text-sm font-bold tracking-tight shadow-[0_10px_30px_-12px_rgb(0_0_0_/_0.6)]",
          "transition-colors duration-200 ease-[var(--ease-out-soft)]",
          open
            ? "border-rose-lite bg-rose-lite text-studio"
            : "border-copper/50 bg-studio-2 text-bone hover:border-rose-lite hover:text-rose-lite"
        )}
      >
        <Butterfly px={18} className="size-[18px] shrink-0" />
        Demo
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-1 pb-1.5 pt-2 first:pt-0">
      <p className="px-2.5 pb-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-honey-lite">
        {title}
      </p>
      <ul className="flex flex-col gap-0.5">{children}</ul>
    </div>
  );
}

function Row({
  entry,
  active,
  initials,
  onNavigate,
}: {
  entry: Entry;
  active?: boolean;
  initials?: string;
  onNavigate: () => void;
}) {
  const Icon = entry.icon;
  return (
    <li>
      <Link
        href={entry.href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={cn(
          "group flex min-h-14 items-center gap-3 rounded-card px-2.5 py-2 transition-colors",
          active
            ? "bg-rose-lite/[0.14] text-bone"
            : "text-bone-dim hover:bg-studio hover:text-bone"
        )}
      >
        <span
          className={cn(
            "inline-flex size-9 shrink-0 items-center justify-center rounded-pill text-xs font-bold",
            active
              ? "bg-rose-lite text-studio"
              : "bg-honey-lite/[0.12] text-honey-lite"
          )}
          aria-hidden
        >
          {initials ?? <Icon className="size-4" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-bone">
            {entry.label}
          </span>
          <span className="block truncate text-xs text-bone-dim">{entry.detail}</span>
        </span>
        <ChevronRight
          className="size-4 shrink-0 text-copper transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-rose-lite"
          aria-hidden
        />
      </Link>
    </li>
  );
}
