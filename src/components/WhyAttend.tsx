"use client";

import Container from "./ui/Container";
import { whyAttendSchools, whyAttendVendors } from "@/lib/data";

export default function WhyAttend() {
  return (
    <section id="why-attend" className="py-20 md:py-28 bg-warm-ivory">
      <Container>
        <div className="text-center mb-14 reveal">
          <div className="inline-block bg-gold-light text-gold text-[11px] font-semibold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full mb-5 border border-gold/20">
            Why Attend
          </div>
          <h2 className="font-display font-bold text-[34px] md:text-[46px] text-charcoal leading-[1.1]">
            Something Valuable for Everyone
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* For Schools */}
          <div className="bg-sky-pastel/60 rounded-2xl border border-edu-blue/10 p-8 reveal">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-edu-blue rounded-xl flex items-center justify-center text-xl">
                🏫
              </div>
              <h3 className="font-display font-bold text-[22px] text-edu-blue">
                For Schools
              </h3>
            </div>
            <ul className="flex flex-col gap-3.5">
              {whyAttendSchools.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span className="w-5 h-5 mt-0.5 rounded-full bg-edu-blue/15 flex items-center justify-center shrink-0">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="#1E3A5F"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="text-[14.5px] text-slate">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* For Vendors */}
          <div className="bg-teal-muted/40 rounded-2xl border border-teal/15 p-8 reveal reveal-delay-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-teal rounded-xl flex items-center justify-center text-xl">
                🚀
              </div>
              <h3 className="font-display font-bold text-[22px] text-teal">
                For Startups & Vendors
              </h3>
            </div>
            <ul className="flex flex-col gap-3.5">
              {whyAttendVendors.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span className="w-5 h-5 mt-0.5 rounded-full bg-teal/15 flex items-center justify-center shrink-0">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="#0D9488"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="text-[14.5px] text-slate">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
