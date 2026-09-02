"use client";

import Image from "next/image";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Container from "./ui/Container";
import { speakers } from "@/lib/data";

export default function SpeakersSection() {
  const railRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (dir: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector<HTMLElement>("[data-card]");
    const step = (card?.offsetWidth ?? 220) + 20; // card width + gap
    rail.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section id="speakers" className="py-20 md:py-28 bg-[#0A0E17] overflow-hidden text-white border-t border-white/10">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 reveal">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/15 text-emerald-300 text-[11px] font-bold uppercase tracking-[0.2em] px-4.5 py-1.5 rounded-full mb-4 border border-emerald-500/30 backdrop-blur-md">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Featured Speakers</span>
            </div>
            <h2 className="font-bold text-[32px] md:text-[44px] text-white leading-[1.12] tracking-tight">
              Learn From Visionaries Shaping{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">
                the Future of Education
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                document.getElementById("conference")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="border border-emerald-400/40 text-emerald-300 px-6 py-3 rounded-full text-[13px] font-semibold hover:bg-emerald-500/10 transition-all backdrop-blur-md"
            >
              View Program
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <button
                aria-label="Previous speaker"
                onClick={() => scrollByCard(-1)}
                className="w-11 h-11 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-emerald-500/20 hover:border-emerald-400/40 transition-all"
              >
                <ChevronLeft className="w-5 h-5" strokeWidth={2} />
              </button>
              <button
                aria-label="Next speaker"
                onClick={() => scrollByCard(1)}
                className="w-11 h-11 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-emerald-500/20 hover:border-emerald-400/40 transition-all"
              >
                <ChevronRight className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>

        {/* Speaker slider */}
        <div
          ref={railRef}
          className="scroll-rail flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 md:mx-0 md:px-0"
        >
          {speakers.map((speaker, i) => (
            <div
              key={speaker.name}
              data-card
              className={`group shrink-0 snap-start w-[180px] sm:w-[200px] md:w-[220px] bg-slate-900/70 border border-white/15 rounded-2xl overflow-hidden hover:border-emerald-400/40 hover:bg-slate-900 transition-all duration-300 backdrop-blur-md reveal reveal-delay-${Math.min(i + 1, 4)}`}
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={speaker.image}
                  alt={speaker.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="220px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17]/95 via-[#0A0E17]/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-bold text-[14.5px] text-white leading-tight">
                    {speaker.name}
                  </h3>
                  <p className="text-[11px] text-slate-300/80 mt-1 leading-tight line-clamp-1 font-medium">
                    {speaker.title}
                  </p>
                  <p className="text-[11px] text-emerald-400 mt-0.5 font-bold line-clamp-1">
                    {speaker.organization}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

