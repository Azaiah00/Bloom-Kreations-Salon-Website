/**
 * Brand marks.
 *
 * She has no logo file, so these are drawn from the vocabulary she already uses
 * on both Instagram accounts: a butterfly, a bloom, and a crown. Every path is a
 * single continuous stroke so it can be drawn on scroll by `useDrawOnScroll`.
 *
 * `draw` renders the mark as line art with the `.draw-path` class attached.
 * Without it, the mark renders as a normal static stroke.
 */

interface MarkProps {
  className?: string;
  draw?: boolean;
  strokeWidth?: number;
  title?: string;
}

function pathClass(draw?: boolean) {
  return draw ? "draw-path" : undefined;
}

/**
 * The primary mark. Used in the nav, the footer, and as a section ornament.
 *
 * Drawn to stay legible down to 22px: four wings, a slim body and two dotted
 * antennae, and nothing else. An earlier version carried wing detail that
 * collapsed into a blob at nav size — verified at 22 / 28 / 40 / 80 / 160px.
 */
export function Butterfly({
  className,
  draw,
  strokeWidth = 1.5,
  title,
}: MarkProps) {
  return (
    <svg
      viewBox="0 0 100 90"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* Body */}
      <path className={pathClass(draw)} d="M50 27v44" />
      {/* Antennae */}
      <path
        className={pathClass(draw)}
        d="M50 27c-4-7-9-11-14-13M50 27c4-7 9-11 14-13"
      />
      <circle className={pathClass(draw)} cx="35" cy="13" r="1.8" />
      <circle className={pathClass(draw)} cx="65" cy="13" r="1.8" />
      {/* Upper wings */}
      <path
        className={pathClass(draw)}
        d="M50 31C44 15 26 9 16 18 7 27 14 42 31 46c8 2 16-7 19-15Z"
      />
      <path
        className={pathClass(draw)}
        d="M50 31c6-16 24-22 34-13 9 9 2 24-15 28-8 2-16-7-19-15Z"
      />
      {/* Lower wings */}
      <path
        className={pathClass(draw)}
        d="M50 43c-5 12-19 15-24 25-4 9 4 15 11 11 8-5 12-22 13-36Z"
      />
      <path
        className={pathClass(draw)}
        d="M50 43c5 12 19 15 24 25 4 9-4 15-11 11-8-5-12-22-13-36Z"
      />
    </svg>
  );
}

/**
 * A bloom opening — used on the loc-journey rail and as a section divider.
 * Six teardrop petals rotated around a centre, so it stays readable small.
 */
export function Bloom({ className, draw, strokeWidth = 1.5, title }: MarkProps) {
  const petal = "M50 46C41 36 40 24 50 12c10 12 9 24 0 34Z";
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <path
          key={deg}
          className={pathClass(draw)}
          d={petal}
          transform={`rotate(${deg} 50 50)`}
        />
      ))}
      <circle className={pathClass(draw)} cx="50" cy="50" r="6" />
    </svg>
  );
}

/** A single loc, coiling. The rail marker on the journey timeline. */
export function LocCoil({ className, draw, strokeWidth = 1.5, title }: MarkProps) {
  return (
    <svg
      viewBox="0 0 40 120"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <path
        className={pathClass(draw)}
        d="M20 6c-9 6-9 14 0 20s9 14 0 20-9 14 0 20 9 14 0 20-9 14 0 20"
      />
      <path
        className={pathClass(draw)}
        d="M20 6c9 6 9 14 0 20s-9 14 0 20 9 14 0 20-9 14 0 20 9 14 0 20"
      />
    </svg>
  );
}

/** Crown — used only on the "confidence starts at the crown" pull quote. */
export function Crown({ className, draw, strokeWidth = 1.5, title }: MarkProps) {
  return (
    <svg
      viewBox="0 0 120 80"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <path
        className={pathClass(draw)}
        d="M12 62 6 20l26 18L60 8l28 30 26-18-6 42Z"
      />
      <path className={pathClass(draw)} d="M12 62h96" />
    </svg>
  );
}

/** The wordmark. Set in the display face; kept as text for selectability + SEO. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className}>
      <span className="font-display font-black tracking-tight">Bloom</span>{" "}
      <span className="font-display font-light italic tracking-tight">Kreations</span>
    </span>
  );
}

/**
 * Instagram glyph. Lucide dropped brand icons, so this is drawn here rather than
 * pulling in a whole brand-icon package for one mark.
 */
export function InstagramGlyph({ className, strokeWidth = 1.8 }: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}
