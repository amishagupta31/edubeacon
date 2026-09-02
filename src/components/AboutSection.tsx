"use client";

import { School, Search, Handshake, Rocket, ArrowRight, type LucideIcon } from "lucide-react";
import Container from "./ui/Container";
import { useModal } from "./modals/ModalProvider";

type JourneyStep =
  | { arrow: true; icon?: never; label?: never }
  | { arrow?: never; icon: LucideIcon; label: string };

const journeySteps: JourneyStep[] = [
  { icon: School, label: "School has a\nrequirement" },
  { arrow: true },
  { icon: Search, label: "Browses solution\ncategories" },
  { arrow: true },
  { icon: Handshake, label: "Connects with\nrelevant vendors" },
  { arrow: true },
  { icon: Rocket, label: "Partnership\ncreated" },
];

const pillars = [
  {
    eyebrow: "For Schools & Leaders",
    title: "Discover",
    description:
      "Schools can browse and discover innovative products, technologies and services across 25+ solution categories — all in one place.",
    cta: "Explore Solutions",
    ctaTarget: "solutions",
    accent: "#1E3A5F",
  },
  {
    eyebrow: "Smart Matchmaking",
    title: "Connect",
    description:
      "Edubeacon intelligently connects schools with the most relevant startups and vendors based on their specific requirements and needs.",
    cta: "Register Your School",
    ctaModal: "school-register" as const,
    accent: "#0E733B",
  },
  {
    eyebrow: "For Startups & Vendors",
    title: "Grow",
    description:
      "Startups and education businesses gain visibility, generate qualified leads and build meaningful long-term partnerships with schools.",
    cta: "List Your Solution",
    ctaModal: "vendor-register" as const,
    accent: "#059669",
  },
];

export default function AboutSection() {
  const { openModal } = useModal();

  return (
    <section id="about" className="py-20 md:py-28 bg-[#FDFBF7]">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-16 reveal">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-[#0E733B] text-[11px] font-bold uppercase tracking-[0.2em] px-4.5 py-1.5 rounded-full mb-5 border border-emerald-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0E733B]" />
            <span>About Edubeacon</span>
          </div>
          <h2 className="font-bold text-[36px] md:text-[48px] text-charcoal leading-[1.1] text-balance mb-5 tracking-tight">
            One Platform.{" "}
            <span className="text-[#0E733B]">Endless Education</span>{" "}
            Possibilities.
          </h2>
          <p className="text-[16.5px] leading-relaxed text-slate-soft max-w-[54ch] mx-auto font-normal">
            Edubeacon is the bridge between schools looking for the right
            solutions and the innovators building them. We make the education
            ecosystem work for everyone.
          </p>
        </div>

        {/* ── Pillar Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, i) => (
            <div
              key={pillar.title}
              className={`flex flex-col p-8 md:p-9 bg-white rounded-2xl border border-line shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 reveal reveal-delay-${i + 1}`}
            >
              {/* Eyebrow */}
              <p
                className="text-[11.5px] font-bold uppercase tracking-[0.18em] mb-4"
                style={{ color: pillar.accent }}
              >
                {pillar.eyebrow}
              </p>

              {/* Title */}
              <h3 className="font-bold text-[28px] text-charcoal mb-4 leading-none">
                {pillar.title}
              </h3>

              {/* Description */}
              <p className="text-[15px] leading-relaxed text-slate-soft flex-1 mb-8">
                {pillar.description}
              </p>

              {/* CTA Button */}
              <div>
                {pillar.ctaModal ? (
                  <button
                    onClick={() => openModal(pillar.ctaModal!)}
                    className="inline-flex items-center gap-2 text-white font-semibold text-[13.5px] px-6 py-3 rounded-xl transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 shadow-sm"
                    style={{ background: pillar.accent }}
                  >
                    {pillar.cta}
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      document
                        .getElementById(pillar.ctaTarget!)
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="inline-flex items-center gap-2 text-white font-semibold text-[13.5px] px-6 py-3 rounded-xl transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 shadow-sm"
                    style={{ background: pillar.accent }}
                  >
                    {pillar.cta}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Journey flow */}
        <div className="mt-16 bg-white rounded-2xl border border-line p-8 md:p-10 shadow-sm reveal">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0E733B] mb-8 text-center">
            HOW IT WORKS
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
            {journeySteps.map((step, i) =>
              step.arrow ? (
                <ArrowRight
                  key={i}
                  className="w-5 h-5 text-emerald-300 mx-3 rotate-90 md:rotate-0 shrink-0"
                />
              ) : (
                <div key={i} className="text-center flex-1 max-w-[150px]">
                  <div className="w-13 h-13 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-3">
                    <step.icon className="w-6 h-6 text-[#0E733B]" strokeWidth={1.75} />
                  </div>
                  <p className="text-[12.5px] text-slate-soft leading-tight font-semibold whitespace-pre-line">
                    {step.label}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

