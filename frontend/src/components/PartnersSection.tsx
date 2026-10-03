"use client";

import Container from "./ui/Container";
import { partnerGroups } from "@/lib/data";

export default function PartnersSection() {
  return (
    <section id="partners" className="py-20 md:py-28 bg-[#FDFBF7]">
      <Container>
        <div className="text-center mb-14 reveal">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-[#0E733B] text-[11px] font-bold uppercase tracking-[0.2em] px-4.5 py-1.5 rounded-full mb-5 border border-emerald-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0E733B]" />
            <span>Our Ecosystem</span>
          </div>
          <h2 className="font-bold text-[34px] md:text-[46px] text-charcoal leading-[1.1] mb-4 tracking-tight">
            Our Education Ecosystem
          </h2>
          <p className="text-[16px] leading-relaxed text-slate-soft max-w-[48ch] mx-auto font-normal">
            Edubeacon is trusted by schools, universities, industry leaders and organizations driving the future of education in India.
          </p>
        </div>

        <div className="flex flex-col gap-12">
          {partnerGroups.map((group, gi) => (
            <div key={group.tier} className={`reveal reveal-delay-${Math.min(gi + 1, 4)}`}>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0E733B] mb-6 text-center">
                {group.tier}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {group.names.map((name) => (
                  <div
                    key={name}
                    className="bg-white border border-line rounded-xl px-6 py-3.5 text-[14px] font-semibold text-slate-700 hover:border-[#0E733B]/40 hover:text-[#0E733B] hover:shadow-md transition-all duration-200 cursor-pointer shadow-sm"
                  >
                    {name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center bg-emerald-50/60 rounded-2xl border border-emerald-100 py-8 px-6 reveal">
          <p className="text-[15px] text-slate-700 font-medium mb-3">
            Interested in becoming an Edubeacon Education Partner?
          </p>
          <a
            href="mailto:partners@edubeacon.com"
            className="text-[14px] font-bold text-[#0E733B] hover:text-[#0B5C2F] transition-colors underline decoration-[#0E733B]/30 underline-offset-4"
          >
            Get in touch with our partnerships team →
          </a>
        </div>
      </Container>
    </section>
  );
}

