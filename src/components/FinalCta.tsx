"use client";

import { Rocket } from "lucide-react";
import { useModal } from "./modals/ModalProvider";
import Container from "./ui/Container";

export default function FinalCta() {
  const { openModal } = useModal();

  return (
    <section
      id="final-cta"
      className="relative overflow-hidden py-24 md:py-32 bg-[#0A0E17] text-white"
    >
      <div className="absolute inset-0 pointer-events-none opacity-50">
        <div className="absolute -top-20 -left-10 w-96 h-96 rounded-full bg-emerald-600/15 blur-3xl" />
        <div className="absolute top-10 right-0 w-80 h-80 rounded-full bg-teal-600/15 blur-3xl" />
      </div>
      <Container className="relative z-10">
        <div className="text-center max-w-3xl mx-auto reveal">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 items-center justify-center shadow-lg mb-6">
            <Rocket className="w-8 h-8 text-emerald-400" strokeWidth={1.75} />
          </div>
          <h2 className="font-bold text-[36px] md:text-[52px] text-white leading-[1.08] text-balance mb-5 tracking-tight">
            Let&apos;s Build the Future of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-200">
              Education Together
            </span>
          </h2>
          <p className="text-[16px] md:text-[17.5px] leading-relaxed text-slate-300/90 mb-10 max-w-[50ch] mx-auto font-normal">
            Whether you are a school looking for innovative solutions or a startup looking to connect with education leaders, Edubeacon helps create meaningful opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              id="final-cta-school"
              onClick={() => openModal("school-register")}
              className="bg-gradient-to-r from-[#0E733B] via-[#059669] to-[#10B981] text-white px-9 py-4 rounded-full font-bold text-[15px] hover:opacity-90 transition-all shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5"
            >
              Register Your School
            </button>
            <button
              id="final-cta-partner"
              onClick={() => openModal("vendor-register")}
              className="border border-emerald-400/40 text-emerald-300 bg-white/5 backdrop-blur-md px-9 py-4 rounded-full font-semibold text-[15px] hover:bg-emerald-500/10 transition-all"
            >
              Become a Partner
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}

