"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  gsap,
  ensureGsapRegistered,
  useIsomorphicLayoutEffect,
  prefersReducedMotion,
  EASE,
  EASE_CSS,
} from "./gsapSetup";
import { testimonials, testimonialsDisclaimer } from "./data";

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
  }, []);

  useEffect(() => {
    if (paused || reduced) return;
    const id = setInterval(() => {
      setActive((v) => (v + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(id);
  }, [paused, reduced]);

  useIsomorphicLayoutEffect(() => {
    ensureGsapRegistered();
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-testimonial-heading]",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: EASE.entrance,
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%", toggleActions: "play none none none", once: true },
        }
      );
      gsap.fromTo(
        "[data-testimonial-stack]",
        { opacity: 0, scale: 0.94 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: EASE.entrance,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none none", once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative overflow-hidden py-24 md:py-32 bg-[#FDFBF7]"
    >
      <div className="relative mx-auto max-w-[900px] px-6 md:px-10">
        <div data-testimonial-heading className="mb-14 flex flex-col items-center gap-3 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-[#0E733B] text-[11px] font-bold uppercase tracking-[0.2em] px-4.5 py-1.5 rounded-full border border-emerald-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0E733B]" />
            <span>Community Voices</span>
          </div>
          <h2 className="font-bold text-[34px] leading-[1.15] md:text-[44px] text-charcoal tracking-tight">
            Stories of Growth
          </h2>
          <p className="text-[12.5px] italic text-slate-soft opacity-80">
            {testimonialsDisclaimer}
          </p>
        </div>

        <div
          data-testimonial-stack
          className="relative mx-auto h-[380px] max-w-[820px] sm:h-[300px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {testimonials.map((t, i) => {
            const offset = i - active;
            const isNext = offset === 1 || (active === testimonials.length - 1 && i === 0);
            const isPrev = offset === -1 || (active === 0 && i === testimonials.length - 1);
            const isActive = offset === 0;
            const visible = isNext || isPrev;
            return (
              <div
                key={t.name}
                className="absolute inset-x-4 sm:inset-x-8 inset-y-0 flex flex-col items-center justify-center gap-5 rounded-2xl p-8 text-center border border-line transition-all sm:flex-row sm:items-center sm:gap-7 sm:text-left bg-white"
                style={{
                  transitionDuration: "700ms",
                  transitionTimingFunction: EASE_CSS.entrance,
                  opacity: isActive ? 1 : visible ? 0.55 : 0,
                  transform: isActive
                    ? "translateY(0) scale(1)"
                    : isNext
                      ? "translateY(14px) scale(0.92) translateX(48px)"
                      : isPrev
                        ? "translateY(14px) scale(0.92) translateX(-48px)"
                        : "translateY(14px) scale(0.9)",
                  zIndex: isActive ? 10 : 0,
                  pointerEvents: isActive ? "auto" : "none",
                  boxShadow: isActive ? "0 25px 60px -20px rgba(14,115,59,0.18)" : "0 8px 25px -15px rgba(0,0,0,0.08)",
                }}
                aria-hidden={!isActive}
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-emerald-500/20 sm:h-24 sm:w-24 shadow-sm">
                  <Image src={t.image} alt={t.name} fill sizes="96px" className="object-cover" />
                </div>
                <div>
                  <p className="text-[17px] leading-relaxed italic sm:text-[18.5px] text-slate-800 font-normal">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <p className="mt-4 text-[14.5px] font-bold text-charcoal">
                    {t.name}
                  </p>
                  <p className="text-[12.5px] text-[#0E733B] font-semibold">
                    {t.role}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2.5">
          {testimonials.map((t, i) => (
            <button
              key={t.name}
              aria-label={`Show testimonial from ${t.name}`}
              onClick={() => setActive(i)}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === active ? "24px" : "8px",
                background: i === active ? "#0E733B" : "#CBD5E1",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

