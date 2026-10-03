"use client";

import { useRef } from "react";
import {
  gsap,
  ensureGsapRegistered,
  useIsomorphicLayoutEffect,
  prefersReducedMotion,
  EASE,
} from "./gsapSetup";
import { features } from "./data";

export default function FeatureCards() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);

  useIsomorphicLayoutEffect(() => {
    ensureGsapRegistered();
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(cardRefs.current, { opacity: 1, y: 0 });
        gsap.set(iconRefs.current, { opacity: 1, scale: 1, rotate: 0 });
        return;
      }

      gsap.fromTo(
        cardRefs.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: EASE.entrance,
          stagger: 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );

      gsap.fromTo(
        iconRefs.current,
        { opacity: 0, scale: 0.8, rotate: -4 },
        {
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 0.5,
          ease: EASE.interaction,
          stagger: 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="guidance" ref={sectionRef} className="relative py-24 md:py-32" style={{ background: "var(--color-ewc-ivory)" }}>
      <div className="mx-auto max-w-[1320px] px-6 md:px-10">
        <div className="mx-auto mb-14 flex max-w-[640px] flex-col items-center gap-4 text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--color-ewc-muted)" }}>
            Guidance
          </span>
          <h2 className="font-display text-[36px] leading-[1.1] font-medium md:text-[46px]" style={{ color: "var(--color-ewc-ink)" }}>
            Everything a Learner Needs to Thrive
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="group flex flex-col gap-4 rounded-[1.5rem] border p-7 shadow-[0_0_0_rgba(47,52,64,0)] transition-all duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-24px_rgba(47,52,64,0.25)]"
              style={{ borderColor: "var(--color-ewc-line)", background: "var(--color-ewc-ivory)" }}
            >
              <div
                ref={(el) => {
                  iconRefs.current[i] = el;
                }}
                className="flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                style={{ background: feature.bg }}
              >
                <feature.icon className="h-6 w-6" style={{ color: "var(--color-ewc-ink)" }} strokeWidth={1.75} />
              </div>
              <h3 className="font-display text-[20px] font-medium" style={{ color: "var(--color-ewc-ink)" }}>
                {feature.title}
              </h3>
              <p className="text-[14px] leading-relaxed" style={{ color: "var(--color-ewc-muted)" }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
