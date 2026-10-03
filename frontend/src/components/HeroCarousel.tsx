"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Hero from "@/components/eduwecan/Hero";
import ConferenceHeroSlide from "@/components/ConferenceHeroSlide";

const SLIDE_DURATION = 4000;
const SLIDES = 2;

export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((i: number) => {
    setActive(((i % SLIDES) + SLIDES) % SLIDES);
    setPaused(true);
  }, []);

  const next = useCallback(() => setActive((p) => (p + 1) % SLIDES), []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, SLIDE_DURATION);
    return () => clearInterval(id);
  }, [paused, next]);

  // Resume auto-play 8 s after a manual click
  useEffect(() => {
    if (!paused) return;
    const id = setTimeout(() => setPaused(false), 8000);
    return () => clearTimeout(id);
  }, [paused, active]);

  return (
    <div
      className="relative overflow-hidden min-h-[85vh] lg:min-h-[90vh]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slide 0 — Home Hero */}
      <div
        aria-hidden={active !== 0}
        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
          active === 0
            ? "opacity-100 z-10 pointer-events-auto"
            : "opacity-0 z-0 pointer-events-none"
        }`}
      >
        <Hero />
      </div>

      {/* Slide 1 — Conference Hero */}
      <div
        aria-hidden={active !== 1}
        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
          active === 1
            ? "opacity-100 z-10 pointer-events-auto"
            : "opacity-0 z-0 pointer-events-none"
        }`}
      >
        <ConferenceHeroSlide />
      </div>

      {/* ── Left Arrow ── */}
      <button
        onClick={() => go(active - 1)}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* ── Right Arrow ── */}
      <button
        onClick={() => go(active + 1)}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* ── Dot Indicators + Progress ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
        {Array.from({ length: SLIDES }).map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              active === i
                ? "w-7 h-2 bg-white"
                : "w-2 h-2 bg-white/35 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
