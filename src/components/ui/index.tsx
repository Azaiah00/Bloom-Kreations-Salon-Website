import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { ImageOff, BadgeCheck, CircleAlert } from "lucide-react";
import type { PriceStatus } from "@/lib/business";

/* ========================================================================== */
/* cn                                                                          */
/* ========================================================================== */

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/* ========================================================================== */
/* Button — the four variants from DESIGN.md §6.                               */
/* ========================================================================== */

type ButtonVariant = "primary" | "honey" | "ghost" | "studio" | "studio-ghost";
type ButtonSize = "md" | "lg";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-rose text-cream hover:bg-ink focus-visible:bg-ink shadow-[var(--shadow-soft)]",
  honey: "bg-honey text-cream hover:bg-espresso",
  ghost: "text-ink border border-sand hover:border-ink hover:bg-shell",
  studio: "bg-honey-lite text-studio hover:bg-cream",
  "studio-ghost":
    "text-bone border border-copper/60 hover:border-rose-lite hover:text-rose-lite",
};

const SIZES: Record<ButtonSize, string> = {
  md: "min-h-12 px-6 text-sm",
  lg: "min-h-14 px-8 text-base",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-pill font-semibold " +
  "tracking-tight transition-colors duration-200 ease-[var(--ease-out-soft)] " +
  "disabled:opacity-40 disabled:pointer-events-none";

interface ButtonBase {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}

export function Button({
  href,
  external,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonBase & {
  href?: string;
  external?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = cn(BASE, VARIANTS[variant], SIZES[size], className);

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}

/* ========================================================================== */
/* SectionHeading — one component so the rhythm cannot drift.                   */
/* ========================================================================== */

export function Eyebrow({
  children,
  tone = "light",
  className,
}: {
  children: ReactNode;
  tone?: "light" | "studio";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-eyebrow font-bold uppercase",
        tone === "studio" ? "text-rose-lite" : "text-honey",
        className
      )}
    >
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  tone = "light",
  align = "left",
  as: As = "h2",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  tone?: "light" | "studio";
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow ? (
        <div className={cn("reveal flex items-center gap-3", align === "center" && "justify-center")}>
          {tone === "studio" ? <span className="neon-rule w-10" aria-hidden /> : null}
          <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
          {tone === "studio" ? <span className="neon-rule w-10" aria-hidden /> : null}
        </div>
      ) : null}

      <As
        className={cn(
          "reveal font-display font-black",
          As === "h1" ? "text-h1" : "text-h2",
          tone === "studio" ? "text-bone" : "text-ink"
        )}
      >
        {title}
      </As>

      {lead ? (
        <p
          className={cn(
            "reveal measure text-lead",
            align === "center" && "mx-auto",
            tone === "studio" ? "text-bone-dim" : "text-ink-soft"
          )}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}

/* ========================================================================== */
/* Section wrapper — enforces the one vertical rhythm value.                   */
/* ========================================================================== */

export function Section({
  children,
  id,
  tone = "cream",
  className,
  bleed = false,
}: {
  children: ReactNode;
  id?: string;
  tone?: "cream" | "shell" | "studio";
  className?: string;
  bleed?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative py-section",
        tone === "shell" && "bg-shell",
        tone === "studio" && "studio grain",
        className
      )}
    >
      {bleed ? children : <div className="container-page">{children}</div>}
    </section>
  );
}

/* ========================================================================== */
/* PhotoSlot — a real image, or a marker no one can ship silently.             */
/* ========================================================================== */

export function PhotoSlot({
  src,
  alt,
  className,
  sizes = "(min-width: 1024px) 33vw, 100vw",
  priority = false,
  ratio = "aspect-[3/4]",
  need = "NEEDS REAL PHOTO",
}: {
  src?: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  ratio?: string;
  need?: string;
}) {
  if (!src) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-media border-2 border-dashed border-rose/50 bg-shell p-6 text-center",
          ratio,
          className
        )}
      >
        <ImageOff className="size-7 text-rose" aria-hidden />
        <p className="text-eyebrow font-bold uppercase text-rose">{need}</p>
        <p className="max-w-[24ch] text-xs leading-snug text-ink-soft">{alt}</p>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden rounded-media bg-shell", ratio, className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}

/* ========================================================================== */
/* PriceTag                                                                    */
/* ========================================================================== */

export function PriceTag({
  priceUsd,
  status,
  tone = "light",
  className,
}: {
  priceUsd: number;
  status: PriceStatus;
  tone?: "light" | "studio";
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span
        className={cn(
          "font-display text-h3 font-black tabular-nums",
          tone === "studio" ? "text-honey-lite" : "text-honey"
        )}
      >
        ${priceUsd}
      </span>
      {status === "unconfirmed" ? (
        <span className="inline-flex items-center gap-1 rounded-pill bg-rose/12 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-rose">
          <CircleAlert className="size-3" aria-hidden />
          price to confirm
        </span>
      ) : null}
    </span>
  );
}

/* ========================================================================== */
/* Badges                                                                      */
/* ========================================================================== */

export function Badge({
  children,
  tone = "light",
  icon,
  className,
}: {
  children: ReactNode;
  tone?: "light" | "studio" | "rose";
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-xs font-semibold tracking-tight",
        tone === "light" && "bg-shell text-ink-soft ring-1 ring-sand",
        tone === "studio" && "bg-studio-2 text-bone-dim ring-1 ring-copper/40",
        tone === "rose" && "bg-rose text-cream",
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}

export function VerifiedNote({ children }: { children: ReactNode }) {
  return (
    <p className="inline-flex items-start gap-2 text-xs leading-relaxed text-ink-soft">
      <BadgeCheck className="mt-0.5 size-4 shrink-0 text-honey" aria-hidden />
      <span>{children}</span>
    </p>
  );
}

/* ========================================================================== */
/* Stars — real ratings only.                                                  */
/* ========================================================================== */

export function Stars({
  value = 5,
  tone = "light",
  className,
}: {
  value?: number;
  tone?: "light" | "studio";
  className?: string;
}) {
  return (
    <span
      className={cn("inline-flex gap-0.5", className)}
      role="img"
      aria-label={`${value} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={cn(
            "size-4",
            i < Math.round(value)
              ? tone === "studio"
                ? "fill-honey-lite"
                : "fill-honey"
              : "fill-sand"
          )}
          aria-hidden
        >
          <path d="M10 1.6l2.47 5.24 5.53.83-4 4.06.95 5.77L10 14.77 5.05 17.5l.95-5.77-4-4.06 5.53-.83z" />
        </svg>
      ))}
    </span>
  );
}
