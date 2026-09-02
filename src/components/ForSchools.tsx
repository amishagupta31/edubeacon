"use client";

import Image from "next/image";
import { useModal } from "./modals/ModalProvider";
import Container from "./ui/Container";
import { img } from "@/lib/images";

const steps = [
  {
    num: "01",
    title: "Tell us what you need",
    description: "Share your school's requirements — whether it's a STEM lab, an ERP system, or a digital learning platform.",
  },
  {
    num: "02",
    title: "Explore relevant solutions",
    description: "Browse solution providers in your category, compare features and read about their offerings.",
  },
  {
    num: "03",
    title: "Register your interest",
    description: "Click 'I'm Interested' on any vendor — we'll notify them and arrange an introduction.",
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
    <section id="for-schools" className="py-20 md:py-28 bg-sky-pastel/30">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div className="reveal">
            <div className="inline-block bg-edu-blue/10 text-edu-blue text-[11px] font-semibold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full mb-6 border border-edu-blue/15">
              For Schools
            </div>
            <h2 className="font-display font-bold text-[34px] md:text-[46px] text-charcoal leading-[1.1] mb-5">
              Empowering Schools to Find the{" "}
              <span className="text-edu-blue">Right Solutions</span>
            </h2>
            <p className="text-[15.5px] leading-relaxed text-slate-soft mb-8">
              Whether you&#39;re looking for a new STEM lab, a better school management system or the latest EdTech tools — Edubeacon helps you find, evaluate and connect with the right partners.
            </p>

            {/* Benefits */}
            <ul className="flex flex-col gap-3 mb-10">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-teal-muted flex items-center justify-center shrink-0">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="#0D9488"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="text-[14px] text-slate">{b}</span>
                </li>
              ))}
            </ul>

            <button
              id="for-schools-register"
              onClick={() => openModal("school-register")}
              className="bg-edu-blue text-white px-8 py-4 rounded-xl font-semibold text-[15px] hover:bg-edu-blue-mid transition-all shadow-md hover:shadow-lg"
            >
              Register Your School →
            </button>
          </div>

          {/* Right: Steps + Image */}
          <div className="reveal reveal-delay-2">
            <div className="relative rounded-2xl overflow-hidden mb-8 aspect-video shadow-xl">
              <Image
                src={img.smartClassroom}
                alt="Smart classroom with technology"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-edu-blue/40 to-transparent" />
            </div>

            {/* Step Cards — reference style */}
            <div className="grid grid-cols-2 gap-4">
              {steps.map((step) => (
                <div
                  key={step.num}
                  className="flex flex-col p-5"
                  style={{
                    background: "#E2E6EA",
                    borderRadius: "10px 40px 10px 40px",
                  }}
                >
                  <span
                    className="font-display font-bold text-[12px] uppercase tracking-[0.12em] mb-2 block"
                    style={{ color: "#1E3A5F" }}
                  >
                    Step {step.num}
                  </span>
                  <h4 className="font-semibold text-[14px] text-charcoal mb-1.5 leading-tight">
                    {step.title}
                  </h4>
                  <p className="text-[12.5px] text-slate-soft leading-snug">
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
