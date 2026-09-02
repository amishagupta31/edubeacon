"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";
import {
  gsap,
  ScrollTrigger,
  ensureGsapRegistered,
  useIsomorphicLayoutEffect,
  prefersReducedMotion,
  EASE,
} from "./gsapSetup";
import { ewcImg } from "./images";

export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  const eyebrowRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const floatCardRef = useRef<HTMLDivElement>(null);
  const floatBadgeRef = useRef<HTMLDivElement>(null);

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
            imageContainerRef.current,
            floatCardRef.current,
            floatBadgeRef.current,
          ],
          { opacity: 1, y: 0, scale: 1 }
        );
        return;
      }

      // Page Load Sequence
      const tl = gsap.timeline({ defaults: { ease: EASE.entrance } });

      // 1. Eyebrow fades upward (0.5s)
      tl.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5 },
        0.1
      )
        // 2. Headline reveals line by line (Opacity 0->1, Y 30px->0, Duration 0.8s, Stagger 0.12s)
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
        // 3. Supporting text fades in (0.5s)
        .fromTo(
          paraRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5 },
          0.55
        )
        // 4. CTA fades upward (0.5s)
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
          0.7
        )
        // 5. Main image reveals through soft mask (Scale 1.04 -> 1, Duration 1.2s)
        .fromTo(
          imageContainerRef.current,
          { opacity: 0, scale: 1.04 },
          { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" },
          0.25
        )
        // 6. Floating statistic card and pill enter gently (Y 20px -> 0, Opacity 0 -> 1)
        .fromTo(
          [floatBadgeRef.current, floatCardRef.current],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: "power2.out" },
          0.8
        );

      // Scroll Transition
      // Content gently moves upward, image scales slightly, background glow shifts slowly
      gsap.to(leftColRef.current, {
        y: -45,
        opacity: 0.9,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      gsap.to(rightColRef.current, {
        y: -25,
        scale: 1.025,
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

  // Mouse Parallax Interaction (Max 4-8px for image, slightly more for floating elements)
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const root = rootRef.current;
    if (!root) return;

    let animId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = root.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      targetX = (e.clientX - centerX) / (rect.width / 2);
      targetY = (e.clientY - centerY) / (rect.height / 2);
    };

    const onMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const render = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;

      if (imageContainerRef.current) {
        const imgX = currentX * 6; // max ~6px
        const imgY = currentY * 6;
        imageContainerRef.current.style.transform = `translate3d(${imgX}px, ${imgY}px, 0)`;
      }

      if (floatCardRef.current) {
        const cardX = currentX * 13; // slightly more parallax depth (~13px)
        const cardY = currentY * 13;
        floatCardRef.current.style.transform = `translate3d(${cardX}px, ${cardY}px, 0)`;
      }

      if (floatBadgeRef.current) {
        const badgeX = currentX * -9; // subtle counter balance
        const badgeY = currentY * -9;
        floatBadgeRef.current.style.transform = `translate3d(${badgeX}px, ${badgeY}px, 0)`;
      }

      animId = requestAnimationFrame(render);
    };

    root.addEventListener("mousemove", onMouseMove);
    root.addEventListener("mouseleave", onMouseLeave);
    animId = requestAnimationFrame(render);

    return () => {
      root.removeEventListener("mousemove", onMouseMove);
      root.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  const scrollToNext = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="top"
      ref={rootRef}
      className="relative min-h-screen w-full flex items-center overflow-hidden pt-28 pb-16 lg:py-0 lg:h-screen lg:min-h-[740px]"
      style={{ background: "#F7F5F0" }}
    >
      {/* ──────────────── Background Atmosphere ──────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft pastel radial background wash */}
        <div
          ref={bgGlow1Ref}
          className="absolute -top-[20%] -right-[10%] w-[65vw] h-[65vw] max-w-[900px] max-h-[900px] rounded-full opacity-60 blur-[130px]"
          style={{
            background:
              "radial-gradient(circle, #D6CCF2 0%, #C9DDED 50%, transparent 75%)",
          }}
        />
        <div
          ref={bgGlow2Ref}
          className="absolute -bottom-[20%] left-[10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full opacity-50 blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, #CFE0D2 0%, #D6CCF2 50%, transparent 75%)",
          }}
        />

        {/* Faint invisible grid for high-end editorial feel */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(#2F3440 0.75px, transparent 0.75px)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* ──────────────── Main Two-Column Hero Composition ──────────────── */}
      <div className="relative z-10 mx-auto w-full max-w-[1360px] px-6 sm:px-10 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[42fr_58fr] items-center gap-12 lg:gap-16 xl:gap-24">
          
          {/* ──────── LEFT SIDE: Content (~42% viewport) ──────── */}
          <div ref={leftColRef} className="flex flex-col items-start space-y-7 lg:pr-4">
            
            {/* Small Eyebrow */}
            <div ref={eyebrowRef} className="opacity-0">
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6F737B]">
                EDUCATION. CONNECTED.
              </span>
            </div>

            {/* Main Headline (Max 3 lines, large bold editorial typography) */}
            <h1 className="font-bold font-sans text-[44px] sm:text-[58px] md:text-[68px] lg:text-[64px] xl:text-[76px] leading-[1.04] tracking-[-0.025em] text-[#2F3440]">
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
                  className="block opacity-0 text-transparent bg-clip-text bg-gradient-to-r from-[#2F3440] via-[#1E3A5F] to-[#0D9488]"
                >
                  Connected.
                </span>
              </span>
            </h1>

            {/* Supporting Text (One short sentence only) */}
            <p
              ref={paraRef}
              className="text-[#6F737B] text-[16px] sm:text-[18px] leading-relaxed max-w-[40ch] font-normal opacity-0"
            >
              Where schools, innovators, and opportunities come together.
            </p>

            {/* Primary Button (Only one CTA) */}
            <div ref={ctaRef} className="pt-2 opacity-0">
              <button
                onClick={scrollToNext}
                className="group relative inline-flex items-center gap-3 rounded-full bg-[#2F3440] px-8 py-4 text-[14.5px] font-semibold text-[#F7F5F0] transition-all duration-300 hover:bg-[#1E222A] hover:shadow-[0_16px_36px_-12px_rgba(47,52,64,0.35)] hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <span>Explore EduBeacon</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </button>
            </div>
          </div>

          {/* ──────── RIGHT SIDE: Immersive Visual Experience (~58% viewport) ──────── */}
          <div ref={rightColRef} className="relative w-full lg:pl-2">
            
            {/* Main Image Container */}
            <div
              ref={imageContainerRef}
              className="relative w-full aspect-[4/3] sm:aspect-[1.25/1] lg:aspect-[1.18/1] xl:aspect-[1.25/1] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-[0_32px_75px_-20px_rgba(47,52,64,0.15)] bg-white/40 transition-transform duration-100 ease-out opacity-0"
            >
              <Image
                src={ewcImg.hero}
                alt="Modern international education conference and collaboration moment"
                fill
                priority
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover object-center transform scale-[1.02] transition-transform duration-700 hover:scale-[1.05]"
              />
              
              {/* Ultra subtle inner shadow gradient for cinematic frame depth */}
              <div className="absolute inset-0 pointer-events-none rounded-[2rem] sm:rounded-[2.5rem] ring-1 ring-inset ring-black/5 shadow-[inset_0_0_80px_rgba(0,0,0,0.06)]" />
            </div>

            {/* ──────── FLOATING ELEMENT 2: Label Pill (Top Right) ──────── */}
            <div
              ref={floatBadgeRef}
              className="absolute -top-4 -right-2 sm:-top-5 sm:-right-4 z-20 inline-flex items-center gap-2 rounded-full border border-[#E4E0D6] bg-white/90 backdrop-blur-md px-4.5 py-2.5 shadow-[0_12px_28px_-8px_rgba(47,52,64,0.1)] transition-transform duration-100 ease-out opacity-0"
            >
              <div className="w-2 h-2 rounded-full bg-[#0D9488] animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.18em] text-[#2F3440] uppercase">
                GLOBAL EDUCATION NETWORK
              </span>
            </div>

            {/* ──────── FLOATING ELEMENT 1: Stat Card (Bottom Left Overlapping) ──────── */}
            <div
              ref={floatCardRef}
              className="absolute -bottom-6 -left-4 sm:-bottom-8 sm:-left-8 z-20 min-w-[190px] sm:min-w-[210px] rounded-2xl border border-[#E4E0D6] bg-[#FFFFFF]/95 backdrop-blur-md p-4 sm:p-5 shadow-[0_20px_45px_-12px_rgba(47,52,64,0.14)] transition-transform duration-100 ease-out opacity-0"
            >
              <div className="flex flex-col space-y-1">
                <span className="font-sans font-bold text-[30px] sm:text-[34px] leading-none text-[#2F3440] tracking-tight">
                  500+
                </span>
                <span className="text-[12px] sm:text-[13px] font-medium text-[#6F737B] tracking-normal">
                  Schools Connected
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ──────────────── Bottom Subtle Transition Gradient ──────────────── */}
      <div className="absolute bottom-0 inset-x-0 h-24 pointer-events-none bg-gradient-to-t from-[#F7F5F0] to-transparent" />
    </section>
  );
}
