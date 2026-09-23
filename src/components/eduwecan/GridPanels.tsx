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

interface GridPanelsProps {
  eyebrow?: string;
  title?: React.ReactNode;
}

export default function GridPanels({
  eyebrow = "Moments",
  title = <>An Education Story, <br className="hidden sm:block" />Told in Moments</>,
}: GridPanelsProps = {}) {
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
    <section id="explore" ref={sectionRef} className="relative py-12 md:py-16 bg-[#FDFBF7]">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-8 md:px-12">
        <div className="mb-6 md:mb-8 flex flex-col items-start gap-2">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-[#0E733B] text-[11px] font-bold uppercase tracking-[0.2em] px-4 py-1 rounded-full border border-emerald-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0E733B]" />
            <span>{eyebrow}</span>
          </div>
          <h2 className="font-bold text-[30px] leading-[1.1] md:text-[40px] text-charcoal tracking-tight">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 lg:[grid-template-areas:'a_a_b'_'c_d_b'_'e_e_e']">
          {gridPanels.map((panel, i) => {
            const desktopAreaClass =
              i === 0
                ? "lg:[grid-area:a] sm:col-span-2 lg:col-span-auto"
                : i === 1
                  ? "lg:[grid-area:b]"
                  : i === 2
                    ? "lg:[grid-area:c]"
                    : i === 3
                      ? "lg:[grid-area:d]"
                      : "lg:[grid-area:e] sm:col-span-2 lg:col-span-auto";

            return (
              <div
                key={panel.title}
                ref={(el) => {
                  panelRefs.current[i] = el;
                }}
                className={`group relative overflow-hidden rounded-2xl md:rounded-3xl shadow-md ${
                  panel.span === "wide"
                    ? "h-[200px] sm:h-[220px] lg:h-[240px]"
                    : panel.span === "tall"
                      ? "h-[250px] sm:h-[280px] lg:h-full lg:min-h-[496px]"
                      : "h-[180px] sm:h-[220px] lg:h-[240px]"
                } ${desktopAreaClass}`}
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
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
                className="absolute inset-x-0 bottom-0 p-4 sm:p-5 md:p-6"
              >
                <h3 className="font-bold text-[17px] leading-tight text-white md:text-[20px]">{panel.title}</h3>
                <p className="mt-1 max-w-[36ch] text-[12px] leading-relaxed text-white/85">{panel.description}</p>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </section>
  );
}
