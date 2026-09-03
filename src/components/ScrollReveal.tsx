"use client";

import { useEffect } from "react";

/**
 * Drives every `.reveal` element on the page: adds `.in-view` the
 * moment an element scrolls into the viewport (see globals.css),
 * which is what actually plays its fade/slide-up transition. Mounted
 * once in the root layout — no changes needed in individual sections,
 * they already carry the `reveal` / `reveal-delay-N` classes.
 *
 * Re-scans on route changes and DOM mutations (e.g. modals opening)
 * so newly-rendered `.reveal` elements get observed too.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    const observeAll = () => {
      document.querySelectorAll(".reveal:not(.in-view)").forEach((el) => {
        observer.observe(el);
      });
    };

    observeAll();

    // Elements inside modals, filtered lists, etc. can mount later.
    const mutationObserver = new MutationObserver(() => observeAll());
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}
