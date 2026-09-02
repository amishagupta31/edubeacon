"use client";

import Image from "next/image";
import { Target, School, BarChart3, Handshake, Mic, Megaphone, Rocket } from "lucide-react";
import { useModal } from "./modals/ModalProvider";
import Container from "./ui/Container";
import { img } from "@/lib/images";

const benefits = [
  { icon: Target, title: "Showcase Your Solution", desc: "Get listed on Edubeacon and reach schools actively looking for your product or service." },
  { icon: School, title: "Reach Decision-Makers", desc: "Connect directly with school owners, principals and education leaders." },
  { icon: BarChart3, title: "Generate Qualified Leads", desc: "Receive interest from schools that have already shown intent in your category." },
  { icon: Handshake, title: "Build Partnerships", desc: "Build long-term relationships with schools across India through the Edubeacon network." },
  { icon: Mic, title: "Speak at Conferences", desc: "Get speaking, panel and exhibition opportunities at Edubeacon events." },
  { icon: Megaphone, title: "Brand Visibility", desc: "Build awareness through Edubeacon's digital presence, magazine and events." },
];

export default function ForVendors() {
  const { openModal } = useModal();

  return (
    <section id="for-vendors" className="py-20 md:py-28 bg-mint-pastel/40">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <div className="reveal order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-xl">
              <Image
                src={img.exhibitionFloor}
                alt="Education exhibition floor"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-edu-blue/30 to-transparent" />
            </div>

            {/* Floating card */}
            <div className="bg-white rounded-2xl border border-line shadow-lg p-5 -mt-8 ml-6 relative z-10 max-w-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-muted rounded-xl flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-teal" strokeWidth={2} />
                </div>
                <div>
                  <p className="font-display font-bold text-[16px] text-edu-blue">300+ Vendors</p>
                  <p className="text-[12px] text-slate-soft">Already Listed on Edubeacon</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="reveal reveal-delay-2 order-1 lg:order-2">
            <div className="inline-block bg-teal-muted text-teal text-[11px] font-semibold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full mb-6 border border-teal/15">
              For Startups & Vendors
            </div>
            <h2 className="font-display font-bold text-[34px] md:text-[46px] text-charcoal leading-[1.1] mb-5">
              Connect Your Innovation with{" "}
              <span className="text-teal">the Right Schools</span>
            </h2>
            <p className="text-[15.5px] leading-relaxed text-slate-soft mb-8">
              Edubeacon is the most direct route from your product to the schools that need it. Stop cold-calling. Start building meaningful partnerships through India&#39;s education ecosystem platform.
            </p>

            {/* Benefits grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className="flex items-start gap-3 bg-white rounded-xl border border-line p-4"
                >
                  <div className="w-9 h-9 rounded-lg bg-teal-muted flex items-center justify-center shrink-0">
                    <b.icon className="w-[18px] h-[18px] text-teal" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="font-semibold text-[13.5px] text-charcoal mb-0.5">{b.title}</p>
                    <p className="text-[12.5px] text-slate-soft leading-snug">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                id="for-vendors-list"
                onClick={() => openModal("vendor-register")}
                className="bg-teal text-white px-8 py-4 rounded-xl font-semibold text-[15px] hover:bg-teal-light transition-all shadow-md hover:shadow-lg"
              >
                List Your Solution →
              </button>
              <button
                onClick={() => {
                  document.getElementById("sponsorship")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="border-2 border-teal text-teal px-8 py-4 rounded-xl font-semibold text-[15px] hover:bg-teal hover:text-white transition-all"
              >
                Explore Sponsorship
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
