"use client";

import Container from "./ui/Container";
import { partnerGroups } from "@/lib/data";

export default function PartnersSection() {
  return (
    <section id="partners" className="py-20 md:py-28 bg-warm-ivory">
      <Container>
        <div className="text-center mb-14 reveal">
          <div className="inline-block bg-sage-pastel text-green-700 text-[11px] font-semibold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full mb-5 border border-green-200">
            Our Ecosystem
          </div>
          <h2 className="font-display font-bold text-[34px] md:text-[46px] text-charcoal leading-[1.1] mb-4">
            Our Education Ecosystem
          </h2>
          <p className="text-[16px] leading-relaxed text-slate-soft max-w-[48ch] mx-auto">
            Edubeacon is trusted by schools, universities, industry leaders and organizations driving the future of education in India.
          </p>
        </div>

        <div className="flex flex-col gap-12">
          {partnerGroups.map((group, gi) => (
            <div key={group.tier} className={`reveal reveal-delay-${Math.min(gi + 1, 4)}`}>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-soft/70 mb-6 text-center">
                {group.tier}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {group.names.map((name) => (
                  <div
                    key={name}
                    className="bg-white border border-line rounded-xl px-6 py-3.5 text-[14px] font-semibold text-slate hover:border-edu-blue/30 hover:text-edu-blue hover:shadow-sm transition-all cursor-pointer"
                  >
                    {name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center bg-sky-pastel/50 rounded-2xl border border-edu-blue/10 py-8 px-6 reveal">
          <p className="text-[15px] text-slate-soft mb-4">
            Interested in becoming an Edubeacon Education Partner?
          </p>
          <a
            href="mailto:partners@Edubeacon.com"
            className="text-[14px] font-bold text-edu-blue hover:text-teal transition-colors underline decoration-edu-blue/30 underline-offset-3"
          >
            Get in touch with our partnerships team →
          </a>
        </div>
      </Container>
    </section>
  );
}
