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
    accent: "#0D9488",
  },
  {
    eyebrow: "For Startups & Vendors",
    title: "Grow",
    description:
      "Startups and education businesses gain visibility, generate qualified leads and build meaningful long-term partnerships with schools.",
    cta: "List Your Solution",
    ctaModal: "vendor-register" as const,
    accent: "#D97706",
  },
];

export default function AboutSection() {
  const { openModal } = useModal();

  return (
    <section id="about" className="py-20 md:py-28 bg-warm-ivory">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-16 reveal">
          <div className="inline-block bg-sky-pastel text-edu-blue text-[11px] font-semibold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full mb-5 border border-edu-blue/10">
            About Edubeacon
          </div>
          <h2 className="font-display font-bold text-[36px] md:text-[48px] text-charcoal leading-[1.1] text-balance mb-5">
            One Platform.{" "}
            <span className="text-teal">Endless Education</span>{" "}
            Possibilities.
          </h2>
          <p className="text-[16px] leading-relaxed text-slate-soft max-w-[52ch] mx-auto">
            Edubeacon is the bridge between schools looking for the right
            solutions and the innovators building them. We make the education
            ecosystem work for everyone.
          </p>
        </div>

        {/* ── Asymmetric-corner cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => (
            <div
              key={pillar.title}
              className={`flex flex-col p-8 reveal reveal-delay-${i + 1}`}
              style={{
                background: "#E2E6EA",
                /* large radius top-right + bottom-left; tight on top-left + bottom-right */
                borderRadius: "12px 52px 12px 52px",
                transition: "transform 0.22s ease, box-shadow 0.22s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  "0 16px 40px -10px rgba(30,58,95,0.15)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "";
              }}
            >
              {/* Eyebrow */}
              <p
                className="text-[11.5px] font-bold uppercase tracking-[0.15em] mb-4"
                style={{ color: pillar.accent }}
              >
                {pillar.eyebrow}
              </p>

              {/* Title */}
              <h3 className="font-display font-bold text-[30px] text-charcoal mb-4 leading-none">
                {pillar.title}
              </h3>

              {/* Description */}
              <p className="text-[14.5px] leading-relaxed text-slate-soft flex-1 mb-8">
                {pillar.description}
              </p>

              {/* CTA Button */}
              <div>
                {pillar.ctaModal ? (
                  <button
                    onClick={() => openModal(pillar.ctaModal!)}
                    className="inline-flex items-center gap-2 text-white font-semibold text-[13.5px] px-5 py-2.5 rounded-lg transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-sm"
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
                    className="inline-flex items-center gap-2 text-white font-semibold text-[13.5px] px-5 py-2.5 rounded-lg transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-sm"
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
        <div className="mt-16 bg-white rounded-2xl border border-line p-8 md:p-10 reveal">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-soft mb-6 text-center">
            How It Works
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
            {journeySteps.map((step, i) =>
              step.arrow ? (
                <ArrowRight
                  key={i}
                  className="w-5 h-5 text-line mx-3 rotate-90 md:rotate-0 shrink-0"
                />
              ) : (
                <div key={i} className="text-center flex-1 max-w-[140px]">
                  <div className="w-12 h-12 rounded-xl bg-sky-pastel flex items-center justify-center mx-auto mb-2.5">
                    <step.icon className="w-6 h-6 text-edu-blue" strokeWidth={1.75} />
                  </div>
                  <p className="text-[12px] text-slate-soft leading-tight font-medium whitespace-pre-line">
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
