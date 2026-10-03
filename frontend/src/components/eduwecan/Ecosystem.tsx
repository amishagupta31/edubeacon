"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  gsap,
  ensureGsapRegistered,
  useIsomorphicLayoutEffect,
  prefersReducedMotion,
  EASE,
} from "./gsapSetup";
import FloatingShapes from "./FloatingShapes";
import { partnerCategories, partnersDisclaimer } from "./data";

export default function Ecosystem() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [reduced, setReduced] = useState(false);

  useIsomorphicLayoutEffect(() => {
    ensureGsapRegistered();
    const isReduced = prefersReducedMotion() || window.matchMedia("(max-width: 767px)").matches;
    setReduced(isReduced);

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || isReduced) return;

    const ctx = gsap.context(() => {
      const getDistance = () => Math.max(track.scrollWidth - section.clientWidth, 0);
      const getPinDistance = () => getDistance() + window.innerWidth * 1.1;

      gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + getPinDistance(),
          scrub: 0.8,
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: () => {
            const viewportCenter = window.innerWidth / 2;
            sceneRefs.current.forEach((scene) => {
              if (!scene) return;
              const rect = scene.getBoundingClientRect();
              const center = rect.left + rect.width / 2;
              const dist = Math.abs(viewportCenter - center);
              const proximity = gsap.utils.clamp(0, 1, 1 - dist / (window.innerWidth * 0.7));
              gsap.set(scene, {
                scale: gsap.utils.interpolate(0.96, 1, proximity),
                opacity: gsap.utils.interpolate(0.75, 1, proximity),
              });
            });
          },
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="ecosystem"
      ref={sectionRef}
      className={`relative overflow-hidden ${reduced ? "py-24" : "py-24 md:py-0 md:h-screen md:flex md:items-center"}`}
      style={{ background: "var(--color-ewc-ivory)" }}
    >
      {reduced && <FloatingShapes variant="minimal" />}
      <div className="w-full">
        <div
          ref={trackRef}
          className={`scroll-rail flex items-stretch gap-8 px-6 md:px-10 ${reduced ? "overflow-x-auto" : "overflow-x-auto md:overflow-visible"}`}
        >
          {/* Intro scene */}
          <div
            ref={(el) => {
              sceneRefs.current[0] = el;
            }}
            className="flex w-[280px] shrink-0 flex-col justify-center gap-4 md:w-[420px]"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--color-ewc-muted)" }}>
              Our Ecosystem
            </span>
            <h2 className="font-display text-[32px] leading-[1.12] font-medium md:text-[42px]" style={{ color: "var(--color-ewc-ink)" }}>
              Our Education Ecosystem
            </h2>
            <p className="text-[15px] leading-relaxed" style={{ color: "var(--color-ewc-muted)" }}>
              Connecting schools, universities, innovators, and organizations shaping the future of education.
            </p>
            <p className="mt-2 text-[11.5px] italic" style={{ color: "var(--color-ewc-muted)", opacity: 0.7 }}>
              {partnersDisclaimer}
            </p>
          </div>

          {/* One scene per partner category */}
          {partnerCategories.map((category, i) => (
            <div
              key={category.tier}
              ref={(el) => {
                sceneRefs.current[i + 1] = el;
              }}
              className="flex w-[300px] shrink-0 flex-col gap-5 rounded-[1.75rem] p-7 md:w-[460px] md:p-8"
              style={{ background: category.bg }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/60">
                  <category.icon className="h-5 w-5" style={{ color: "var(--color-ewc-ink)" }} strokeWidth={1.75} />
                </div>
                <h3 className="font-display text-[19px] font-medium" style={{ color: "var(--color-ewc-ink)" }}>
                  {category.tier}
                </h3>
              </div>

              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.1rem]">
                <Image
                  src={category.image}
                  alt={category.tier}
                  fill
                  sizes="460px"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {category.names.map((name, ni) => (
                  <span
                    key={name}
                    className="rounded-full bg-white/70 px-3.5 py-2 text-[12.5px] font-medium"
                    style={{
                      color: "var(--color-ewc-ink)",
                      marginTop: ni % 2 === 1 ? "8px" : "0px",
                    }}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {/* Closing scene */}
          <div
            ref={(el) => {
              sceneRefs.current[partnerCategories.length + 1] = el;
            }}
            className="flex w-[280px] shrink-0 flex-col items-start justify-center gap-4 md:w-[380px]"
          >
            <h3 className="font-display text-[28px] leading-[1.15] font-medium md:text-[34px]" style={{ color: "var(--color-ewc-ink)" }}>
              Better Connected. Stronger Together
            </h3>
            <button
              onClick={() => document.getElementById("join")?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-full px-6 py-3 text-[13.5px] font-semibold transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: "var(--color-ewc-ink)", color: "var(--color-ewc-ivory)" }}
            >
              Explore the EduBeacon Ecosystem
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
