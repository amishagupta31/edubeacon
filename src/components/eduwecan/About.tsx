"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  gsap,
  ensureGsapRegistered,
  useIsomorphicLayoutEffect,
  prefersReducedMotion,
  EASE,
} from "./gsapSetup";
import FloatingShapes from "./FloatingShapes";
import { about } from "./data";

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const statRefs = useRef<(HTMLDivElement | null)[]>([]);

  useIsomorphicLayoutEffect(() => {
    ensureGsapRegistered();
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1.0,
          ease: EASE.entrance,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none none", once: true },
        }
      );
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, x: 50, scale: 0.96 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1.1,
          ease: EASE.entrance,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none none", once: true },
        }
      );
      gsap.fromTo(
        statRefs.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: EASE.entrance,
          stagger: 0.12,
          scrollTrigger: { trigger: sectionRef.current, start: "top 65%", toggleActions: "play none none none", once: true },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative overflow-hidden py-24 md:py-32" style={{ background: "var(--color-ewc-ivory)" }}>
      <FloatingShapes variant="minimal" />
      <div className="mx-auto max-w-[1320px] px-6 md:px-10">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-16">
          <div ref={textRef} className="flex flex-col items-start gap-6">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--color-ewc-muted)" }}>
              {about.eyebrow}
            </span>
            <h2 className="font-display text-[36px] leading-[1.12] font-medium md:text-[48px]" style={{ color: "var(--color-ewc-ink)" }}>
              {about.heading}
            </h2>
            <p className="max-w-[50ch] text-[16px] leading-relaxed" style={{ color: "var(--color-ewc-muted)" }}>
              {about.body}
            </p>

            <div className="mt-2 grid grid-cols-3 gap-4">
              {about.stats.map((stat, i) => (
                <div
                  key={stat.label}
                  ref={(el) => {
                    statRefs.current[i] = el;
                  }}
                  className="flex flex-col gap-1 rounded-2xl p-4"
                  style={{ background: "var(--color-ewc-lilac)" }}
                >
                  <span className="font-display text-[22px] leading-none" style={{ color: "var(--color-ewc-ink)" }}>
                    {stat.value}
                  </span>
                  <span className="text-[11.5px] leading-snug" style={{ color: "var(--color-ewc-muted)" }}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div ref={imageRef} className="relative">
            <div className="absolute -inset-5 -z-10 rounded-[2rem]" style={{ background: "var(--color-ewc-sage)" }} />
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.75rem] shadow-[0_35px_70px_-35px_rgba(47,52,64,0.35)]">
              <Image
                src={about.image}
                alt="Diverse students engaged in a bright classroom"
                fill
                sizes="(min-width: 1024px) 600px, 90vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
