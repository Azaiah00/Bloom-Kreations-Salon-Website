import type { Metadata } from "next";
import Link from "next/link";
import { UserRound, ShieldCheck, ArrowRight, Info } from "lucide-react";
import { Butterfly } from "@/components/marks/Marks";
import { Badge, Eyebrow } from "@/components/ui";

export const metadata: Metadata = {
  title: "Portal",
  description:
    "The Bloom Kreations client and owner portal — a working demo on sample data.",
  robots: { index: false, follow: false },
};

/**
 * Role picker. Fake auth by design: the point of the demo is to show Latesha
 * both sides of the product without inventing an account system she has not
 * agreed to.
 */

const ROLES = [
  {
    href: "/portal/client",
    icon: UserRound,
    title: "Client",
    who: "What your clients would see",
    points: [
      "Their next appointment, with the finish time",
      "Every past visit and what it cost",
      "A photo timeline of their whole loc journey",
      "Rebooking the same service in two taps",
      "Loyalty progress toward a free touch-up",
    ],
  },
  {
    href: "/portal/owner",
    icon: ShieldCheck,
    title: "Owner",
    who: "What only Latesha would see",
    points: [
      "The week ahead, hour by hour",
      "Revenue booked and revenue completed",
      "Which services actually get booked",
      "Every client, with the notes that matter",
      "Confirming or changing menu prices herself",
    ],
  },
];

export default function PortalIndex() {
  return (
    <div className="studio grain min-h-screen">
      <div className="container-page flex min-h-screen flex-col justify-center py-section">
        <div className="mx-auto w-full max-w-4xl">
          <div className="text-center">
            <Butterfly px={64} neon animate="unfurl" className="mx-auto w-16 text-rose-lite" />
            <div className="mt-7 flex items-center justify-center gap-3">
              <span className="neon-rule w-10" aria-hidden />
              <Eyebrow tone="studio">Portal</Eyebrow>
              <span className="neon-rule w-10" aria-hidden />
            </div>
            <h1 className="mt-5 font-display text-h1 font-black text-bone">
              Two sides, one book.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lead text-bone-dim">
              A working demo of what booking with Bloom Kreations could be —
              a real client account and a real owner dashboard, on sample data.
              Pick a side.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {ROLES.map((r) => {
              const Icon = r.icon;
              return (
                <Link
                  key={r.href}
                  href={r.href}
                  className="group flex flex-col rounded-sheet border border-copper/30 bg-studio-2 p-8 transition-colors duration-300 hover:border-rose-lite"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="inline-flex size-12 items-center justify-center rounded-pill bg-honey-lite/10 text-honey-lite">
                      <Icon className="size-6" aria-hidden />
                    </span>
                    <Badge tone="studio">Demo</Badge>
                  </div>

                  <h2 className="mt-6 font-display text-h2 font-black text-bone">
                    {r.title}
                  </h2>
                  <p className="mt-1 text-sm text-honey-lite">{r.who}</p>

                  <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                    {r.points.map((p) => (
                      <li key={p} className="flex gap-3 text-sm text-bone-dim">
                        <span
                          className="mt-2 size-1.5 shrink-0 rounded-pill bg-rose-lite"
                          aria-hidden
                        />
                        {p}
                      </li>
                    ))}
                  </ul>

                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-bone">
                    Open the {r.title.toLowerCase()} side
                    <ArrowRight
                      className="size-4 text-rose-lite transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden
                    />
                  </span>
                </Link>
              );
            })}
          </div>

          <p className="mx-auto mt-10 flex max-w-2xl gap-3 rounded-card border border-honey-lite/25 bg-honey-lite/[0.07] p-5 text-sm leading-relaxed text-bone-dim">
            <Info className="mt-0.5 size-4 shrink-0 text-honey-lite" aria-hidden />
            <span>
              No sign-in, because there is no account system yet. Everything runs
              on typed sample data held in memory for this visit. Wiring a real
              backend is a change behind this UI, not to it.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
