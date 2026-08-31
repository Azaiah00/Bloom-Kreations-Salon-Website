import Link from "next/link";
import { Butterfly } from "@/components/marks/Marks";
import { Button, Eyebrow } from "@/components/ui";
import { BUSINESS } from "@/lib/business";

const LINKS = [
  { href: "/services", label: "Services and prices" },
  { href: "/book", label: "Book an appointment" },
  { href: "/gallery", label: "Gallery" },
  { href: "/loc-journey", label: "The loc journey" },
  { href: "/visit", label: "Visit the studio" },
];

export default function NotFound() {
  return (
    <section className="py-section">
      <div className="container-page max-w-3xl text-center">
        <Butterfly px={80} animate="unfurl" className="mx-auto w-20 text-rose" />
        <Eyebrow className="mt-8">404</Eyebrow>
        <h1 className="mt-4 font-display text-h1 font-black text-ink">
          That page has grown out.
        </h1>
        <p className="measure mx-auto mt-5 text-lead text-ink-soft">
          Nothing lives at this address. Here is everything that does.
        </p>

        <ul className="mx-auto mt-10 flex max-w-md flex-col gap-2 text-left">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="flex min-h-12 items-center justify-between gap-4 rounded-card border border-sand px-5 font-semibold text-ink transition-colors hover:border-ink hover:bg-shell"
              >
                {l.label}
                <span aria-hidden className="text-rose">&rarr;</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button href="/" size="lg">Back to the start</Button>
          <Button href={BUSINESS.phoneHref} variant="ghost" size="lg">
            Call {BUSINESS.phone}
          </Button>
        </div>
      </div>
    </section>
  );
}
