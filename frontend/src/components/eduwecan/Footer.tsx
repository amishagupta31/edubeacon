"use client";

import { useRef } from "react";
import {
  gsap,
  ensureGsapRegistered,
  useIsomorphicLayoutEffect,
  prefersReducedMotion,
  EASE,
} from "./gsapSetup";
import FloatingShapes from "./FloatingShapes";
import { siteConfig, finalCta } from "./data";

const panelColors = [
  "var(--color-ewc-lavender)",
  "var(--color-ewc-blue)",
  "var(--color-ewc-peach)",
  "var(--color-ewc-sage)",
];

const footerLinks = [
  { label: "Explore", href: "#explore" },
  { label: "Opportunities", href: "#opportunities" },
  { label: "Guidance", href: "#guidance" },
  { label: "Community", href: "#community" },
  { label: "About", href: "#about" },
];

export default function Footer() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    ensureGsapRegistered();
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(panelRefs.current, { opacity: 1, x: 0 });
        gsap.set(ctaRef.current, { opacity: 1, y: 0, scale: 1 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
          once: true,
        },
        defaults: { ease: EASE.entrance },
      });

      panelRefs.current.forEach((panel, i) => {
        const fromX = i % 2 === 0 ? -50 : 50;
        tl.fromTo(panel, { opacity: 0, x: fromX }, { opacity: 1, x: 0, duration: 1.0 }, i * 0.18);
      });

      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 30, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.9 },
        0.4
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="join" ref={sectionRef} className="relative" style={{ background: "var(--color-ewc-ivory)" }}>
      {/* CTA block — pastel panels gather behind it, scoped to just this block */}
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 grid grid-cols-4">
          {panelColors.map((c, i) => (
            <div
              key={c}
              ref={(el) => {
                panelRefs.current[i] = el;
              }}
              style={{ background: c }}
            />
          ))}
        </div>
        <FloatingShapes variant="minimal" />
        <div className="relative mx-auto flex max-w-[720px] flex-col items-center gap-6 px-6 py-24 text-center md:px-10 md:py-32">
          <div ref={ctaRef} className="flex flex-col items-center gap-6">
            <h2 className="font-display text-[36px] leading-[1.1] font-medium md:text-[52px]" style={{ color: "var(--color-ewc-ink)" }}>
              {finalCta.heading}
            </h2>
            <p className="max-w-[48ch] text-[16px] leading-relaxed" style={{ color: "var(--color-ewc-muted)" }}>
              {finalCta.body}
            </p>
            <button
              className="rounded-full px-9 py-4 text-[15px] font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-20px_rgba(47,52,64,0.4)] active:scale-[0.98]"
              style={{ background: "var(--color-ewc-ink)", color: "var(--color-ewc-ivory)" }}
            >
              {finalCta.cta}
            </button>
          </div>
        </div>
      </div>

      <div className="border-t px-6 py-10 md:px-10" style={{ borderColor: "var(--color-ewc-line)" }}>
        <div className="mx-auto flex max-w-[1320px] flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <span className="font-display text-[16px]" style={{ color: "var(--color-ewc-ink)" }}>
              {siteConfig.name}
            </span>
            <span className="text-[12.5px]" style={{ color: "var(--color-ewc-muted)" }}>
              {siteConfig.tagline}
            </span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(link.href.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
                }}
                className="whitespace-nowrap text-[13px] font-medium transition-colors duration-200"
                style={{ color: "var(--color-ewc-muted)" }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <p className="mx-auto mt-8 max-w-[1320px] text-center text-[12px] sm:text-left" style={{ color: "var(--color-ewc-muted)", opacity: 0.75 }}>
          © 2026 {siteConfig.name}. {siteConfig.tagline}
        </p>
      </div>
    </section>
  );
}
