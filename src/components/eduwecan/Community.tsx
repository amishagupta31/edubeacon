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
import { community } from "./data";

export default function Community() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    ensureGsapRegistered();
    if (prefersReducedMotion() || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, x: -50, scale: 0.96 },
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
        textRef.current,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 1.0,
          ease: EASE.entrance,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none none", once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="community" ref={sectionRef} className="relative overflow-hidden py-24 md:py-32" style={{ background: "var(--color-ewc-sage)" }}>
      <div className="mx-auto max-w-[1320px] px-6 md:px-10">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-16">
          <div ref={imageRef} className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.75rem] shadow-[0_35px_70px_-35px_rgba(47,52,64,0.3)]">
              <Image
                src={community.image}
                alt="Students and mentors collaborating together"
                fill
                sizes="(min-width: 1024px) 600px, 90vw"
                className="object-cover"
              />
            </div>
          </div>

          <div ref={textRef} className="order-1 flex flex-col items-start gap-6 lg:order-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--color-ewc-ink)", opacity: 0.6 }}>
              {community.eyebrow}
            </span>
            <h2 className="font-display text-[36px] leading-[1.1] font-medium md:text-[48px]" style={{ color: "var(--color-ewc-ink)" }}>
              {community.heading}
            </h2>
            <p className="max-w-[48ch] text-[16px] leading-relaxed" style={{ color: "var(--color-ewc-ink)", opacity: 0.75 }}>
              {community.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
