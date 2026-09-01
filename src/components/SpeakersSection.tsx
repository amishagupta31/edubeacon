"use client";

import Image from "next/image";
import Container from "./ui/Container";
import { speakers } from "@/lib/data";

export default function SpeakersSection() {
  return (
    <section id="speakers" className="py-20 md:py-28 bg-charcoal">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 reveal">
          <div>
            <div className="inline-block bg-white/10 text-white/70 text-[11px] font-semibold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full mb-5 border border-white/15">
              Featured Speakers
            </div>
            <h2 className="font-display font-bold text-[34px] md:text-[46px] text-white leading-[1.1]">
              Learn From Visionaries Shaping{" "}
              <span className="text-teal">the Future of Education</span>
            </h2>
          </div>
          <button
            onClick={() => {
              document.getElementById("conference")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="shrink-0 border border-white/30 text-white px-5 py-2.5 rounded-lg text-[13px] font-semibold hover:bg-white/10 transition-colors"
          >
            View Conference Program
          </button>
        </div>

        {/* Speaker Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {speakers.map((speaker, i) => (
            <div
              key={speaker.name}
              className={`group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all card-lift reveal reveal-delay-${Math.min(i + 1, 4)}`}
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={speaker.image}
                  alt={speaker.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-display font-bold text-[15px] text-white leading-tight">
                    {speaker.name}
                  </h3>
                  <p className="text-[11.5px] text-white/70 mt-0.5 leading-tight">
                    {speaker.title}
                  </p>
                  <p className="text-[11px] text-teal mt-0.5 font-medium">
                    {speaker.organization}
                  </p>
                </div>
              </div>
              {speaker.topic && (
                <div className="px-4 py-3 border-t border-white/10">
                  <p className="text-[11.5px] text-white/55 italic leading-snug">
                    &ldquo;{speaker.topic}&rdquo;
                  </p>
                </div>
              )}
              {/* Expertise tags */}
              <div className="px-4 pb-4 flex flex-wrap gap-1.5">
                {speaker.expertise.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-semibold bg-teal/15 text-teal px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
