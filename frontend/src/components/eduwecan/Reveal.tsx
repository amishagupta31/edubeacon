"use client";

import { ReactNode, useRef } from "react";
import {
  gsap,
  ensureGsapRegistered,
  useIsomorphicLayoutEffect,
  prefersReducedMotion,
  EASE,
} from "./gsapSetup";

type From = "up" | "left" | "right" | "scale";

/**
 * Generic scroll-triggered entrance. Plays once when ~25% of the
 * element has entered the viewport and never reverses/replays on
 * scroll back up — per the "default entrance animation" spec.
 */
export default function Reveal({
  children,
  from = "up",
  delay = 0,
  duration = 0.7,
  distance = 40,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  from?: From;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  as?: "div" | "span" | "li";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    ensureGsapRegistered();
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1 });
      return;
    }

    const fromVars: gsap.TweenVars = { opacity: 0 };
    if (from === "up") fromVars.y = distance;
    if (from === "left") fromVars.x = -distance;
    if (from === "right") fromVars.x = distance;
    if (from === "scale") {
      fromVars.scale = 0.95;
      fromVars.y = distance / 2;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        fromVars,
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration,
          delay,
          ease: EASE.entrance,
          overwrite: "auto",
          scrollTrigger: {
            trigger: el,
            start: "top 78%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [from, delay, duration, distance]);

  const Comp = Tag as "div";
  return (
    <Comp ref={ref} className={className}>
      {children}
    </Comp>
  );
}
