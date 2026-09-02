"use client";

import {
  ClipboardList,
  Search,
  Mail,
  CalendarCheck,
  Handshake,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { useModal } from "./modals/ModalProvider";
import Container from "./ui/Container";

type Step =
  | { arrow: true; icon?: never; label?: never; desc?: never }
  | { arrow?: never; icon: LucideIcon; label: string; desc: string };

const steps: Step[] = [
  { icon: ClipboardList, label: "Requirement", desc: "School shares what they need" },
  { arrow: true },
  { icon: Search, label: "Matching", desc: "Edubeacon identifies relevant vendors" },
  { arrow: true },
  { icon: Mail, label: "Introduction", desc: "We make the connection" },
  { arrow: true },
  { icon: CalendarCheck, label: "Curated Meeting", desc: "1:1 conversation at the event" },
  { arrow: true },
  { icon: Handshake, label: "Partnership", desc: "Long-term relationship built" },
];

export default function CuratedMeetings() {
  const { openModal } = useModal();

  return (
    <section id="meetings" className="relative overflow-hidden py-20 md:py-28 bg-lavender-pastel">
      <div className="absolute inset-0 pointer-events-none">
        <div className="bg-blob absolute top-0 right-0 w-80 h-80 rounded-full bg-sky-pastel/70 blur-3xl" />
        <div className="bg-blob-reverse absolute bottom-0 left-10 w-72 h-72 rounded-full bg-rose-pastel/60 blur-3xl" />
      </div>
      <Container className="relative">
        <div className="text-center mb-14 reveal">
          <div className="inline-block bg-white text-edu-blue text-[11px] font-semibold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full mb-5 border border-edu-blue/15 shadow-sm">
            Curated Connections
          </div>
          <h2 className="font-display font-bold text-[34px] md:text-[46px] text-charcoal leading-[1.1] mb-4">
            Meaningful Connections.{" "}
            <span className="text-teal">Real Opportunities.</span>
          </h2>
          <p className="text-[16px] leading-relaxed text-slate-soft max-w-[52ch] mx-auto">
            Edubeacon goes beyond the exhibition floor. We create curated 1:1 meetings between schools looking for solutions and vendors with exactly what they need.
          </p>
        </div>

        {/* Flow Visualization */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-0 mb-14 overflow-x-auto pb-2">
          {steps.map((step, i) =>
            step.arrow ? (
              <ArrowRight
                key={i}
                className="w-6 h-6 text-edu-blue/25 mx-2 rotate-90 md:rotate-0 shrink-0"
              />
            ) : (
              <div
                key={i}
                className="flex flex-col items-center text-center bg-white border border-line rounded-2xl p-5 min-w-[120px] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all shrink-0"
              >
                <div className="w-11 h-11 rounded-xl bg-teal-muted flex items-center justify-center mb-2.5">
                  <step.icon className="w-5 h-5 text-teal" strokeWidth={2} />
                </div>
                <p className="font-display font-bold text-[13px] text-charcoal">{step.label}</p>
                <p className="text-[11px] text-slate-soft mt-1 leading-snug">{step.desc}</p>
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
              <p className="font-display font-bold text-[36px] text-teal leading-none">{s.value}</p>
              <p className="text-[13px] text-slate-soft mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            id="meetings-request"
            onClick={() => openModal("school-register")}
            className="bg-edu-blue text-white px-8 py-4 rounded-xl font-bold text-[15px] hover:bg-edu-blue-mid transition-colors shadow-lg"
          >
            Request a Connection →
          </button>
        </div>
      </Container>
    </section>
  );
}
