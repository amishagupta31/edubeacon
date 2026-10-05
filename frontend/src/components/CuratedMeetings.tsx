"use client";

import {
  ClipboardList,
  Search,
  Mail,
  CalendarCheck,
  Handshake,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useModal } from "./modals/ModalProvider";
import Container from "./ui/Container";

const flowSteps = [
  {
    num: "01",
    icon: ClipboardList,
    title: "Requirement",
    desc: "School shares institutional needs & priorities.",
  },
  {
    num: "02",
    icon: Search,
    title: "AI & Editorial Match",
    desc: "We curate verified vendors matching the exact criteria.",
  },
  {
    num: "03",
    icon: Mail,
    title: "Direct Intro",
    desc: "Pre-event briefing & matched introductions.",
  },
  {
    num: "04",
    icon: CalendarCheck,
    title: "Curated 1:1 Meeting",
    desc: "Private 20-min discussion in the executive lounge.",
  },
  {
    num: "05",
    icon: Handshake,
    title: "Partnership & Pilot",
    desc: "Seamless rollout & ongoing institutional support.",
  },
];

export default function CuratedMeetings() {
  const { openModal } = useModal();

  return (
    <section id="meetings" className="py-14 md:py-20 bg-[#F8FAF8] relative overflow-hidden">
      {/* Subtle ambient mint glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-10 reveal">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-[#0E733B] text-[11px] font-bold uppercase tracking-[0.2em] px-4.5 py-1.5 rounded-full mb-3.5 border border-emerald-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0E733B]" />
            <span>Curated Connections</span>
          </div>
          <h2 className="font-bold text-[32px] md:text-[42px] text-charcoal leading-[1.15] mb-3 tracking-tight">
            Meaningful Connections{" "}
            <span className="text-[#0E733B]">Real Opportunities</span>
          </h2>
          <p className="text-[15.5px] leading-relaxed text-slate-soft max-w-[54ch] mx-auto font-normal">
            EduBeacon goes beyond the crowded exhibition floor. We facilitate pre-matched, high-intent 1:1 conversations between schools and solution providers.
          </p>
        </div>

        {/* Unified Premium Master Card */}
        <div className="bg-white rounded-3xl border border-emerald-200/80 p-6 sm:p-8 md:p-10 shadow-[0_8px_30px_rgba(14,115,59,0.06)] relative overflow-hidden reveal">
          
          {/* Top Label Strip */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0E733B]">
                THE 5-STEP MATCHMAKING PIPELINE
              </span>
              <h3 className="font-bold text-[18px] text-charcoal mt-0.5">
                From Need Assessment to Active Implementation
              </h3>
            </div>
            <button
              onClick={() => openModal("school-register")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[#0E733B] hover:bg-[#0E733B] hover:text-white transition-all text-[12.5px] font-bold shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Request 1:1 Matchmaking →
            </button>
          </div>

          {/* 5-Step Connected Flow Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 py-8 relative">
            {flowSteps.map((step, idx) => (
              <div
                key={step.num}
                className="group relative flex flex-col p-4 sm:p-5 rounded-2xl bg-[#F8FAF8] border border-emerald-100/70 hover:bg-white hover:border-emerald-300 hover:shadow-md transition-all duration-300"
              >
                {/* Step number badge & Icon */}
                <div className="flex items-center justify-between mb-3.5">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 font-mono font-bold text-[11px] text-[#0E733B] flex items-center justify-center">
                    {step.num}
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-white border border-emerald-100 text-[#0E733B] flex items-center justify-center group-hover:bg-[#0E733B] group-hover:text-white transition-colors duration-300 shadow-2xs">
                    <step.icon className="w-4 h-4" strokeWidth={1.75} />
                  </div>
                </div>

                <h4 className="font-bold text-[14px] text-charcoal mb-1.5 group-hover:text-[#0E733B] transition-colors">
                  {step.title}
                </h4>
                <p className="text-[12px] text-slate-soft leading-relaxed font-normal">
                  {step.desc}
                </p>

                {/* Subtle right connector indicator for desktop */}
                {idx < flowSteps.length - 1 && (
                  <div className="hidden md:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-20 text-emerald-300 pointer-events-none">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom Credibility & Statistics Strip */}
          <div className="pt-6 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="sm:border-r sm:border-stone-100 sm:pr-4">
              <p className="font-bold text-[28px] md:text-[34px] text-[#0E733B] leading-none">
                5000+
              </p>
              <p className="text-[12.5px] text-slate-soft font-semibold mt-1">
                Verified Schools in Network
              </p>
            </div>

            <div className="sm:border-r sm:border-stone-100 sm:pr-4">
              <p className="font-bold text-[28px] md:text-[34px] text-[#0E733B] leading-none">
                300+
              </p>
              <p className="text-[12.5px] text-slate-soft font-semibold mt-1">
                Trusted Solution Providers
              </p>
            </div>

            <div>
              <p className="font-bold text-[28px] md:text-[34px] text-[#0E733B] leading-none">
                2,000+
              </p>
              <p className="text-[12.5px] text-slate-soft font-semibold mt-1">
                Curated Connections Made
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
