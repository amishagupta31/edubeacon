"use client";

import { useRef } from "react";
import {
  gsap,
  ensureGsapRegistered,
  useIsomorphicLayoutEffect,
  prefersReducedMotion,
  EASE,
} from "./gsapSetup";
import { opportunities } from "./data";

export default function Opportunities() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useIsomorphicLayoutEffect(() => {
    ensureGsapRegistered();
    if (prefersReducedMotion()) {
      gsap.set(cardRefs.current, { opacity: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRefs.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: EASE.entrance,
          stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none none", once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="opportunities" ref={sectionRef} className="relative py-24 md:py-32" style={{ background: "var(--color-ewc-ivory)" }}>
      <div className="mx-auto max-w-[1320px] px-6 md:px-10">
        <div className="mb-14 flex flex-col items-start gap-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--color-ewc-muted)" }}>
            Opportunities
          </span>
          <h2 className="font-display text-[36px] leading-[1.1] font-medium md:text-[46px]" style={{ color: "var(--color-ewc-ink)" }}>
            Find What Moves You Forward
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {opportunities.map((item, i) => (
            <div
              key={item.title}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="group flex cursor-pointer flex-col justify-between gap-8 rounded-[1.75rem] p-8 transition-all duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_28px_55px_-28px_rgba(47,52,64,0.3)]"
              style={{ background: item.bg }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/50 transition-transform duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110">
                <item.icon className="h-6 w-6" style={{ color: "var(--color-ewc-ink)" }} strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="font-display text-[22px] font-medium" style={{ color: "var(--color-ewc-ink)" }}>
                  {item.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "var(--color-ewc-ink)", opacity: 0.72 }}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
