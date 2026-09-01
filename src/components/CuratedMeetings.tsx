"use client";

import { useModal } from "./modals/ModalProvider";
import Container from "./ui/Container";

const steps = [
  { icon: "📋", label: "Requirement", desc: "School shares what they need" },
  { icon: "→", arrow: true },
  { icon: "🔍", label: "Matching", desc: "Edubeacon identifies relevant vendors" },
  { icon: "→", arrow: true },
  { icon: "📧", label: "Introduction", desc: "We make the connection" },
  { icon: "→", arrow: true },
  { icon: "📅", label: "Curated Meeting", desc: "1:1 conversation at the event" },
  { icon: "→", arrow: true },
  { icon: "🤝", label: "Partnership", desc: "Long-term relationship built" },
];

export default function CuratedMeetings() {
  const { openModal } = useModal();

  return (
    <section id="meetings" className="py-20 md:py-28 bg-edu-blue">
      <Container>
        <div className="text-center mb-14 reveal">
          <div className="inline-block bg-white/10 text-white text-[11px] font-semibold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full mb-5 border border-white/20">
            Curated Connections
          </div>
          <h2 className="font-display font-bold text-[34px] md:text-[46px] text-white leading-[1.1] mb-4">
            Meaningful Connections.{" "}
            <span className="text-teal-light">Real Opportunities.</span>
          </h2>
          <p className="text-[16px] leading-relaxed text-white/70 max-w-[52ch] mx-auto">
            Edubeacon goes beyond the exhibition floor. We create curated 1:1 meetings between schools looking for solutions and vendors with exactly what they need.
          </p>
        </div>

        {/* Flow Visualization */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-0 mb-14 overflow-x-auto pb-2">
          {steps.map((step, i) =>
            step.arrow ? (
              <div
                key={i}
                className="text-[24px] text-white/30 mx-2 rotate-90 md:rotate-0 shrink-0"
              >
                →
              </div>
            ) : (
              <div
                key={i}
                className="flex flex-col items-center text-center bg-white/10 border border-white/15 rounded-2xl p-5 min-w-[120px] hover:bg-white/15 transition-colors shrink-0"
              >
                <span className="text-3xl mb-2">{step.icon}</span>
                <p className="font-display font-bold text-[13px] text-white">{step.label}</p>
                <p className="text-[11px] text-white/60 mt-1 leading-snug">{step.desc}</p>
              </div>
            )
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-12">
          {[
            { value: "500+", label: "Schools in Network" },
            { value: "300+", label: "Verified Vendors" },
            { value: "2,000+", label: "Connections Made" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display font-bold text-[36px] text-teal-light leading-none">{s.value}</p>
              <p className="text-[13px] text-white/65 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            id="meetings-request"
            onClick={() => openModal("school-register")}
            className="bg-white text-edu-blue px-8 py-4 rounded-xl font-bold text-[15px] hover:bg-white/90 transition-colors shadow-lg"
          >
            Request a Connection →
          </button>
        </div>
      </Container>
    </section>
  );
}
