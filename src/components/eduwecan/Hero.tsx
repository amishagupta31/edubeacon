"use client";

import Image from "next/image";
import { useRef } from "react";
import { 
  ChevronRight
} from "lucide-react";
import {
  gsap,
  ensureGsapRegistered,
  useIsomorphicLayoutEffect,
  prefersReducedMotion,
  EASE,
} from "./gsapSetup";
import { useModal } from "../modals/ModalProvider";

export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const { openModal } = useModal();

  // GSAP Entrance Animations
  useIsomorphicLayoutEffect(() => {
    ensureGsapRegistered();
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(cardRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
        });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: EASE.entrance } });

      tl.fromTo(
        cardRef.current,
        { opacity: 0, scale: 0.94, y: 25 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8 },
        0.1
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="top"
      ref={rootRef}
      className="relative min-h-[85vh] lg:min-h-[90vh] w-full flex flex-col justify-center items-center overflow-hidden bg-[#0A0E17] text-white py-12"
    >
      {/* ──────────────── Background Video (Autoplay, Loop, Muted) ──────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center opacity-65 scale-105 filter brightness-105 contrast-105"
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>

        {/* Ambient Dark & Green Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E17]/65 via-[#0A0E17]/35 to-[#0A0E17]/85" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#0A0E17]/30 to-[#0A0E17]/70" />

        {/* Soft Green Radial Glows */}
        <div
          className="absolute -top-[10%] left-[20%] w-[50vw] h-[50vw] max-w-[650px] max-h-[650px] rounded-full opacity-35 blur-[130px] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(14,115,59,0.45) 0%, rgba(52,211,153,0.2) 60%, transparent 80%)",
          }}
        />
        <div
          className="absolute -bottom-[10%] right-[15%] w-[50vw] h-[50vw] max-w-[650px] max-h-[650px] rounded-full opacity-30 blur-[130px] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(16,185,129,0.35) 0%, rgba(6,78,59,0.2) 60%, transparent 80%)",
          }}
        />
      </div>

      {/* ──────────────── CENTERPIECE STYLIZED BANNER (Compact & Elegant) ──────────────── */}
      <div className="relative z-10 w-full flex items-center justify-center px-4 sm:px-6 my-auto">
        <div 
          ref={cardRef}
          className="relative mx-auto w-full max-w-[540px] text-center opacity-0"
        >
          {/* Stylized Emerald / Mint L-Bracket Graphic Frames */}
          <div className="absolute -top-5 -left-4 sm:-top-7 sm:-left-6 w-20 sm:w-26 h-20 sm:h-26 border-t-[5px] sm:border-t-[7px] border-l-[5px] sm:border-l-[7px] border-transparent rounded-tl-2xl pointer-events-none [border-image:linear-gradient(to_bottom_right,#34D399,#0E733B)_1]" />
          <div className="absolute -bottom-5 -right-4 sm:-bottom-7 sm:-right-6 w-18 sm:w-24 h-18 sm:h-24 border-b-[5px] sm:border-b-[6px] border-r-[5px] sm:border-r-[6px] border-transparent rounded-br-2xl pointer-events-none [border-image:linear-gradient(to_top_left,#10B981,#059669)_1]" />

          {/* Main Card Shell with Glassmorphism */}
          <div className="relative rounded-2xl sm:rounded-3xl bg-[#061A10]/60 border border-emerald-400/30 px-5 sm:px-9 py-7 sm:py-9 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-2xl backdrop-saturate-150">
            
            {/* Center Brand Badge */}
            <div className="flex items-center justify-center gap-2 mb-2.5">
              <div className="bg-white/95 rounded-lg px-3 py-1 shadow-sm inline-flex items-center gap-2">
                <Image
                  src="/edubeacon-logo.png"
                  alt="eduBeacon"
                  width={110}
                  height={28}
                  className="h-5 w-auto object-contain"
                  priority
                />
              </div>
            </div>

            {/* Main Headline */}
            <div className="my-2.5">
              <h1 className="font-extrabold font-display leading-[1.06] tracking-tight">
                <span className="block text-2xl sm:text-3xl md:text-[36px] text-white">
                  The Future of
                </span>
                <span className="block text-3xl sm:text-4xl md:text-[46px] text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-200 drop-shadow-[0_4px_20px_rgba(16,185,129,0.35)] py-0.5">
                  Education,
                </span>
                <span className="block text-2xl sm:text-3xl md:text-[36px] text-white">
                  Connected.
                </span>
              </h1>
            </div>

            {/* Original Tagline */}
            <p className="text-slate-200 text-xs sm:text-[13.5px] leading-relaxed max-w-[42ch] mx-auto font-normal my-3.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Where schools, innovators, and world-class opportunities come together to create meaningful partnerships for the future of learning.
            </p>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1.5">
              <button
                onClick={() => openModal("school-register")}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full font-extrabold text-xs uppercase tracking-wider text-white bg-[#0E733B] hover:bg-[#0B5C2F] shadow-md shadow-emerald-950/30 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Register Your School
              </button>

              <button
                onClick={() => openModal("vendor-register")}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full font-extrabold text-xs uppercase tracking-wider text-charcoal bg-white shadow-md hover:bg-emerald-50 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Become a Partner
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────── Bottom Subtle Transition Button ──────────────── */}
      <div className="relative z-10 w-full pt-6 flex justify-center">
        <button
          onClick={() => scrollToSection("solutions")}
          className="text-[11px] font-bold uppercase tracking-widest text-emerald-300/80 hover:text-emerald-300 flex items-center gap-1 transition-colors"
        >
          <span>Explore Categories & Features</span>
          <ChevronRight className="w-3.5 h-3.5 rotate-90" />
        </button>
      </div>
    </section>
  );
}
