"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, CalendarPlus } from "lucide-react";
import { Butterfly, Wordmark } from "@/components/marks/Marks";
import { Button, cn } from "@/components/ui";
import { BUSINESS } from "@/lib/business";

const NAV = [
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/loc-journey", label: "Loc Journey" },
  { href: "/about", label: "About" },
  { href: "/visit", label: "Visit" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer on navigation. Adjusting state during render is React's own
  // recommendation for "reset state when a prop changes" — an effect here would
  // paint the open drawer on the new page for a frame first.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  // Lock the page behind the drawer while it is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300 ease-[var(--ease-out-soft)]",
        stuck
          ? "border-b border-sand/80 bg-cream/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-6">
        <Link
          href="/"
          className="group flex min-h-11 shrink-0 items-center gap-2.5"
          aria-label="Bloom Kreations — home"
        >
          <Butterfly
            className="size-7 text-rose transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:rotate-6 group-hover:scale-110"
            strokeWidth={2.2}
          />
          <Wordmark className="text-lg text-ink" />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative inline-flex min-h-11 items-center rounded-pill px-4 text-sm font-semibold transition-colors",
                      active ? "text-rose" : "text-ink-soft hover:text-ink"
                    )}
                  >
                    {item.label}
                    <span
                      className={cn(
                        "absolute inset-x-4 -bottom-0.5 h-0.5 origin-left rounded-pill bg-rose transition-transform duration-300 ease-[var(--ease-out-soft)]",
                        active ? "scale-x-100" : "scale-x-0"
                      )}
                      aria-hidden
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a
            href={BUSINESS.phoneHref}
            className="inline-flex min-h-11 items-center gap-2 rounded-pill px-3 text-sm font-semibold text-ink-soft transition-colors hover:text-ink"
          >
            <Phone className="size-4" aria-hidden />
            {BUSINESS.phone}
          </a>
          <Button href="/book" size="md">
            <CalendarPlus className="size-4" aria-hidden />
            Book
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="inline-flex size-11 items-center justify-center rounded-pill border border-sand text-ink lg:hidden"
        >
          {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[4.5rem] z-50 overflow-y-auto border-t border-sand bg-cream lg:hidden"
      >
        <nav aria-label="Mobile" className="container-page py-8">
          <ul className="flex flex-col gap-1">
            {NAV.map((item, i) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-baseline gap-4 border-b border-sand/70 py-4 font-display text-h3 font-bold text-ink"
                >
                  <span className="text-eyebrow font-sans font-bold tabular-nums text-honey">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3">
            <Button href="/book" size="lg">
              <CalendarPlus className="size-5" aria-hidden />
              Book an appointment
            </Button>
            <Button href={BUSINESS.phoneHref} variant="ghost" size="lg">
              <Phone className="size-5" aria-hidden />
              {BUSINESS.phone}
            </Button>
          </div>

          <p className="mt-8 text-sm leading-relaxed text-ink-soft">
            {BUSINESS.address.street}
            <br />
            {BUSINESS.address.locality}, {BUSINESS.address.region}{" "}
            {BUSINESS.address.postalCode}
            <br />
            Open 7:30 AM to 7 PM, seven days
          </p>
        </nav>
      </div>
    </header>
  );
}
