"use client";

import { useModal } from "./modals/ModalProvider";
import Container from "./ui/Container";

export default function FinalCta() {
  const { openModal } = useModal();

  return (
    <section
      id="final-cta"
      className="py-24 md:py-32"
      style={{
        background:
          "linear-gradient(135deg, #EFF6FF 0%, #F0FDF9 50%, #EDE9FE 100%)",
      }}
    >
      <Container>
        <div className="text-center max-w-3xl mx-auto reveal">
          <div className="text-5xl mb-6">🚀</div>
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
