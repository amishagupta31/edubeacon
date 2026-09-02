"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  gsap,
  ensureGsapRegistered,
  useIsomorphicLayoutEffect,
  prefersReducedMotion,
  EASE,
} from "./eduwecan/gsapSetup";
import { speakers } from "@/lib/data";

// Card color themes for diversity
const cardBackgrounds = [
  "linear-gradient(135deg, #E0E7FF 0%, #EEF2FF 100%)", // Lavender Indigo
  "linear-gradient(135deg, #E0F2FE 0%, #F0F9FF 100%)", // Sky Pastel
  "linear-gradient(135deg, #DCFCE7 0%, #F0FDF4 100%)", // Mint Green
  "linear-gradient(135deg, #FFEDD5 0%, #FFF7ED 100%)", // Warm Peach
  "linear-gradient(135deg, #FCE7F3 0%, #FDF2F8 100%)", // Soft Rose
  "linear-gradient(135deg, #E2E8F0 0%, #F8FAFC 100%)", // Slate Platinum
  "linear-gradient(135deg, #FEF3C7 0%, #FFFBEB 100%)", // Amber Cream
  "linear-gradient(135deg, #CCFBF1 0%, #F0FDFA 100%)", // Teal Soft
];

export default function SpeakersSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
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
            cardRefs.current.forEach((card) => {
              if (!card) return;
              const rect = card.getBoundingClientRect();
              const center = rect.left + rect.width / 2;
              const dist = Math.abs(viewportCenter - center);
              const proximity = gsap.utils.clamp(0, 1, 1 - dist / (window.innerWidth * 0.65));
              gsap.set(card, {
                scale: gsap.utils.interpolate(0.96, 1, proximity),
                opacity: gsap.utils.interpolate(0.85, 1, proximity),
              });
            });
          },
        },
      });

      gsap.fromTo(
        section.querySelector("[data-speaker-heading]"),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: EASE.entrance,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="speakers"
      ref={sectionRef}
      className={`relative overflow-hidden py-20 ${
        reduced ? "" : "md:py-16 md:h-screen md:flex md:flex-col md:justify-center"
      }`}
      style={{ background: "var(--color-ewc-ivory, #FAF9F5)" }}
    >
      <div className="w-full">
        {/* ──────────────── Section Heading on Top ──────────────── */}
        <div
          data-speaker-heading
          className="mx-auto mb-8 md:mb-10 max-w-[1320px] px-6 md:px-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0E733B]/20 bg-[#0E733B]/10 px-4 py-1.5 backdrop-blur-md mb-3">
              <div className="w-2 h-2 rounded-full bg-[#0E733B] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0E733B]">
                FEATURED SPEAKERS
              </span>
            </div>
            <h2 className="font-display text-[32px] sm:text-[38px] md:text-[44px] leading-[1.12] font-semibold text-[#1A202C] tracking-tight">
              Learn From Visionaries Shaping the Future of Education
            </h2>
            <p className="mt-2 text-[15px] sm:text-[16px] text-slate-600 max-w-[65ch]">
              Keynote speakers, industry pioneers, and policy makers leading transformation in modern schooling.
            </p>
          </div>

          <button
            onClick={() => {
              document.getElementById("conference")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="self-start md:self-auto shrink-0 inline-flex items-center gap-2 rounded-full border border-[#0E733B]/30 bg-white px-6 py-2.5 text-[13px] font-semibold text-[#0E733B] shadow-sm transition-all hover:bg-[#0E733B]/5 hover:border-[#0E733B]/50"
          >
            <span>View Full Program</span>
            <span>→</span>
          </button>
        </div>

        {/* ──────────────── Horizontal Scrolling Rail ──────────────── */}
        <div
          ref={trackRef}
          className={`scroll-rail flex items-stretch gap-6 px-6 md:px-10 ${
            reduced ? "overflow-x-auto pb-4" : "overflow-x-auto md:overflow-visible"
          }`}
        >
          {speakers.map((speaker, i) => {
            const bgGradient = cardBackgrounds[i % cardBackgrounds.length];
            return (
              <div
                key={speaker.name}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="group flex w-[290px] sm:w-[320px] md:w-[360px] shrink-0 flex-col gap-4 rounded-[1.75rem] p-6 shadow-sm border border-black/5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5"
                style={{ background: bgGradient }}
              >
                {/* Speaker Photo */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.2rem] bg-slate-200 shadow-inner">
                  <Image
                    src={speaker.image}
                    alt={speaker.name}
                    fill
                    sizes="360px"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  {speaker.topic && (
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 rounded-lg bg-black/65 backdrop-blur-md px-3 py-1.5 text-[11px] font-medium text-white line-clamp-1 border border-white/10">
                      <span className="text-emerald-300 font-semibold mr-1">Topic:</span>
                      {speaker.topic}
                    </div>
                  )}
                </div>

                {/* Speaker Info */}
                <div className="flex flex-col flex-1 justify-between gap-3">
                  <div>
                    <h3 className="font-display text-[20px] font-bold text-[#1A202C] leading-snug">
                      {speaker.name}
                    </h3>
                    <p className="text-[13px] font-medium text-slate-700 leading-tight mt-1">
                      {speaker.title}
                    </p>
                    <p className="text-[12.5px] font-bold text-[#0E733B] mt-0.5">
                      {speaker.organization}
                    </p>
                  </div>

                  {/* Expertise Tags */}
                  {speaker.expertise && speaker.expertise.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {speaker.expertise.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-xs border border-black/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

