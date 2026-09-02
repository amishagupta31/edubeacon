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
import { gridPanels } from "./data";

const AREAS = ["a", "b", "c", "d", "e"] as const;

// Alternate entrance direction + wipe direction so the grid doesn't
// feel like every panel animates identically.
const DIRECTIONS: Array<"left" | "right" | "up"> = ["left", "right", "up", "up", "right"];
const WIPES: Array<"horizontal" | "vertical"> = ["horizontal", "vertical", "vertical", "horizontal", "horizontal"];

export default function GridPanels() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const overlayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  useIsomorphicLayoutEffect(() => {
    ensureGsapRegistered();
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      panelRefs.current.forEach((panel, i) => {
        if (!panel) return;
        const overlay = overlayRefs.current[i];
        const image = imageRefs.current[i];
        const text = textRefs.current[i];

        if (reduced) {
          gsap.set(panel, { opacity: 1, x: 0, y: 0 });
          gsap.set(overlay, { xPercent: 0, yPercent: 0, autoAlpha: 0 });
          gsap.set(image, { scale: 1 });
          gsap.set(text, { opacity: 1, y: 0 });
          return;
        }

        const dir = DIRECTIONS[i % DIRECTIONS.length];
        const wipe = WIPES[i % WIPES.length];
        const panelFrom: gsap.TweenVars =
          dir === "left" ? { x: -60, opacity: 0 } : dir === "right" ? { x: 60, opacity: 0 } : { y: 60, opacity: 0 };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
          },
          defaults: { ease: EASE.entrance },
        });

        tl.fromTo(panel, panelFrom, { x: 0, y: 0, opacity: 1, duration: 1.0 }, 0)
          .fromTo(
            image,
            { scale: 1.08 },
            { scale: 1, duration: 1.3, ease: EASE.entrance },
            0.1
          )
          .fromTo(
            overlay,
            wipe === "horizontal" ? { xPercent: 0 } : { yPercent: 0 },
            {
              xPercent: wipe === "horizontal" ? 100 : 0,
              yPercent: wipe === "vertical" ? 100 : 0,
              duration: 0.9,
              ease: EASE.cinematic,
            },
            0.15
          )
          .fromTo(
            text,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.7 },
            0.45
          );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="explore" ref={sectionRef} className="relative py-24 md:py-32" style={{ background: "var(--color-ewc-ivory)" }}>
      <div className="mx-auto max-w-[1320px] px-6 md:px-10">
        <div className="mb-14 flex flex-col items-start gap-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--color-ewc-muted)" }}>
            Explore
          </span>
          <h2 className="font-display text-[36px] leading-[1.1] font-medium md:text-[48px]" style={{ color: "var(--color-ewc-ink)" }}>
            An Education Story, <br className="hidden sm:block" />
            Told in Moments
          </h2>
        </div>

        <div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
          style={{
            gridTemplateAreas: `"a a b" "c d b" "e e e"`,
          }}
        >
          {gridPanels.map((panel, i) => (
            <div
              key={panel.title}
              ref={(el) => {
                panelRefs.current[i] = el;
              }}
              className={`group relative overflow-hidden rounded-[1.75rem] shadow-[0_25px_60px_-35px_rgba(47,52,64,0.35)] ${
                panel.span === "wide"
                  ? "aspect-[16/9] lg:aspect-[2/1]"
                  : panel.span === "tall"
                    ? "aspect-[4/5] lg:aspect-auto lg:h-full"
                    : "aspect-[4/3]"
              }`}
              style={{ gridArea: AREAS[i] }}
            >
              <div
                ref={(el) => {
                  imageRefs.current[i] = el;
                }}
                className="absolute inset-0"
              >
                <Image
                  src={panel.image}
                  alt={panel.title}
                  fill
                  sizes="(min-width: 1024px) 640px, 90vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
              </div>

              {/* Pastel block that slides away to reveal the image */}
              <div
                ref={(el) => {
                  overlayRefs.current[i] = el;
                }}
                className="absolute inset-0"
                style={{ background: panel.bg }}
              />

              <div
                ref={(el) => {
                  textRefs.current[i] = el;
                }}
                className="absolute inset-x-0 bottom-0 p-6 md:p-7"
              >
                <h3 className="font-display text-[20px] leading-tight text-white md:text-[24px]">{panel.title}</h3>
                <p className="mt-1.5 max-w-[36ch] text-[13px] leading-relaxed text-white/80">{panel.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
