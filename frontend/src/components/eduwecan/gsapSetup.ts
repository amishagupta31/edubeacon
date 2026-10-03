"use client";

import { useEffect, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

let registered = false;

/**
 * Registers ScrollTrigger + CustomEase exactly once, client-side only,
 * and defines the three master easing curves as named GSAP eases so
 * the exact requested cubic-beziers are used (GSAP does not parse raw
 * CSS `cubic-bezier()` strings without CustomEase).
 */
export function ensureGsapRegistered() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, CustomEase);
  CustomEase.create("ewcEntrance", "0.22, 1, 0.36, 1"); // Premium Entrance
  CustomEase.create("ewcInteraction", "0.16, 1, 0.3, 1"); // Smooth Fast Interaction
  CustomEase.create("ewcCinematic", "0.76, 0, 0.24, 1"); // Cinematic Reveal
  registered = true;
}

/** useLayoutEffect on the client, a no-op-safe useEffect during SSR. */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * The three master easing curves, as GSAP ease names (registered via
 * CustomEase in ensureGsapRegistered) and as raw CSS strings for use
 * in plain CSS transitions/Tailwind arbitrary values.
 */
export const EASE = {
  entrance: "ewcEntrance", // Premium Entrance — cubic-bezier(0.22, 1, 0.36, 1)
  interaction: "ewcInteraction", // Smooth Fast Interaction — cubic-bezier(0.16, 1, 0.3, 1)
  cinematic: "ewcCinematic", // Cinematic Reveal — cubic-bezier(0.76, 0, 0.24, 1)
} as const;

export const EASE_CSS = {
  entrance: "cubic-bezier(0.22, 1, 0.36, 1)",
  interaction: "cubic-bezier(0.16, 1, 0.3, 1)",
  cinematic: "cubic-bezier(0.76, 0, 0.24, 1)",
} as const;

export { gsap, ScrollTrigger };
