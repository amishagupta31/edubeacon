"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { School, Search, Handshake, Rocket, Sparkles } from "lucide-react";
import Container from "./ui/Container";
import { useModal } from "./modals/ModalProvider";

const journeyNodes = [
  {
    step: "01",
    phase: "REQUIREMENT",
    title: "School Needs",
    desc: "School defines key challenges & requirements",
    icon: School,
    x: 8,
    y: 62,
  },
  {
    step: "02",
    phase: "DISCOVERY",
    title: "Browse & Match",
    desc: "AI matching across 25+ verified solution areas",
    icon: Search,
    x: 35,
    y: 30,
  },
  {
    step: "03",
    phase: "ENGAGEMENT",
    title: "Connect & Demo",
    desc: "Direct 1:1 engagement & live classroom trials",
    icon: Handshake,
    x: 65,
    y: 68,
  },
  {
    step: "04",
    phase: "PARTNERSHIP",
    title: "Live Success",
    desc: "Partnership deployed with verified student impact",
    icon: Rocket,
    x: 92,
    y: 28,
  },
];

const pillars = [
  {
    eyebrow: "For Schools & Leaders",
    title: "Discover",
    description:
      "Schools can browse and discover innovative products, technologies and services across 25+ solution categories — all in one place.",
    cta: "Explore Solutions",
    ctaTarget: "solutions",
    accent: "#064E3B",
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
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % journeyNodes.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="about" className="py-14 md:py-20 bg-[#F8FAF8] relative overflow-hidden">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-10 reveal">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-[#0E733B] text-[11px] font-bold uppercase tracking-[0.2em] px-4.5 py-1.5 rounded-full mb-4 border border-emerald-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0E733B]" />
            <span>About Edubeacon</span>
          </div>
          <h2 className="font-bold text-[34px] md:text-[44px] text-charcoal leading-[1.1] text-balance mb-4 tracking-tight">
            One Platform{" "}
            <span className="text-[#0E733B]">Endless Education</span>{" "}
            Possibilities
          </h2>
          <p className="text-[16px] leading-relaxed text-slate-soft max-w-[54ch] mx-auto font-normal">
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
              className={`flex flex-col p-8 md:p-9 bg-white rounded-2xl border border-line shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 reveal reveal-delay-${i + 1}`}
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
                    onClick={() => {
                      const target = document.getElementById(pillar.ctaTarget!);
                      if (target) target.scrollIntoView({ behavior: "smooth" });
                      else router.push(`/${pillar.ctaTarget}`);
                    }}
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

        {/* ── COMPACT PREMIUM WHITE & EMERALD FLIGHT PATH TRAJECTORY ── */}
        <div className="mt-10 rounded-3xl bg-white border border-emerald-200/80 p-6 sm:p-8 md:p-10 shadow-[0_8px_30px_rgba(14,115,59,0.05)] relative overflow-hidden reveal">
          
          {/* Subtle Ambient Mint Washes */}
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-emerald-100/35 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-teal-100/30 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="relative z-10 text-center mb-6 md:mb-8">
            <span className="inline-block text-[10.5px] font-extrabold uppercase tracking-[0.25em] text-[#0E733B] bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200/80 shadow-xs">
              HOW IT WORKS
            </span>
          </div>

          {/* Desktop Compact Curved Flight Canvas */}
          <div className="hidden lg:block relative w-full h-[230px]">
            {/* SVG Winding Curved Dotted Track */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 1000 230"
              fill="none"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="lightOrbitGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.5" />
                  <stop offset="50%" stopColor="#0E733B" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0.6" />
                </linearGradient>

                {/* Compact Smooth Bézier Path */}
                <path
                  id="lightFlightCurve"
                  d="M 80,145 C 200,55 240,60 350,75 C 470,95 530,205 650,160 C 760,120 820,60 920,70"
                />
              </defs>

              {/* Subtle Glow Trail */}
              <use
                href="#lightFlightCurve"
                stroke="#A7F3D0"
                strokeWidth="5"
                strokeOpacity="0.6"
                strokeLinecap="round"
                className="blur-[3px]"
              />

              {/* Main Dotted Curved Line */}
              <use
                href="#lightFlightCurve"
                stroke="url(#lightOrbitGrad)"
                strokeWidth="2.5"
                strokeDasharray="6,6"
                strokeLinecap="round"
              />

              {/* Animated Flying Rocket Marker */}
              <g>
                <animateMotion
                  dur="7s"
                  repeatCount="indefinite"
                  rotate="auto"
                >
                  <mpath href="#lightFlightCurve" />
                </animateMotion>
                
                {/* Rocket Icon / Probe */}
                <circle r="5" fill="#0E733B" />
                <circle r="10" fill="#10B981" opacity="0.3" className="animate-ping" />
                <path
                  d="M -4,-2 L -12,-4 L -9,0 L -12,4 L -4,2 Z"
                  fill="#059669"
                  opacity="0.9"
                />
              </g>
            </svg>

            {/* 4 Waypoint Stations */}
            {journeyNodes.map((node, idx) => {
              const isActive = activeStep === idx;

              return (
                <div
                  key={node.step}
                  onClick={() => setActiveStep(idx)}
                  className="cursor-pointer group absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center text-center transition-all duration-400"
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                >
                  {/* Phase Eyebrow */}
                  <span className="text-[9.5px] font-extrabold uppercase tracking-widest text-[#0E733B] mb-1.5 group-hover:text-[#0B5C2F] transition-colors">
                    {node.phase}
                  </span>

                  {/* Waypoint Icon Station */}
                  <div className="relative mb-1.5">
                    {/* Active Ping Halo */}
                    {isActive && (
                      <div className="absolute inset-0 -m-1.5 rounded-2xl bg-emerald-400/30 animate-ping pointer-events-none" />
                    )}

                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-400 ${
                        isActive
                          ? "bg-gradient-to-br from-[#0E733B] to-[#10B981] text-white shadow-md shadow-emerald-700/30 ring-3 ring-emerald-300/60 scale-110"
                          : "bg-[#F0FDF4] border border-emerald-200 text-[#0E733B] shadow-xs group-hover:bg-[#0E733B] group-hover:text-white group-hover:scale-105 group-hover:border-transparent"
                      }`}
                    >
                      <node.icon className="w-5 h-5 transition-transform" strokeWidth={1.9} />
                    </div>

                    {/* Step Badge */}
                    <div className="absolute -bottom-1.5 bg-white border border-emerald-200 shadow-xs rounded-full px-1.5 py-0.2 text-[8.5px] font-black text-[#0E733B]">
                      {node.step}
                    </div>
                  </div>

                  {/* Station Title & Description */}
                  <div className="mt-2 max-w-[145px]">
                    <h4
                      className={`font-bold text-[13px] leading-tight transition-colors ${
                        isActive ? "text-[#0E733B]" : "text-charcoal group-hover:text-[#0E733B]"
                      }`}
                    >
                      {node.title}
                    </h4>
                    <p className="text-[10.5px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
                      {node.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile / Tablet Responsive Fallback */}
          <div className="lg:hidden flex flex-col gap-4 relative">
            <div className="absolute left-5 top-6 bottom-6 w-0.5 border-l-2 border-dashed border-emerald-300 pointer-events-none" />

            {journeyNodes.map((node, idx) => (
              <div
                key={node.step}
                onClick={() => setActiveStep(idx)}
                className="relative flex items-start gap-3.5 p-3 rounded-2xl bg-[#F8FAF8] border border-emerald-100/80"
              >
                <div className="relative shrink-0 z-10">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-[#0E733B] flex items-center justify-center">
                    <node.icon className="w-4 h-4" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 bg-white text-[8px] font-bold text-[#0E733B] px-1.5 rounded-full border border-emerald-200">
                    {node.step}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#0E733B]">
                    {node.phase}
                  </span>
                  <h4 className="font-bold text-xs text-charcoal">{node.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{node.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </Container>
    </section>
  );
}
