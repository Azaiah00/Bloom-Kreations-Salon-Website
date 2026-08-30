"use client";

import { useRef, type ReactNode } from "react";
import { useReveal } from "./hooks";

/**
 * Wraps a block of server-rendered markup so every `.reveal` inside it rises and
 * fades in as the block enters. Lets static pages keep their content on the
 * server and opt into motion with one client boundary rather than one per
 * element.
 */
export default function Reveal({
  children,
  stagger = 0.06,
  start = "top 85%",
  className,
}: {
  children: ReactNode;
  stagger?: number;
  start?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref, { stagger, start });
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
