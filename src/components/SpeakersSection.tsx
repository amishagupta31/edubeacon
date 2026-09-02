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
    <section id="speakers" className="py-14 md:py-20 bg-charcoal overflow-hidden">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 reveal">
          <div>
            <div className="inline-block bg-white/10 text-white/70 text-[11px] font-semibold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full mb-4 border border-white/15">
              Featured Speakers
            </div>
            <h2 className="font-display font-bold text-[28px] md:text-[36px] text-white leading-[1.15]">
              Learn From Visionaries Shaping{" "}
              <span className="text-teal">the Future of Education</span>
            </h2>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                document.getElementById("conference")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="border border-white/30 text-white px-5 py-2.5 rounded-lg text-[13px] font-semibold hover:bg-white/10 transition-colors"
            >
              View Conference Program
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <button
                aria-label="Previous speaker"
                onClick={() => scrollByCard(-1)}
                className="w-10 h-10 rounded-full border border-white/25 text-white flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <ChevronLeft className="w-[18px] h-[18px]" strokeWidth={2} />
              </button>
              <button
                aria-label="Next speaker"
                onClick={() => scrollByCard(1)}
                className="w-10 h-10 rounded-full border border-white/25 text-white flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <ChevronRight className="w-[18px] h-[18px]" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>

        {/* Speaker slider — one line, scroll/drag/arrows to move card by card */}
        <div
          ref={railRef}
          className="scroll-rail flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 md:mx-0 md:px-0"
        >
          {speakers.map((speaker, i) => (
            <div
              key={speaker.name}
              data-card
              className={`group shrink-0 snap-start w-[170px] sm:w-[190px] md:w-[205px] bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all reveal reveal-delay-${Math.min(i + 1, 4)}`}
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={speaker.image}
                  alt={speaker.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="210px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3.5">
                  <h3 className="font-display font-bold text-[13.5px] text-white leading-tight">
                    {speaker.name}
                  </h3>
                  <p className="text-[10.5px] text-white/70 mt-0.5 leading-tight line-clamp-1">
                    {speaker.title}
                  </p>
                  <p className="text-[10.5px] text-teal mt-0.5 font-medium line-clamp-1">
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
