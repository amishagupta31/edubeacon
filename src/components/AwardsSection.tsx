"use client";

import Image from "next/image";
import { Trophy } from "lucide-react";
import { useModal } from "./modals/ModalProvider";
import Container from "./ui/Container";
import { awardCategories } from "@/lib/data";
import { img } from "@/lib/images";

export default function AwardsSection() {
  const { openModal } = useModal();

  return (
    <section id="awards" className="py-20 md:py-28 bg-gradient-to-b from-gold-light/60 to-warm-ivory">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          {/* Left */}
          <div className="reveal">
            <div className="inline-block bg-gold/10 text-gold text-[11px] font-semibold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full mb-6 border border-gold/20">
              Edubeacon Awards
            </div>
            <h2 className="font-display font-bold text-[34px] md:text-[46px] text-charcoal leading-[1.1] mb-5">
              Celebrating Innovation{" "}
              <span className="text-gold">in Education</span>
            </h2>
            <p className="text-[15.5px] leading-relaxed text-slate-soft mb-8">
              The Edubeacon Awards recognize outstanding schools, education leaders, and innovative companies who are shaping the future of learning in India. Nominations open to all schools, companies and individuals.
            </p>

            <div className="relative rounded-2xl overflow-hidden aspect-video shadow-xl mb-6">
              <Image
                src={img.awards}
                alt="Edubeacon Awards Ceremony"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 to-transparent" />
              <div className="absolute bottom-4 left-4 bg-white/90 rounded-xl px-4 py-2.5">
                <p className="text-[12px] font-bold text-charcoal">Awards Ceremony</p>
                <p className="text-[11px] text-slate-soft">Day 2 — Evening Gala</p>
              </div>
            </div>

            <button
              id="awards-nominate"
              onClick={() => openModal("award-nominate")}
              className="bg-gold text-white px-8 py-4 rounded-xl font-bold text-[15px] hover:opacity-90 transition-opacity shadow-md"
            >
              <Trophy className="inline w-4 h-4 -mt-0.5 mr-1.5" strokeWidth={2} />
              Nominate for an Award →
            </button>
          </div>

          {/* Right: Award categories */}
          <div className="reveal reveal-delay-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-soft mb-5">
              Award Categories
            </p>
            <div className="flex flex-col gap-3">
              {awardCategories.map((award, i) => (
                <div
                  key={award.title}
                  className={`bg-white rounded-2xl border border-line p-5 flex items-start gap-4 card-lift reveal reveal-delay-${Math.min(i + 1, 4)}`}
                >
                  <div className="w-11 h-11 rounded-xl bg-gold-light flex items-center justify-center shrink-0">
                    <award.icon className="w-5 h-5 text-gold" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-[15px] text-charcoal mb-1">
                      {award.title}
                    </h4>
                    <p className="text-[13px] text-slate-soft leading-snug">
                      {award.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
