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
    <section id="awards" className="py-14 md:py-20 bg-[#FDFBF7]">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left */}
          <div className="reveal">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-[#0E733B] text-[11px] font-bold uppercase tracking-[0.2em] px-4.5 py-1.5 rounded-full mb-4 border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0E733B]" />
              <span>Edubeacon Awards</span>
            </div>
            <h2 className="font-bold text-[34px] md:text-[44px] text-charcoal leading-[1.1] mb-4 tracking-tight">
              Celebrating Innovation{" "}
              <span className="text-[#0E733B]">in Education</span>
            </h2>
            <p className="text-[16px] leading-relaxed text-slate-soft mb-8 font-normal">
              The Edubeacon Awards recognize outstanding schools, education leaders, and innovative companies who are shaping the future of learning in India. Nominations open to all schools, companies and individuals.
            </p>

            <div className="relative rounded-2xl overflow-hidden aspect-video shadow-xl mb-6 border border-line">
              <Image
                src={img.awards}
                alt="Edubeacon Awards Ceremony"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17]/60 to-transparent" />
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md rounded-xl px-4 py-2.5 shadow-md">
                <p className="text-[12.5px] font-bold text-charcoal">Awards Ceremony</p>
                <p className="text-[11px] text-[#0E733B] font-semibold">Day 2 — Evening Gala</p>
              </div>
            </div>

            <button
              id="awards-nominate"
              onClick={() => openModal("award-nominate")}
              className="bg-[#0E733B] hover:bg-[#0B5C2F] text-white px-8 py-4 rounded-full font-bold text-[15px] transition-all shadow-md hover:shadow-emerald-950/20"
            >
              <Trophy className="inline w-4.5 h-4.5 -mt-0.5 mr-2" strokeWidth={2} />
              Nominate for an Award →
            </button>
          </div>

          {/* Right: Award categories */}
          <div className="reveal reveal-delay-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0E733B] mb-6">
              AWARD CATEGORIES
            </p>
            <div className="flex flex-col gap-4">
              {awardCategories.map((award, i) => (
                <div
                  key={award.title}
                  className={`bg-white rounded-2xl border border-line p-5 flex items-start gap-4 shadow-sm hover:shadow-lg hover:border-[#0E733B]/40 hover:-translate-y-0.5 transition-all duration-300 reveal reveal-delay-${Math.min(i + 1, 4)}`}
                >
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                    <award.icon className="w-5 h-5 text-[#0E733B]" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[16px] text-charcoal mb-1">
                      {award.title}
                    </h4>
                    <p className="text-[13px] text-slate-soft leading-relaxed font-normal">
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

