"use client";

import { useRef } from "react";
import {
  gsap,
  ensureGsapRegistered,
  useIsomorphicLayoutEffect,
  prefersReducedMotion,
  EASE,
} from "./gsapSetup";
import { stats, statsDisclaimer } from "./data";

export default function Stats() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useIsomorphicLayoutEffect(() => {
    ensureGsapRegistered();
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(blockRefs.current, { opacity: 1, y: 0 });
        numberRefs.current.forEach((el, i) => {
          if (el) el.textContent = stats[i].value.toLocaleString() + stats[i].suffix;
        });
        return;
      }

      gsap.fromTo(
        blockRefs.current,
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
            onEnter: () => {
              stats.forEach((stat, i) => {
                const el = numberRefs.current[i];
                if (!el) return;
                const counter = { val: 0 };
                gsap.to(counter, {
                  val: stat.value,
                  duration: 2,
                  ease: "power2.out",
                  onUpdate: () => {
                    el.textContent = Math.round(counter.val).toLocaleString() + stat.suffix;
                  },
                });
              });
            },
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 md:py-28" style={{ background: "var(--color-ewc-ivory)" }}>
      <div className="mx-auto max-w-[1320px] px-6 md:px-10">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              ref={(el) => {
                blockRefs.current[i] = el;
              }}
              className="flex flex-col gap-2 rounded-[1.5rem] p-7 md:p-8"
              style={{ background: stat.bg }}
            >
              <span
                ref={(el) => {
                  numberRefs.current[i] = el;
                }}
                className="ewc-counter font-display text-[34px] leading-none md:text-[42px]"
                style={{ color: "var(--color-ewc-ink)" }}
              >
                0{stat.suffix}
              </span>
              <span className="text-[13px] font-medium" style={{ color: "var(--color-ewc-ink)", opacity: 0.7 }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-[12px] italic" style={{ color: "var(--color-ewc-muted)" }}>
          {statsDisclaimer}
        </p>
      </div>
    </section>
  );
}
