"use client";

import Image from "next/image";
import { useModal } from "./modals/ModalProvider";
import Container from "./ui/Container";
import { img } from "@/lib/images";

const steps = [
  {
    num: "01",
    title: "Tell us what you need",
    description: "Share your school's requirements, whether it's a STEM lab, an ERP system, or a digital learning platform.",
  },
  {
    num: "02",
    title: "Explore relevant solutions",
    description: "Browse solution providers in your category, compare features and read about their offerings.",
  },
  {
    num: "03",
    title: "Register your interest",
    description: "Click 'I'm Interested' on any vendor, we'll notify them and arrange an introduction.",
  },
  {
    num: "04",
    title: "We connect you",
    description: "Edubeacon personally connects your school with the right solution provider for a curated conversation.",
  },
];

const benefits = [
  "Discover verified and trusted solution providers",
  "Explore the latest education technologies",
  "Compare solutions across 25+ categories",
  "Connect directly with relevant vendors",
  "Attend exclusive education conferences",
  "Meet education innovators in person",
  "Discover AI, STEM and Robotics solutions",
  "Build meaningful long-term partnerships",
];

export default function ForSchools() {
  const { openModal } = useModal();

  return (
    <section id="for-schools" className="py-14 md:py-20 bg-[#F8FAF8]">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left */}
          <div className="reveal">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-[#0E733B] text-[11px] font-bold uppercase tracking-[0.2em] px-4.5 py-1.5 rounded-full mb-4 border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0E733B]" />
              <span>For Schools</span>
            </div>
            <h2 className="font-bold text-[34px] md:text-[44px] text-charcoal leading-[1.1] mb-4 tracking-tight">
              Empowering Schools to Find the{" "}
              <span className="text-[#0E733B]">Right Solutions</span>
            </h2>
            <p className="text-[16px] leading-relaxed text-slate-soft mb-8 font-normal">
              Whether you&#39;re looking for a new STEM lab, a better school management system or the latest EdTech tools, Edubeacon helps you find, evaluate and connect with the right partners.
            </p>

            {/* Benefits */}
            <ul className="flex flex-col gap-3 mb-10">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="#0E733B"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="text-[14.5px] text-slate-700 font-medium">{b}</span>
                </li>
              ))}
            </ul>

            <button
              id="for-schools-register"
              onClick={() => openModal("school-register")}
              className="bg-[#0E733B] hover:bg-[#0B5C2F] text-white px-8 py-4 rounded-full font-bold text-[15px] transition-all shadow-md hover:shadow-emerald-950/20"
            >
              Register Your School →
            </button>
          </div>

          {/* Right: Steps + Image */}
          <div className="reveal reveal-delay-2">
            <div className="relative rounded-2xl overflow-hidden mb-8 aspect-video shadow-xl border border-line">
              <Image
                src={img.smartClassroom}
                alt="Smart classroom with technology"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17]/50 to-transparent" />
            </div>

            {/* Step Cards */}
            <div className="grid grid-cols-2 gap-4">
              {steps.map((step) => (
                <div
                  key={step.num}
                  className="flex flex-col p-5 bg-white border border-line rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <span
                    className="font-bold text-[12px] uppercase tracking-[0.15em] mb-2 block text-[#0E733B]"
                  >
                    Step {step.num}
                  </span>
                  <h4 className="font-bold text-[14.5px] text-charcoal mb-1.5 leading-tight">
                    {step.title}
                  </h4>
                  <p className="text-[12.5px] text-slate-soft leading-snug font-normal">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

