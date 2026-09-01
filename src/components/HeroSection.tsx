"use client";

import Image from "next/image";
import { useModal } from "./modals/ModalProvider";
import { img } from "@/lib/images";

export default function HeroSection() {
  const { openModal } = useModal();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-[calc(100vh-72px)] flex items-center overflow-hidden bg-warm-ivory"
    >
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-1/2 h-full"
          style={{
            background: "linear-gradient(135deg, transparent 0%, #EFF6FF 40%, #F0FDF9 100%)",
          }}
        />
        <div className="absolute top-20 left-1/4 w-72 h-72 rounded-full bg-teal-muted/30 blur-3xl" />
        <div className="absolute bottom-20 right-1/3 w-96 h-96 rounded-full bg-sky-pastel/50 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Copy */}
          <div className="flex flex-col gap-6 reveal">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-teal-muted/60 border border-teal/20 rounded-full px-4 py-1.5 w-fit">
              <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
              <span className="text-[12px] font-semibold uppercase tracking-[0.15em] text-teal">
                Education Ecosystem Platform
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display font-bold text-[42px] md:text-[56px] lg:text-[52px] xl:text-[60px] leading-[1.08] text-charcoal text-balance">
              Connecting Schools with the{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #1E3A5F 0%, #0D9488 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Future of Education
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-[16px] md:text-[17px] leading-relaxed text-slate-soft max-w-[48ch]">
              Edubeacon connects schools, education leaders, startups, vendors
              and solution providers to create meaningful partnerships and
              discover the best solutions for the future of education.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                id="hero-explore-solutions"
                onClick={() => scrollTo("solutions")}
                className="bg-edu-blue text-white px-7 py-3.5 rounded-xl font-semibold text-[14px] hover:bg-edu-blue-mid transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Explore Solutions →
              </button>
              <button
                id="hero-join-Edubeacon"
                onClick={() => openModal("school-register")}
                className="border-2 border-teal text-teal px-7 py-3.5 rounded-xl font-semibold text-[14px] hover:bg-teal hover:text-white transition-all"
              >
                Join Edubeacon
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-5 pt-4 border-t border-line">
              {[
                { value: "500+", label: "Schools" },
                { value: "300+", label: "Vendors" },
                { value: "25+", label: "Categories" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-baseline gap-1.5">
                  <span className="font-display font-bold text-[24px] text-edu-blue">
                    {stat.value}
                  </span>
                  <span className="text-[13px] text-slate-soft">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Image */}
          <div className="relative reveal-delay-2">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
              <Image
                src={img.conferenceKeynote}
                alt="Edubeacon Education Leadership Conference"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-edu-blue/30 to-transparent" />
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl p-4 border border-line max-w-[200px]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-muted flex items-center justify-center text-xl">
                  📅
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-soft font-semibold">
                    Next Event
                  </p>
                  <p className="text-[13px] font-bold text-edu-blue">
                    March 15–16, 2027
                  </p>
                  <p className="text-[11px] text-slate-soft">New Delhi</p>
                </div>
              </div>
            </div>

            {/* Floating stat */}
            <div className="absolute -top-5 -right-5 bg-white rounded-2xl shadow-xl p-4 border border-line">
              <p className="text-[10px] uppercase tracking-wide text-slate-soft font-semibold mb-1">
                Trusted by
              </p>
              <p className="text-[28px] font-display font-bold text-teal leading-none">
                500+
              </p>
              <p className="text-[12px] text-slate-soft mt-0.5">Schools</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
