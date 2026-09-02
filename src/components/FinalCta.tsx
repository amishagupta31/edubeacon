"use client";

import { Rocket } from "lucide-react";
import { useModal } from "./modals/ModalProvider";
import Container from "./ui/Container";

export default function FinalCta() {
  const { openModal } = useModal();

  return (
    <section
      id="final-cta"
      className="relative overflow-hidden py-24 md:py-32"
      style={{
        background:
          "linear-gradient(135deg, #EFF6FF 0%, #F0FDF9 50%, #EDE9FE 100%)",
      }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="bg-blob absolute -top-20 -left-10 w-72 h-72 rounded-full bg-white/50 blur-3xl" />
        <div className="bg-blob-slow absolute top-10 right-0 w-64 h-64 rounded-full bg-teal-muted/40 blur-3xl" />
        <div className="bg-blob-reverse absolute -bottom-16 left-1/3 w-80 h-80 rounded-full bg-rose-pastel/50 blur-3xl" />
      </div>
      <Container className="relative">
        <div className="text-center max-w-3xl mx-auto reveal">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-white items-center justify-center shadow-sm mb-6">
            <Rocket className="w-8 h-8 text-teal" strokeWidth={1.75} />
          </div>
          <h2 className="font-display font-bold text-[36px] md:text-[52px] text-charcoal leading-[1.08] text-balance mb-5">
            Let&apos;s Build the Future of{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #1E3A5F 0%, #0D9488 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Education Together
            </span>
          </h2>
          <p className="text-[16px] md:text-[17px] leading-relaxed text-slate-soft mb-10 max-w-[50ch] mx-auto">
            Whether you are a school looking for innovative solutions or a startup looking to connect with education leaders, Edubeacon helps create meaningful opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              id="final-cta-school"
              onClick={() => openModal("school-register")}
              className="bg-edu-blue text-white px-9 py-4 rounded-xl font-bold text-[15px] hover:bg-edu-blue-mid transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Register Your School
            </button>
            <button
              id="final-cta-partner"
              onClick={() => openModal("vendor-register")}
              className="border-2 border-teal text-teal bg-white px-9 py-4 rounded-xl font-bold text-[15px] hover:bg-teal hover:text-white transition-all shadow-sm hover:shadow-md"
            >
              Become a Partner
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
