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

export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const eyebrowRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const bgGlow1Ref = useRef<HTMLDivElement>(null);
  const bgGlow2Ref = useRef<HTMLDivElement>(null);

  // GSAP Page Load & Scroll Animations
  useIsomorphicLayoutEffect(() => {
    ensureGsapRegistered();
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(
          [
            eyebrowRef.current,
            ...lineRefs.current,
            paraRef.current,
            ctaRef.current,
          ],
          { opacity: 1, y: 0, scale: 1 }
        );
        return;
      }

      // Page Load Sequence
      const tl = gsap.timeline({ defaults: { ease: EASE.entrance } });

      tl.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5 },
        0.1
      )
        .fromTo(
          lineRefs.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: EASE.entrance,
          },
          0.2
        )
        .fromTo(
          paraRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5 },
          0.55
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
          0.7
        );

      // Scroll Parallax Effect
      gsap.to(contentRef.current, {
        y: -40,
        opacity: 0.95,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      gsap.to(bgGlow1Ref.current, {
        y: 80,
        x: 40,
        scale: 1.15,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(bgGlow2Ref.current, {
        y: -60,
        x: -40,
        scale: 0.9,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const scrollToNext = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="top"
      ref={rootRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-28 pb-16 lg:py-0 lg:h-screen lg:min-h-[740px] bg-[#0A0E17]"
    >
      {/* ──────────────── Background Video (No Sound, Looping) ──────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <Image
          src="/videos/_10second_video_script03_sec__disco.gif"
          alt="EduBeacon Background Video"
          fill
          unoptimized
          priority
          className="object-cover object-center opacity-70 scale-105 filter brightness-105 contrast-105"
        />

        {/* Ambient Overlay Gradients - More transparent to show background clearly */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E17]/45 via-[#0A0E17]/25 to-[#0A0E17]/70" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#0A0E17]/20 to-[#0A0E17]/60" />

        {/* Soft Radial Glow Orbs */}
        <div
          ref={bgGlow1Ref}
          className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[70vw] h-[70vw] max-w-[950px] max-h-[950px] rounded-full opacity-45 blur-[140px]"
          style={{
            background:
              "radial-gradient(circle, rgba(14,115,59,0.4) 0%, rgba(16,185,129,0.2) 50%, transparent 75%)",
          }}
        />
        <div
          ref={bgGlow2Ref}
          className="absolute -bottom-[20%] left-1/2 -translate-x-1/2 w-[55vw] h-[55vw] max-w-[750px] max-h-[750px] rounded-full opacity-40 blur-[130px]"
          style={{
            background:
              "radial-gradient(circle, rgba(5,150,105,0.3) 0%, rgba(14,115,59,0.15) 50%, transparent 75%)",
          }}
        />
      </div>

      {/* ──────────────── CENTERED HERO CONTENT ──────────────── */}
      <div
        ref={contentRef}
        className="relative z-10 mx-auto w-full max-w-[1000px] px-6 sm:px-10 flex flex-col items-center text-center space-y-8"
      >
        {/* Eyebrow Badge */}
        <div ref={eyebrowRef} className="opacity-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-5 py-2 backdrop-blur-md shadow-lg shadow-emerald-500/10">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.25em] text-emerald-300">
              GLOBAL EDUCATION NETWORK • CONNECTED
            </span>
          </div>
        </div>

        {/* Main Centered Headline */}
        <h1 className="font-bold font-sans text-[48px] sm:text-[64px] md:text-[76px] lg:text-[84px] leading-[1.03] tracking-[-0.03em] text-white max-w-[20ch]">
          <span className="block overflow-hidden">
            <span
              ref={(el) => {
                lineRefs.current[0] = el;
              }}
              className="block opacity-0"
            >
              The Future
            </span>
          </span>
          <span className="block overflow-hidden">
            <span
              ref={(el) => {
                lineRefs.current[1] = el;
              }}
              className="block opacity-0"
            >
              of Education,
            </span>
          </span>
          <span className="block overflow-hidden">
            <span
              ref={(el) => {
                lineRefs.current[2] = el;
              }}
              className="block opacity-0 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-200 drop-shadow-[0_0_35px_rgba(14,115,59,0.5)]"
            >
              Connected.
            </span>
          </span>
        </h1>

        {/* Supporting Subheading */}
        <p
          ref={paraRef}
          className="text-slate-200 text-[17px] sm:text-[20px] leading-relaxed max-w-[50ch] font-normal opacity-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
        >
          Where schools, innovators, and world-class opportunities come together to create meaningful partnerships for the future of learning.
        </p>

        {/* Centered Primary CTA Button */}
        <div ref={ctaRef} className="pt-2 opacity-0 flex justify-center">
          <button
            onClick={scrollToNext}
            className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#0E733B] via-[#059669] to-[#10B981] px-9 py-4.5 text-[15px] font-semibold text-white transition-all duration-300 hover:from-[#0B5C2F] hover:to-[#059669] hover:shadow-[0_20px_45px_-10px_rgba(14,115,59,0.65)] hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <span>Explore EduBeacon</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>
      </div>

      {/* ──────────────── Bottom Subtle Transition Gradient ──────────────── */}
      <div className="absolute bottom-0 inset-x-0 h-24 pointer-events-none bg-gradient-to-t from-[#0A0E17] to-transparent" />
    </section>
  );
}

